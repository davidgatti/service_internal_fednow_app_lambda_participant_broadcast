---
name: pipeline-framework
description: 'Modular Lambda pipeline framework with numbered modules, container state, step toggling, and error handling. Use when: creating modules, editing modules, debugging pipeline, step toggling, error handling, container object, local testing with payloads, working in src/modules/.'
---

# Pipeline Framework

Modular Lambda pipeline. A shared `container` object flows through numbered modules in `src/modules/`. Each module has one responsibility.

## Module Rules

- Location: `src/modules/` — flat structure, no subdirectories
- Naming: `{number}_{entity}_{action}.js` — e.g., `03_user_get.js`, `04_user_update.js`
- Discovery: `index.js` auto-loads modules; `wrapper.js` logs each before execution
- Execution order: determined by numeric prefix only
- One responsibility per module. When creating a new module, copy the style of a similar existing one exactly.

## Step Toggling

Control flow via `container.steps`, not `if` statements inside modules. Set a key to `false` to skip. Matching uses substring `includes()` on the normalized module name (stripped of number prefix and `.js`).

```js
container.steps = {
    user: false,      // Skips: 02_user_get, 03_user_validate, 04_user_update
    email: false,     // Skips: 05_email_send, 06_email_log
    user_get: false,  // Skips: only 02_user_get (more specific)
};
```

## Error Handling

Isolate inputs above `try`. Enrich `container.error` in `catch`. Throw a clear message.

```js
const { query, payload } = request;

try {
    // module logic
} catch (error) {
    console.info("Module context:", { query, payload });
    container.error = {
        module: "module_name",
        context: { query, payload },
        originalError: error.message,
    };
    throw new Error(`Failed to process in module_name: ${error.message}`);
}
```

## Local Testing

Test payloads live in `.payloads/event/`. Run with:

```bash
npm run locally              # uses .payloads/event/default.json
npm run locally custom_test  # uses .payloads/event/custom_test.json
```
