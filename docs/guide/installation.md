# Installation

## Prerequisites

- [Bun](https://bun.sh) v1.0 or higher

## From Source

```bash
# Clone the repository
git clone https://github.com/tomLadder/spusu-cli.git
cd spusu-cli

# Install dependencies
bun install

# Build the standalone executable
bun run build

# Move to your PATH (optional)
mv dist/spusu /usr/local/bin/
```

## Development Mode

If you want to run without building:

```bash
bun run dev -- --help
bun run dev login
bun run dev invoices list
```

## Verify Installation

```bash
spusu --version
# Output: 0.0.1

spusu --help
```

## Updating

```bash
cd spusu-cli
git pull
bun install
bun run build
mv dist/spusu /usr/local/bin/
```
