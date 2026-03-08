<h1 align="center">📱 spusu-cli</h1>

<p align="center">
  <strong>The unofficial command-line interface for spusu.at</strong>
</p>

<p align="center">
  Manage your spusu mobile account directly from the terminal. Built with TypeScript, powered by Bun.
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#installation">Installation</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#commands">Commands</a> •
  <a href="#configuration">Configuration</a> •
  <a href="#contributing">Contributing</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-0.0.1-blue.svg" alt="Version">
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License">
  <img src="https://img.shields.io/badge/bun-%3E%3D1.0-black.svg" alt="Bun">
  <img src="https://img.shields.io/badge/TypeScript-5.4-blue.svg" alt="TypeScript">
  <img src="https://img.shields.io/badge/platform-macOS%20%7C%20Linux%20%7C%20Windows-lightgrey.svg" alt="Platform">
</p>

---

> [!CAUTION]
> **Legal Disclaimer / Rechtlicher Hinweis**
>
> This is an **unofficial** tool and is **not affiliated** with spusu (Mass Response Service GmbH). Using this program may violate spusu's terms of service. You are solely responsible for ensuring your use complies with applicable terms and laws. The developers accept no liability for any damages or legal consequences arising from its use. **Use at your own risk.**
>
> Dies ist ein **inoffizielles** Tool und steht in **keiner Verbindung** zu spusu (Mass Response Service GmbH). Die Verwendung dieses Programms kann gegen die Nutzungsbedingungen von spusu verstoßen. Sie sind selbst dafür verantwortlich, die Rechtmäßigkeit Ihrer Nutzung sicherzustellen. Die Entwickler übernehmen keine Haftung für Schäden oder rechtliche Konsequenzen. **Die Nutzung erfolgt auf eigenes Risiko.**

---

## Features

**Account Management**
- View customer information
- Check login status
- Secure SMS TAN authentication

**Invoice Management**
- List all invoices with status
- Download invoices as PDF
- Download itemised bills as Excel
- Filter by year

**Tariff Information**
- View active tariffs and contracts
- See contract details and status

**Developer Experience**
- JSON output for scripting and AI agents
- Beautiful terminal UI with spinners
- Cross-platform compatibility

---

## Installation

### Prerequisites

- [Bun](https://bun.sh) v1.0 or higher

### From Source

```bash
# Clone the repository
git clone https://github.com/yourusername/spusu-cli.git
cd spusu-cli

# Install dependencies
bun install

# Build the standalone executable
bun run build

# Move to your PATH (optional)
mv dist/spusu /usr/local/bin/
```

### Development Mode

```bash
# Run directly without building
bun run dev -- --help
```

---

## Quick Start

### 1. Login to your account

```bash
spusu login
```

You'll receive a TAN code via SMS to complete authentication.

### 2. Check your identity

```bash
spusu whoami
```

### 3. List your invoices

```bash
spusu invoices list
```

### 4. Download an invoice

```bash
spusu invoices download 1234567 --year 2026
```

---

## Commands

### Quick Reference

| Command | Description |
|---------|-------------|
| `spusu login` | Authenticate with SMS TAN |
| `spusu logout` | Clear stored credentials |
| `spusu whoami` | Display current user info |
| `spusu status` | Check login status |
| `spusu invoices list` | List all invoices |
| `spusu invoices get <id>` | Get invoice details |
| `spusu invoices download <id>` | Download invoice as PDF or Excel |
| `spusu tariffs` | List all tariffs/contracts |
| `spusu config get` | Show all settings |
| `spusu config set <key> <value>` | Set a configuration value |
| `spusu config reset` | Reset to defaults |
| `spusu config path` | Show config file location |

### Global Options

These options are available on all commands:

| Option | Description |
|--------|-------------|
| `-h, --help` | Display help for the command |
| `-V, --version` | Display CLI version (root command only) |

```bash
# Show general help
spusu --help

# Show help for a specific command
spusu login --help
spusu invoices --help
spusu invoices download --help

# Show version
spusu --version
```

---

## Command Reference

### `spusu login`

Authenticate with your spusu account using SMS TAN verification.

```bash
spusu login [options]
```

| Option | Description |
|--------|-------------|
| `-p, --phone <phone>` | Phone number in Austrian format (e.g., `+4369912345678`) |
| `-t, --tan <code>` | TAN code received via SMS (for non-interactive login) |
| `--json` | Output result as JSON |

**Examples:**

```bash
# Interactive login (prompts for phone and TAN)
spusu login

# Provide phone number upfront
spusu login --phone +4369912345678

# Non-interactive two-step login (for scripts/AI agents)
spusu login --phone +4369912345678 --json          # Step 1: Request TAN
spusu login --phone +4369912345678 --tan ABC123 --json  # Step 2: Complete login
```

---

### `spusu logout`

Clear stored session and credentials.

```bash
spusu logout
```

No options available.

---

### `spusu whoami`

Display detailed information about the currently logged-in user.

```bash
spusu whoami [options]
```

| Option | Description |
|--------|-------------|
| `--json` | Output result as JSON |

**Examples:**

```bash
# Pretty output
spusu whoami

# JSON output (for scripting)
spusu whoami --json
```

---

### `spusu status`

Check current login status and session information.

```bash
spusu status [options]
```

| Option | Description |
|--------|-------------|
| `--json` | Output result as JSON |

**Examples:**

```bash
# Pretty output
spusu status

# JSON output
spusu status --json
```

---

### `spusu invoices list`

List all invoices for a given year.

```bash
spusu invoices list [options]
```

| Option | Description |
|--------|-------------|
| `-y, --year <year>` | Filter by year (defaults to current year) |
| `--json` | Output result as JSON |

**Examples:**

```bash
# List invoices for current year
spusu invoices list

# List invoices for specific year
spusu invoices list --year 2025
spusu invoices list -y 2024

# JSON output
spusu invoices list --json
spusu invoices list --year 2025 --json
```

---

### `spusu invoices get <id>`

Get detailed information about a specific invoice.

```bash
spusu invoices get <id> [options]
```

| Argument | Description |
|----------|-------------|
| `<id>` | Invoice ID (numeric) |

| Option | Description |
|--------|-------------|
| `-y, --year <year>` | Invoice year (defaults to current year) |
| `--json` | Output result as JSON |

**Examples:**

```bash
# Get invoice details
spusu invoices get 1234567

# Get invoice from specific year
spusu invoices get 1234567 --year 2025
spusu invoices get 1234567 -y 2025

# JSON output
spusu invoices get 1234567 --json
```

---

### `spusu invoices download <id>`

Download an invoice as PDF or itemised bill as Excel.

```bash
spusu invoices download <id> [options]
```

| Argument | Description |
|----------|-------------|
| `<id>` | Invoice ID (numeric) |

| Option | Description |
|--------|-------------|
| `-y, --year <year>` | Invoice year (defaults to current year) |
| `-o, --output <path>` | Custom output file path |
| `--excel` | Download itemised bill as Excel (.xlsx) instead of PDF |

**Examples:**

```bash
# Download invoice as PDF (default)
spusu invoices download 1234567

# Specify year
spusu invoices download 1234567 --year 2026
spusu invoices download 1234567 -y 2026

# Custom output path
spusu invoices download 1234567 --output ~/invoices/march-2026.pdf
spusu invoices download 1234567 -o /path/to/invoice.pdf

# Download itemised bill as Excel
spusu invoices download 1234567 --excel

# Combine options
spusu invoices download 1234567 --year 2026 --excel --output ~/bills/march.xlsx
```

---

### `spusu tariffs`

List all tariffs and contracts associated with your account.

```bash
spusu tariffs [options]
```

| Option | Description |
|--------|-------------|
| `--json` | Output result as JSON |

**Examples:**

```bash
# Pretty output
spusu tariffs

# JSON output
spusu tariffs --json
```

---

### `spusu config get`

Display current CLI configuration.

```bash
spusu config get [options]
```

| Option | Description |
|--------|-------------|
| `--json` | Output result as JSON |

**Examples:**

```bash
# Pretty output
spusu config get

# JSON output
spusu config get --json
```

---

### `spusu config set <key> <value>`

Set a configuration value.

```bash
spusu config set <key> <value>
```

| Argument | Description |
|----------|-------------|
| `<key>` | Configuration key (see available keys below) |
| `<value>` | Value to set |

**Available Keys:**

| Key | Values | Description |
|-----|--------|-------------|
| `outputFormat` | `pretty`, `json` | Default output format for all commands |

**Examples:**

```bash
# Set default output to JSON
spusu config set outputFormat json

# Set default output to pretty (human-readable)
spusu config set outputFormat pretty
```

---

### `spusu config reset`

Reset all configuration to default values. This clears settings but preserves authentication.

```bash
spusu config reset
```

No options available.

---

### `spusu config path`

Display the path to the configuration file.

```bash
spusu config path
```

No options available.

**Example output:**

```
/Users/username/.spusu/config.json
```

---

## Configuration

Configuration is stored in `~/.spusu/`:

| File | Description |
|------|-------------|
| `config.json` | Settings and session data |

### Available Settings

| Key | Values | Default | Description |
|-----|--------|---------|-------------|
| `outputFormat` | `pretty`, `json` | `pretty` | Default output format |

---

## Scripting & Automation

### JSON Output

All commands support `--json` for machine-readable output:

```bash
# Get customer number
spusu whoami --json | jq '.customerNumber'

# Get latest invoice ID
spusu invoices list --json | jq '.invoices[0].id'

# Calculate total spent this year
spusu invoices list --json | jq '[.invoices[].total.amount] | add'
```

### Batch Operations

```bash
# Download all invoices for a year
for id in $(spusu invoices list --year 2026 --json | jq -r '.invoices[].id'); do
  spusu invoices download "$id" --year 2026
done

# Export invoice summary to CSV
spusu invoices list --json | jq -r '.invoices[] | [.invoiceDate, .invoiceNumber, .total.amount] | @csv'
```

---

## Architecture

```
src/
├── index.ts           # CLI entry point
├── api/
│   ├── client.ts      # HTTP client with session handling
│   ├── auth.ts        # SMS TAN authentication
│   ├── customer.ts    # Customer info
│   ├── invoices.ts    # Invoice operations
│   └── tariffs.ts     # Tariff information
├── cli/
│   └── commands/      # Command implementations
├── store/
│   └── config.ts      # Configuration management
└── types/
    └── index.ts       # TypeScript interfaces
```

---

## Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) before submitting a PR.

---

## FAQ

<details>
<summary><strong>How does authentication work?</strong></summary>

spusu uses SMS TAN-based authentication:
1. You provide your phone number
2. spusu sends a TAN code via SMS
3. You enter the TAN code to complete login
4. The session is stored locally in `~/.spusu/config.json`
</details>

<details>
<summary><strong>How long does a session last?</strong></summary>

Session duration is determined by spusu's servers. If your session expires, simply run `spusu login` again.
</details>

<details>
<summary><strong>Where are my credentials stored?</strong></summary>

Your session is stored in `~/.spusu/config.json` with secure file permissions (0600). Only the session ID is stored, not your password or TAN codes.
</details>

<details>
<summary><strong>Can I use this with multiple phone numbers?</strong></summary>

Currently, only one session is supported at a time. Logging in with a different number will replace the existing session.
</details>

---

## Acknowledgments

- Built with [Bun](https://bun.sh) - The fast JavaScript runtime
- CLI powered by [Commander.js](https://github.com/tj/commander.js)
- Beautiful output with [Chalk](https://github.com/chalk/chalk) and [Ora](https://github.com/sindresorhus/ora)

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <sub>Made with care in Austria</sub>
</p>
