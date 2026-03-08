# status

Check login status and session information.

## Usage

```bash
spusu status [options]
```

## Options

| Option | Description |
|--------|-------------|
| `--json` | Output as JSON |

## Example

```bash
spusu status
# Logged in as: Max Mustermann
# Phone: +43699XXXXXXXX
# Contract ID: 123456
# Admin: Yes
```

## Not Logged In

```bash
spusu status
# Not logged in
```

## JSON Output

```bash
spusu status --json
```

```json
{
  "loggedIn": true,
  "phoneNumber": "+43699XXXXXXXX",
  "name": "Max Mustermann",
  "billingContractId": 123456,
  "isContractAdmin": true
}
```

## Use Cases

- Verify you're logged in before running other commands
- Check which phone number is associated with the session
- Confirm contract admin status
