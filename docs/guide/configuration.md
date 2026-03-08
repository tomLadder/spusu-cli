# Configuration

Configuration is stored in `~/.spusu/config.json`.

## Settings

| Key | Values | Default | Description |
|-----|--------|---------|-------------|
| `outputFormat` | `pretty`, `json` | `pretty` | Default output format |

## Commands

### View Configuration

```bash
spusu config get
```

### Set a Value

```bash
# Set default output to JSON
spusu config set outputFormat json

# Set default output to pretty
spusu config set outputFormat pretty
```

### Reset to Defaults

```bash
spusu config reset
```

### Show Config File Path

```bash
spusu config path
# Output: /Users/username/.spusu/config.json
```

## File Structure

```json
{
  "auth": {
    "sessionId": "...",
    "phoneNumber": "+43699XXXXXXXX"
  },
  "settings": {
    "outputFormat": "pretty"
  }
}
```

::: warning
The config file contains your session ID. It's created with secure permissions (0600) and should not be shared.
:::
