# whoami

Show current user information.

## Usage

```bash
spusu whoami [options]
```

## Options

| Option | Description |
|--------|-------------|
| `--json` | Output as JSON |

## Example

```bash
spusu whoami

# Customer Information
# ────────────────────────────────────────
# Customer #: 123456
# Name: Max Mustermann
# Email: max@example.com
# Birth Date: 1990-01-01
#
# Address
# ────────────────────────────────────────
# Street: Musterstraße 1
# City: 1010 Wien
# Country: AT
```

## JSON Output

```bash
spusu whoami --json
```

```json
{
  "customerNumber": "123456",
  "firstName": "Max",
  "lastName": "Mustermann",
  "eMail": "max@example.com",
  "dateOfBirth": "1990-01-01",
  "street": "Musterstraße 1",
  "zip": "1010",
  "city": "Wien",
  "country": "AT"
}
```

## Requires Authentication

You must be logged in to use this command:

```bash
spusu whoami
# Not logged in. Run: spusu login
```
