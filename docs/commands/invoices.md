# invoices

Manage invoices - list, view details, and download.

## Subcommands

| Command | Description |
|---------|-------------|
| `list` | List all invoices |
| `get` | Get invoice details |
| `download` | Download invoice as PDF or Excel |

---

## list

List all invoices for a year.

### Usage

```bash
spusu invoices list [options]
```

### Options

| Option | Description |
|--------|-------------|
| `-y, --year <year>` | Filter by year |
| `--json` | Output as JSON |

### Example

```bash
spusu invoices list --year 2026

# Invoices for 2026
# Contract started: 1/2024
# Payment: SEPA (ACTIVE)
#
# ──────────────────────────────────────────────────────────────────────
# ID         Period     Date         Amount       Status
# ──────────────────────────────────────────────────────────────────────
# 1234567    01/2026    2026-02-01   €12.90       Paid
# 1234568    02/2026    2026-03-01   €12.90       Open
```

---

## get

Get details for a specific invoice.

### Usage

```bash
spusu invoices get <id> [options]
```

### Options

| Option | Description |
|--------|-------------|
| `-y, --year <year>` | Invoice year (defaults to current year) |
| `--json` | Output as JSON |

### Example

```bash
spusu invoices get 1234567 --year 2026

# Invoice Details
# ────────────────────────────────────────
# ID: 1234567
# Number: RE-2026-001234
# Period: 01/2026
# Date: 2026-02-01
# Amount: €12.90 EUR
# Status: Paid
# Delivery: Email
# Download available: Yes
# Itemised bill: Yes
```

### JSON Output

```bash
spusu invoices get 1234567 --json
```

```json
{
  "id": 1234567,
  "invoiceNumber": "RE-2026-001234",
  "billperiod": "01/2026",
  "invoiceDate": "2026-02-01",
  "total": {
    "amount": 12.90,
    "currencyCode": "EUR"
  },
  "status": "PAID",
  "statusText": "Paid",
  "deliveryText": "Email",
  "download": true,
  "itemisedBill": true
}
```

---

## download

Download invoice as PDF or itemised bill as Excel.

### Usage

```bash
spusu invoices download <id> [options]
```

### Options

| Option | Description |
|--------|-------------|
| `-y, --year <year>` | Invoice year (defaults to current year) |
| `-o, --output <path>` | Output file path |
| `--excel` | Download itemised bill as Excel instead of PDF |

### Examples

Download invoice PDF:

```bash
spusu invoices download 1234567 --year 2026
# Invoice downloaded to: spusu-invoice-1234567.pdf
```

Download to specific path:

```bash
spusu invoices download 1234567 -o ~/Downloads/invoice.pdf
# Invoice downloaded to: /Users/you/Downloads/invoice.pdf
```

Download itemised bill as Excel:

```bash
spusu invoices download 1234567 --year 2026 --excel
# Invoice downloaded to: spusu-invoice-1234567.xlsx
```

### File Formats

| Format | Option | Contents |
|--------|--------|----------|
| PDF | (default) | Official invoice document |
| Excel | `--excel` | Itemised bill with call/data details |

::: tip
Use `--excel` to get detailed call records and data usage in spreadsheet format.
:::
