# login

Login to spusu.at with SMS TAN verification.

## Usage

```bash
spusu login [options]
```

## Options

| Option | Description |
|--------|-------------|
| `-p, --phone <phone>` | Phone number (e.g., +4369912345678) |
| `-t, --tan <code>` | TAN code (for non-interactive login) |
| `--json` | Output as JSON |

## Interactive Login

```bash
spusu login
# Enter your phone number (e.g., +4369912345678): +43699XXXXXXXX
# TAN code sent via SMS
# Enter the TAN code from SMS: XXXXXX
# Login successful
# Welcome, Your Name
```

## Non-Interactive Login

For scripting or automation, use two-step login:

```bash
# Step 1: Request TAN
spusu login --phone +43699XXXXXXXX --json
# {"success":true,"step":"tan_sent","message":"TAN code sent via SMS. Call again with --tan <code>"}

# Step 2: Complete login with TAN
spusu login --phone +43699XXXXXXXX --tan 123456 --json
# {"success":true,"user":{"name":"Your Name"}}
```

## How It Works

1. You provide your Austrian phone number (+43...)
2. spusu sends a TAN code via SMS to your phone
3. You enter the TAN code to complete authentication
4. Session is stored securely in `~/.spusu/config.json`

::: info
No password is required - authentication is purely via SMS TAN.
:::

## Session Expiry

Sessions are stored locally and persist until:
- You explicitly logout with `spusu logout`
- The session expires on the server side
- You delete the config file

## Errors

| Error | Solution |
|-------|----------|
| Invalid phone number | Use format: +43699XXXXXXXX |
| TAN expired | Request a new TAN and try again |
| Already logged in | Use `spusu logout` first or confirm re-login |
