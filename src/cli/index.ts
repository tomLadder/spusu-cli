import { Command } from 'commander';
import { registerAuthCommands } from './commands/auth.ts';
import { registerInvoiceCommands } from './commands/invoices.ts';
import { registerTariffCommands } from './commands/tariffs.ts';
import { registerConfigCommands } from './commands/config.ts';

export function createCLI(): Command {
  const program = new Command();

  program
    .name('spusu')
    .description('Unofficial CLI for spusu.at - Austrian mobile provider')
    .version('0.0.1');

  // Register all command groups
  registerAuthCommands(program);
  registerInvoiceCommands(program);
  registerTariffCommands(program);
  registerConfigCommands(program);

  return program;
}
