---
name: improve-comments
description: Review and improve existing code comments to ensure they accurately reflect current code logic
agent: developer
argument-hint: Specify the file or selection to review
---

# Improve Code Comments

Review existing comments and ensure they accurately reflect the current code implementation. Code evolves, and comments can become stale or misleading.

## Task

1. Review the main class comment and verify it matches current implementation
2. Check all method-level comments for accuracy
3. Identify outdated or misleading comments
4. Update comments to reflect current code logic
5. Ensure all comments follow the guidelines in [code_comments.instruction.md](../instructions/code_comments.instruction.md)

## Focus Areas

- **Class-level comment**: Does it still describe what the class does?
- **Method signatures**: Have parameters or return types changed?
- **Business logic**: Has the WHY changed?
- **Implementation approach**: Has the HOW changed?

## Key Principles

- Comments should tell the story of what the code accomplishes
- Follow **WHY → HOW → WHAT** ordering
- Remove comments that state the obvious
- Update stale comments rather than removing them

## Output

Return the updated code with improved, accurate comments.