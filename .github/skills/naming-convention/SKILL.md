---
name: naming-convention
description: 'Hierarchical naming convention for files, folders, AWS resources, CloudWatch alarms, S3 buckets, and CloudFormation resources. Use when: creating files, naming resources, naming alarms, naming buckets, naming folders, renaming anything, reviewing names, creating CloudFormation resources, adding CloudWatch alarms, creating S3 buckets.'
---

# Naming Convention

## Rule

All names — files, folders, CloudFormation resources, CloudWatch alarms, S3 buckets — are **hierarchical filters**.

Each segment narrows scope left to right, so alphabetical sorting and type-ahead search group related items automatically.

The name is a search path embedded in a flat string.

## How It Works

Imagine a flat list of S3 buckets:

1. Type `archive` → see all archives
2. Type `archive-rds` → see only RDS archives
3. Type `archive-rds-postgres` → see only Postgres RDS archives

Each added segment narrows the visible set. This works in any alphabetically sorted UI: S3 console, CloudWatch alarms, `ls`, file explorers.

## Pattern

- Files/folders: `{broad}_{narrow}_{specific}.extension` (underscore separator)
- AWS resource names: `{broad}-{narrow}-{specific}` (hyphen separator)

## Examples

| Type-ahead | What you see |
|---|---|
| `latency` | `latency_read`, `latency_write`, `latency_cdc` |
| `latency_cdc` | `latency_cdc` only |
| `sqs-intake` | `sqs-intake-age-high`, `sqs-intake-depth-high` |
| `ecs-inbound` | `ecs-inbound-cpu-high`, `ecs-inbound-memory-high` |

## CloudWatch Alarm Pattern

`${StackName}-{service}-{resource}-{metric}-{condition}`

Examples:
- `sqs-intake-age-high`, `sqs-intake-depth-high`
- `lambda-intake-errors`, `lambda-intake-throttles`
- `ecs-inbound-cpu-high`, `ecs-inbound-memory-high`

## Rules

- Broadest category always comes first.
- Each subsequent segment narrows within the previous group.
- Never put the specific detail first — it breaks grouping.
- Use `_` for files, `-` for AWS resource names.
- Pattern: `entity_action`, not `action_entity` — e.g., ✅ `user_get` ❌ `get_user`.

## Variable Naming

- Always `snake_case`. Never camelCase.
- Exception: external API keys (e.g., AWS `batchItemFailures`) keep their required format, but the variable holding them is still snake_case.

```js
let batch_item_failures = [];
batch_item_failures.push({ itemIdentifier: "msg-001" });
return { batchItemFailures: batch_item_failures };
```
