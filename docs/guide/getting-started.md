# Getting Started

spusu-cli is an unofficial command-line interface for managing your spusu.at mobile account.

## Quick Start

### 1. Install

```bash
# Clone and build
git clone https://github.com/tomLadder/spusu-cli.git
cd spusu-cli
bun install
bun run build

# Move to PATH
mv dist/spusu /usr/local/bin/
```

### 2. Login

```bash
spusu login
```

You'll receive a TAN code via SMS to complete authentication.

### 3. Explore

```bash
# View your profile
spusu whoami

# List your tariffs
spusu tariffs

# List invoices
spusu invoices list

# Download an invoice
spusu invoices download 1234567 --year 2026
```

## What's Next?

- [Installation](/guide/installation) - Detailed installation instructions
- [Configuration](/guide/configuration) - Configure the CLI
- [Commands](/commands/) - Full command reference
