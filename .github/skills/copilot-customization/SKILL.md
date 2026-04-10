---
name: copilot-customization
description: 'Create, locate, or fix VS Code Copilot customization files. Use when: creating skills, creating instructions, creating prompts, creating agents, fixing SKILL.md, fixing frontmatter, choosing between skill and instruction, finding correct file path for copilot customization, copilot-instructions.md, AGENTS.md, .instructions.md, .prompt.md, .agent.md.'
---

# VS Code Copilot Customization

## Decision: Which Primitive?

| Need | Primitive | File |
|------|-----------|------|
| Rules for every interaction | Workspace Instructions | `copilot-instructions.md` |
| Rules for specific files or tasks | File Instructions | `*.instructions.md` |
| Reusable single-task template | Prompt | `*.prompt.md` |
| On-demand multi-step workflow with assets | Skill | `SKILL.md` |
| Subagent with tool restrictions | Custom Agent | `*.agent.md` |

## File Locations

### Workspace Instructions (always loaded)

| File | Location |
|------|----------|
| `copilot-instructions.md` | `.github/` |
| `AGENTS.md` | Root or subfolders |

Use one, not both.

### File Instructions (on-demand or file-matched)

| Scope | Path |
|-------|------|
| Project | `.github/instructions/*.instructions.md` |
| User | `~/.config/Code/User/prompts/*.instructions.md` |

### Prompts (slash command, single task)

| Scope | Path |
|-------|------|
| Project | `.github/prompts/*.prompt.md` |
| User | `~/.config/Code/User/prompts/*.prompt.md` |

### Skills (slash command, multi-step workflow)

| Scope | Path |
|-------|------|
| Project | `.github/skills/<name>/SKILL.md` |
| Project (alt) | `.agents/skills/<name>/SKILL.md` |
| User | `~/.copilot/skills/<name>/SKILL.md` |
| User (alt) | `~/.agents/skills/<name>/SKILL.md` |

### Custom Agents

| Scope | Path |
|-------|------|
| Project | `.github/agents/*.agent.md` |

## Skill Creation Procedure

### 1. Folder Structure

```
.github/skills/<skill-name>/
├── SKILL.md           # Required entry point
├── scripts/           # Optional executable code
├── references/        # Optional docs loaded as needed
└── assets/            # Optional templates, boilerplate
```

### 2. SKILL.md Frontmatter (required)

```yaml
---
name: skill-name              # MUST match folder name exactly
description: 'What it does. Use when: trigger1, trigger2, trigger3.'
---
```

Rules:

- `name`: 1-64 chars, lowercase alphanumeric + hyphens only, must match folder name
- `description`: Max 1024 chars. This is the discovery surface — if trigger words aren't here, the agent won't find it

Optional frontmatter fields:

- `argument-hint`: Hint shown for slash invocation
- `user-invocable: false`: Hide from slash commands (still auto-loaded)
- `disable-model-invocation: true`: Only via slash command (not auto-loaded)

### 3. SKILL.md Body

- What the skill does
- When to use it
- Step-by-step procedure
- References to bundled resources: `[script](./scripts/run.sh)`

Keep under 500 lines. Use `./references/` for overflow.

### 4. Progressive Loading

1. **Discovery** (~100 tokens): Agent reads `name` + `description` only
2. **Instructions** (<5000 tokens): Full `SKILL.md` body loaded when matched
3. **Resources**: Additional files loaded only when referenced in body

## File Instructions Creation

### Frontmatter

```yaml
---
description: "Use when writing migrations, schema changes, or data transforms."
applyTo: "**/*.sql"           # Optional: auto-attach for matching files
---
```

Discovery modes:

- `description` only → on-demand (agent decides relevance)
- `applyTo` only → explicit (file glob match)
- Both → both triggers active

### applyTo patterns

```yaml
applyTo: "**/*.py"            # All Python files
applyTo: ["src/**", "lib/**"] # Multiple patterns (OR)
applyTo: "**"                 # ALWAYS loaded — use with caution
```

## Prompt Creation

### Frontmatter

```yaml
---
description: "Generate test cases for selected code"
agent: "agent"                # Optional: ask, agent, plan, or custom
model: "GPT-5 (copilot)"     # Optional
tools: [search, web]          # Optional
---
```

## Anti-Patterns

- Folder name doesn't match `name` field in frontmatter → silent failure
- Vague description ("A helpful skill") → never discovered
- `applyTo: "**"` on file instructions → wastes context on every interaction
- Having both `copilot-instructions.md` and `AGENTS.md` → conflicts
- Monolithic SKILL.md with everything inline → use `./references/` for large content
- Tabs in YAML frontmatter → silent parse failure (use spaces only)
- Unquoted colons in description → YAML parse failure (always quote)
