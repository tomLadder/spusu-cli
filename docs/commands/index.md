# Commands

Quick reference for all spusu-cli commands.

## Authentication

| Command | Description |
|---------|-------------|
| [`login`](/commands/login) | Login with SMS TAN verification |
| [`logout`](/commands/logout) | Logout and clear session |
| [`whoami`](/commands/whoami) | Show current user information |
| [`status`](/commands/status) | Check login status |

## Account

| Command | Description |
|---------|-------------|
| [`tariffs`](/commands/tariffs) | List all tariffs/contracts |
| [`invoices list`](/commands/invoices#list) | List all invoices |
| [`invoices get`](/commands/invoices#get) | Get invoice details |
| [`invoices download`](/commands/invoices#download) | Download invoice as PDF or Excel |

## Configuration

| Command | Description |
|---------|-------------|
| [`config get`](/commands/config#get) | Show current configuration |
| [`config set`](/commands/config#set) | Set a configuration value |
| [`config reset`](/commands/config#reset) | Reset to defaults |
| [`config path`](/commands/config#path) | Show config file path |

## Global Options

All commands support:

| Option | Description |
|--------|-------------|
| `--json` | Output as JSON (for scripting) |
| `--help` | Show command help |
| `--version` | Show version |
