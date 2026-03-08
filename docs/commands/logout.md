# logout

Logout from spusu.at and clear stored session.

## Usage

```bash
spusu logout
```

## Example

```bash
spusu logout
# Logged out successfully
```

## What Happens

1. Server session is invalidated
2. Local session data is removed from `~/.spusu/config.json`
3. You'll need to login again to access account data

## If Not Logged In

```bash
spusu logout
# Not logged in
```
