# config

Manage CLI configuration settings.

## Subcommands

| Command | Description |
|---------|-------------|
| `get` | Show current configuration |
| `set` | Set a configuration value |
| `reset` | Reset to defaults |
| `path` | Show config file path |

---

## get

Show current configuration.

### Usage

```bash
spusu config get [options]
```

### Options

| Option | Description |
|--------|-------------|
| `--json` | Output as JSON |

### Example

```bash
spusu config get

# Configuration
# ────────────────────────────────────────
# Output format: pretty
# Logged in: Yes
# Phone: +43699XXXXXXXX
#
# Config file: /Users/you/.spusu/config.json
```

---

## set

Set a configuration value.

### Usage

```bash
spusu config set <key> <value>
```

### Available Keys

| Key | Values | Description |
|-----|--------|-------------|
| `outputFormat` | `pretty`, `json` | Default output format |

### Examples

```bash
# Set default output to JSON
spusu config set outputFormat json

# Set default output to pretty
spusu config set outputFormat pretty
```

---

## reset

Reset configuration to defaults.

### Usage

```bash
spusu config reset
```

### Example

```bash
spusu config reset
# Configuration reset to defaults
```

::: warning
This removes your authentication session. You'll need to login again.
:::

---

## path

Show configuration file path.

### Usage

```bash
spusu config path
```

### Example

```bash
spusu config path
# /Users/you/.spusu/config.json
```
