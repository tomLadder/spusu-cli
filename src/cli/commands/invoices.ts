import type { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { getInvoices, downloadInvoicePdf, downloadInvoiceExcel } from '../../api/invoices.ts';
import { isLoggedIn } from '../../store/config.ts';
import { join } from 'path';

export function registerInvoiceCommands(program: Command): void {
  const invoices = program
    .command('invoices')
    .description('Manage invoices');

  invoices
    .command('list')
    .description('List all invoices')
    .option('-y, --year <year>', 'Filter by year')
    .option('--json', 'Output as JSON')
    .action(async (options) => {
      if (!(await isLoggedIn())) {
        console.log(chalk.red('Not logged in. Run:'), 'spusu login');
        return;
      }

      const spinner = ora('Fetching invoices...').start();
      const year = options.year ? parseInt(options.year, 10) : undefined;
      const result = await getInvoices(year);

      if (!result.success || !result.data) {
        spinner.fail('Failed to fetch invoices');
        console.log(chalk.red('Error:'), result.error);
        return;
      }

      spinner.stop();

      if (options.json) {
        console.log(JSON.stringify(result.data, null, 2));
        return;
      }

      const data = result.data;
      console.log();
      console.log(chalk.bold(`Invoices for ${data.year}`));
      console.log(chalk.gray(`Contract started: ${data.contractStartMonth}/${data.contractStartYear}`));
      console.log(chalk.gray(`Payment: ${data.paymentMethod} (${data.paymentMethodState})`));
      console.log();

      if (data.invoices.length === 0) {
        console.log(chalk.yellow('No invoices found'));
        return;
      }

      console.log(chalk.gray('─'.repeat(70)));
      console.log(
        chalk.bold(padRight('ID', 10)),
        chalk.bold(padRight('Period', 10)),
        chalk.bold(padRight('Date', 12)),
        chalk.bold(padRight('Amount', 12)),
        chalk.bold(padRight('Status', 10))
      );
      console.log(chalk.gray('─'.repeat(70)));

      for (const invoice of data.invoices) {
        const statusColor = invoice.status === 'PAID' ? chalk.green : chalk.yellow;
        console.log(
          padRight(invoice.id.toString(), 10),
          padRight(invoice.billperiod, 10),
          padRight(invoice.invoiceDate, 12),
          padRight(`€${invoice.total.amount.toFixed(2)}`, 12),
          statusColor(padRight(invoice.statusText, 10))
        );
      }
      console.log();
    });

  invoices
    .command('download <id>')
    .description('Download invoice as PDF')
    .option('-y, --year <year>', 'Invoice year (defaults to current year)')
    .option('-o, --output <path>', 'Output file path')
    .option('--excel', 'Download itemised bill as Excel instead of PDF')
    .action(async (id, options) => {
      if (!(await isLoggedIn())) {
        console.log(chalk.red('Not logged in. Run:'), 'spusu login');
        return;
      }

      const invoiceId = parseInt(id, 10);
      const year = options.year ? parseInt(options.year, 10) : new Date().getFullYear();

      const extension = options.excel ? 'xlsx' : 'pdf';
      const outputPath = options.output || join(
        process.cwd(),
        `spusu-invoice-${invoiceId}.${extension}`
      );

      const spinner = ora(`Downloading invoice ${invoiceId}...`).start();

      const result = options.excel
        ? await downloadInvoiceExcel(invoiceId, year, outputPath)
        : await downloadInvoicePdf(invoiceId, year, outputPath);

      if (!result.success) {
        spinner.fail('Download failed');
        console.log(chalk.red('Error:'), result.error);
        return;
      }

      spinner.succeed(`Invoice downloaded to: ${outputPath}`);
    });

  invoices
    .command('get <id>')
    .description('Get invoice details')
    .option('-y, --year <year>', 'Invoice year (defaults to current year)')
    .option('--json', 'Output as JSON')
    .action(async (id, options) => {
      if (!(await isLoggedIn())) {
        console.log(chalk.red('Not logged in. Run:'), 'spusu login');
        return;
      }

      const invoiceId = parseInt(id, 10);
      const year = options.year ? parseInt(options.year, 10) : undefined;

      const spinner = ora('Fetching invoice...').start();
      const result = await getInvoices(year);

      if (!result.success || !result.data) {
        spinner.fail('Failed to fetch invoice');
        console.log(chalk.red('Error:'), result.error);
        return;
      }

      const invoice = result.data.invoices.find((inv) => inv.id === invoiceId);

      if (!invoice) {
        spinner.fail('Invoice not found');
        return;
      }

      spinner.stop();

      if (options.json) {
        console.log(JSON.stringify(invoice, null, 2));
        return;
      }

      console.log();
      console.log(chalk.bold('Invoice Details'));
      console.log(chalk.gray('─'.repeat(40)));
      console.log(chalk.cyan('ID:'), invoice.id);
      console.log(chalk.cyan('Number:'), invoice.invoiceNumber);
      console.log(chalk.cyan('Period:'), invoice.billperiod);
      console.log(chalk.cyan('Date:'), invoice.invoiceDate);
      console.log(chalk.cyan('Amount:'), `€${invoice.total.amount.toFixed(2)} ${invoice.total.currencyCode}`);
      console.log(chalk.cyan('Status:'), invoice.statusText);
      console.log(chalk.cyan('Delivery:'), invoice.deliveryText);
      console.log(chalk.cyan('Download available:'), invoice.download ? 'Yes' : 'No');
      console.log(chalk.cyan('Itemised bill:'), invoice.itemisedBill ? 'Yes' : 'No');
    });
}

function padRight(str: string, len: number): string {
  return str.padEnd(len);
}
