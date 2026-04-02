---
name: add-comments
description: Add missing comments to code following the WHY → HOW → WHAT principle
agent: developer
argument-hint: Specify the file or selection to add comments to
---

# Add Code Comments

Analyze the current file or selection and add comments where they are missing or insufficient.

## Task

1. Review the code structure and identify areas lacking comments
2. Add comments following the guidelines in [code_comments.instruction.md](../instructions/code_comments.instruction.md)
3. Ensure all comments follow the **WHY → HOW → WHAT** principle
4. Comments should read like a technical narrative

## Key Principles from Instructions

- **Class-level comments**: Multi-line explaining the class's responsibility and purpose
- **Method-level comments**: Single-line describing what the method does
- **Inline comments**: Only when the code's intent is not obvious from the code itself
- **WHY before HOW before WHAT**: Business reason, then approach, then implementation details

## Output

Return the updated code with properly added comments.