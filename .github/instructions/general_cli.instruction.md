---
applyTo: "**"
---

# Safe Execution Principles

Never run commands that enter interactive mode or wait for user input. All outputs must be non-interactive.

## How to Enforce

### Git

Use `--no-pager`: 
```bash
git --no-pager log
git --no-pager diff
```

### systemd

Use `--no-pager`:
```bash
systemctl --no-pager status
resolvectl --no-pager status
```

### AWS CLI

- Use `--no-cli-pager` to avoid terminal hang
- Prefer `--output json` for programmatic analysis
- Use `--query` to select only needed data

### Pagers

Avoid `less`, `more` — pipe to `cat` if needed

This applies to any CLI tool that might open a pager or pause for input.
