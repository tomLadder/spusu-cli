import type { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { getTariffs } from '../../api/tariffs.ts';
import { isLoggedIn } from '../../store/config.ts';

export function registerTariffCommands(program: Command): void {
  program
    .command('tariffs')
    .description('List all tariffs/contracts')
    .option('--json', 'Output as JSON')
    .action(async (options) => {
      if (!(await isLoggedIn())) {
        console.log(chalk.red('Not logged in. Run:'), 'spusu login');
        return;
      }

      const spinner = ora('Fetching tariffs...').start();
      const result = await getTariffs();

      if (!result.success || !result.data) {
        spinner.fail('Failed to fetch tariffs');
        console.log(chalk.red('Error:'), result.error);
        return;
      }

      spinner.stop();

      if (options.json) {
        console.log(JSON.stringify(result.data, null, 2));
        return;
      }

      if (result.data.length === 0) {
        console.log(chalk.yellow('No tariffs found'));
        return;
      }

      console.log();
      for (const tariff of result.data) {
        console.log(chalk.bold(tariff.tariffName));
        console.log(chalk.gray('─'.repeat(40)));
        console.log(chalk.cyan('Phone:'), tariff.phoneNumber);
        console.log(chalk.cyan('Type:'), tariff.contractType);
        console.log(chalk.cyan('Owner:'), `${tariff.firstname} ${tariff.lastname}`);
        console.log(chalk.cyan('Status:'), tariff.status);
        if (tariff.portingDateTime) {
          console.log(chalk.cyan('Ported:'), tariff.portingDateTime.split('T')[0]);
        }
        console.log();
      }
    });
}
