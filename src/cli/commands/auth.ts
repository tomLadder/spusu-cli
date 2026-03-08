import type { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import prompts from 'prompts';
import { requestTan, login, logout, getStatus } from '../../api/auth.ts';
import { getCustomer } from '../../api/customer.ts';
import { isLoggedIn, getAuth } from '../../store/config.ts';

export function registerAuthCommands(program: Command): void {
  program
    .command('login')
    .description('Login to spusu.at with your phone number')
    .option('-p, --phone <phone>', 'Phone number (e.g., +4369912345678)')
    .option('-t, --tan <code>', 'TAN code (for non-interactive login)')
    .option('--json', 'Output as JSON')
    .action(async (options) => {
      const jsonOutput = options.json;

      // Check if already logged in
      if (await isLoggedIn()) {
        const status = await getStatus();
        if (status.success && status.data?.loggedIn) {
          if (jsonOutput) {
            console.log(JSON.stringify({ success: false, error: 'Already logged in', user: status.data.name }));
            return;
          }
          console.log(chalk.yellow('Already logged in as:'), status.data.name);
          const { confirmLogout } = await prompts({
            type: 'confirm',
            name: 'confirmLogout',
            message: 'Do you want to logout and login again?',
            initial: false,
          });
          if (!confirmLogout) {
            return;
          }
          await logout();
        }
      }

      // Get phone number
      let phoneNumber = options.phone;
      if (!phoneNumber) {
        if (jsonOutput) {
          console.log(JSON.stringify({ success: false, error: 'Phone number required (--phone)' }));
          return;
        }
        const response = await prompts({
          type: 'text',
          name: 'phone',
          message: 'Enter your phone number (e.g., +4369912345678):',
          validate: (value) => {
            if (!value.match(/^\+43[0-9]{10,12}$/)) {
              return 'Please enter a valid Austrian phone number starting with +43';
            }
            return true;
          },
        });
        phoneNumber = response.phone;
        if (!phoneNumber) {
          console.log(chalk.red('Login cancelled'));
          return;
        }
      }

      // If TAN provided, skip request and go straight to login
      if (options.tan) {
        const loginResult = await login(phoneNumber, options.tan);
        if (!loginResult.success) {
          if (jsonOutput) {
            console.log(JSON.stringify({ success: false, error: loginResult.error }));
          } else {
            console.log(chalk.red('Login failed:'), loginResult.error);
          }
          return;
        }
        if (jsonOutput) {
          console.log(JSON.stringify({ success: true, user: loginResult.data }));
        } else {
          console.log(chalk.green('Login successful. Welcome,'), loginResult.data?.name || 'User');
        }
        return;
      }

      // Request TAN
      const spinner = jsonOutput ? null : ora('Requesting TAN code...').start();
      const tanResult = await requestTan(phoneNumber);

      if (!tanResult.success) {
        if (jsonOutput) {
          console.log(JSON.stringify({ success: false, error: tanResult.error, step: 'request_tan' }));
        } else {
          spinner?.fail('Failed to request TAN');
          console.log(chalk.red('Error:'), tanResult.error);
        }
        return;
      }

      if (jsonOutput) {
        console.log(JSON.stringify({ success: true, step: 'tan_sent', message: 'TAN code sent via SMS. Call again with --tan <code>' }));
        return;
      }

      spinner?.succeed('TAN code sent via SMS');

      // Get TAN code
      const { tanCode } = await prompts({
        type: 'text',
        name: 'tanCode',
        message: 'Enter the TAN code from SMS:',
        validate: (value) => {
          if (!value || value.length < 3) {
            return 'Please enter the TAN code';
          }
          return true;
        },
      });

      if (!tanCode) {
        console.log(chalk.red('Login cancelled'));
        return;
      }

      // Login
      const loginSpinner = ora('Logging in...').start();
      const loginResult = await login(phoneNumber, tanCode);

      if (!loginResult.success) {
        loginSpinner.fail('Login failed');
        console.log(chalk.red('Error:'), loginResult.error);
        return;
      }

      loginSpinner.succeed('Login successful');
      console.log(chalk.green('Welcome,'), loginResult.data?.name || 'User');
    });

  program
    .command('logout')
    .description('Logout from spusu.at')
    .action(async () => {
      if (!(await isLoggedIn())) {
        console.log(chalk.yellow('Not logged in'));
        return;
      }

      await logout();
      console.log(chalk.green('Logged out successfully'));
    });

  program
    .command('whoami')
    .description('Show current user information')
    .option('--json', 'Output as JSON')
    .action(async (options) => {
      if (!(await isLoggedIn())) {
        console.log(chalk.red('Not logged in. Run:'), 'spusu login');
        return;
      }

      const spinner = ora('Fetching user info...').start();
      const result = await getCustomer();

      if (!result.success || !result.data) {
        spinner.fail('Failed to fetch user info');
        console.log(chalk.red('Error:'), result.error);
        return;
      }

      spinner.stop();

      if (options.json) {
        console.log(JSON.stringify(result.data, null, 2));
        return;
      }

      const customer = result.data;
      console.log();
      console.log(chalk.bold('Customer Information'));
      console.log(chalk.gray('─'.repeat(40)));
      console.log(chalk.cyan('Customer #:'), customer.customerNumber);
      console.log(chalk.cyan('Name:'), `${customer.firstName} ${customer.lastName}`);
      console.log(chalk.cyan('Email:'), customer.eMail);
      console.log(chalk.cyan('Birth Date:'), customer.dateOfBirth);
      console.log();
      console.log(chalk.bold('Address'));
      console.log(chalk.gray('─'.repeat(40)));
      console.log(chalk.cyan('Street:'), customer.street);
      console.log(chalk.cyan('City:'), `${customer.zip} ${customer.city}`);
      console.log(chalk.cyan('Country:'), customer.country);
    });

  program
    .command('status')
    .description('Check login status')
    .option('--json', 'Output as JSON')
    .action(async (options) => {
      const auth = await getAuth();
      const status = await getStatus();

      if (options.json) {
        console.log(JSON.stringify({
          loggedIn: status.data?.loggedIn || false,
          phoneNumber: auth?.phoneNumber,
          ...status.data,
        }, null, 2));
        return;
      }

      if (!status.success || !status.data?.loggedIn) {
        console.log(chalk.yellow('Not logged in'));
        return;
      }

      console.log(chalk.green('Logged in as:'), status.data.name);
      if (auth?.phoneNumber) {
        console.log(chalk.cyan('Phone:'), auth.phoneNumber);
      }
      console.log(chalk.cyan('Contract ID:'), status.data.billingContractId);
      console.log(chalk.cyan('Admin:'), status.data.isContractAdmin ? 'Yes' : 'No');
    });
}
