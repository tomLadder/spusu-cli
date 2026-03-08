# spusu-cli for LLMs

This guide helps AI assistants use spusu-cli effectively.

## Overview

spusu-cli is a command-line tool for interacting with spusu.at, an Austrian mobile provider. It allows users to manage their account, view invoices, and download bills.

## Installation

```bash
curl -fsSL https://raw.githubusercontent.com/tomLadder/spusu-cli/main/install.sh | sh
```

Pre-built binaries are also available on the [Releases page](https://github.com/tomLadder/spusu-cli/releases).

## Authentication

spusu uses SMS TAN-based authentication:

1. User provides their phone number
2. spusu sends a TAN code via SMS
3. User enters the TAN code to complete login
4. Session is stored locally in `~/.spusu/config.json`

### Interactive Login

```bash
spusu login
spusu login --phone +43699XXXXXXXX
```

### Non-Interactive Login (for AI Agents)

Use the `--json` flag for machine-readable output in a two-step flow:

```bash
# Step 1: Request TAN code
spusu login --phone +43699XXXXXXXX --json
```

Response:
```json
{
  "success": true,
  "step": "tan_sent",
  "message": "TAN code sent via SMS. Call again with --tan <code>"
}
```

```bash
# Step 2: Complete login with TAN code (user provides the code they received)
spusu login --phone +43699XXXXXXXX --tan ABC123 --json
```

Response:
```json
{
  "success": true,
  "user": {
    "loggedIn": true,
    "name": "John Doe",
    "billingContractId": 1234567
  }
}
```

Error response:
```json
{
  "success": false,
  "error": "Invalid TAN code"
}
```

## Common Tasks

### Check Login Status

```bash
spusu status
# or
spusu whoami
```

### List Invoices

```bash
# All invoices for current year
spusu invoices list

# For specific year
spusu invoices list --year 2025

# As JSON for parsing
spusu invoices list --json
```

### Download Invoice

```bash
# Download as PDF
spusu invoices download <invoice-id> --year <year>

# Download itemised bill as Excel
spusu invoices download <invoice-id> --year <year> --excel

# Custom output path
spusu invoices download <invoice-id> --output /path/to/invoice.pdf
```

### View Tariffs

```bash
spusu tariffs
spusu tariffs --json
```

## JSON Output

All commands support `--json` flag for machine-readable output:

```bash
spusu whoami --json
spusu invoices list --json
spusu tariffs --json
```

## Error Handling

### Not Logged In

If a command fails with "Not logged in", run:

```bash
spusu login
```

### Session Expired

Sessions may expire. Re-authenticate with:

```bash
spusu login
```

## Scripting Tips

### Get Customer Number

```bash
spusu whoami --json | jq -r '.customerNumber'
```

### Get Latest Invoice ID

```bash
spusu invoices list --json | jq -r '.invoices[0].id'
```

### Calculate Total Spent

```bash
spusu invoices list --json | jq '[.invoices[].total.amount] | add'
```

### Download All Invoices

```bash
for id in $(spusu invoices list --json | jq -r '.invoices[].id'); do
  spusu invoices download "$id" --year 2026
done
```

## Configuration

Config stored at: `~/.spusu/config.json`

```bash
# View config
spusu config get

# Set default output format
spusu config set outputFormat json

# Reset to defaults
spusu config reset
```

## Data Types

### Invoice Object

```json
{
  "id": 123456,
  "billperiod": "02.2026",
  "invoiceNumber": "SR-123456/2026",
  "invoiceDate": "2026-03-02",
  "total": {
    "amount": 14.90,
    "currencyCode": "EUR"
  },
  "status": "PAID",
  "statusText": "Bezahlt"
}
```

### Tariff Object

```json
{
  "phoneNumber": "+43699XXXXXXXX",
  "tariffName": "spusu 5G legendär",
  "contractType": "POSTPAID",
  "status": "FINISHED"
}
```

### Customer Object

```json
{
  "customerNumber": "1234567",
  "firstName": "John",
  "lastName": "Doe",
  "eMail": "example@email.at",
  "street": "Example Street 1",
  "zip": "1010",
  "city": "Vienna",
  "country": "AT"
}
```

## Tips for AI Assistants

1. Always check login status before running authenticated commands
2. Use `--json` flag when parsing output programmatically
3. Invoice IDs are numeric and year-specific
4. Phone numbers must be in Austrian format (+43...)
5. Session may expire - handle "Not logged in" errors gracefully
