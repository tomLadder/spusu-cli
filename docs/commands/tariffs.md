# tariffs

List all tariffs and contracts associated with your account.

## Usage

```bash
spusu tariffs [options]
```

## Options

| Option | Description |
|--------|-------------|
| `--json` | Output as JSON |

## Example

```bash
spusu tariffs

# spusu XL
# ────────────────────────────────────────
# Phone: +43699XXXXXXXX
# Type: MOBILE
# Owner: Max Mustermann
# Status: ACTIVE
# Ported: 2024-01-15
```

## JSON Output

```bash
spusu tariffs --json
```

```json
[
  {
    "tariffName": "spusu XL",
    "phoneNumber": "+43699XXXXXXXX",
    "contractType": "MOBILE",
    "firstname": "Max",
    "lastname": "Mustermann",
    "status": "ACTIVE",
    "portingDateTime": "2024-01-15T00:00:00"
  }
]
```

## Fields

| Field | Description |
|-------|-------------|
| `tariffName` | Name of the tariff (e.g., spusu S, M, L, XL) |
| `phoneNumber` | Associated phone number |
| `contractType` | Type of contract (MOBILE) |
| `firstname/lastname` | Contract owner name |
| `status` | Contract status (ACTIVE, etc.) |
| `portingDateTime` | When number was ported (if applicable) |

## Requires Authentication

You must be logged in to use this command.
