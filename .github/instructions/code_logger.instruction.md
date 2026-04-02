---
name: "logger-pattern"
description: "Mandatory logging pattern using Pino for all JavaScript files"
applyTo: "**/*.js"
---

# Logger Pattern (MANDATORY)

## Pipeline Modules Pattern

**In pipeline modules (`src/modules/*.js`)**, use the logger from container:

```javascript
//
//  Pipeline modules receive logger via container.logger
//  Module context is automatically injected by wrapper.js
//
module.exports = async (container) => {
    try {
        //
        //  Use container.logger - includes transaction_id and module path
        //
        container.logger.info('Processing data', {
            record_count: data.length
        });

        //  Module logic here

    } catch (error) {
        container.logger.error('Processing failed', {
            error: error.message
        });
        throw error;
    }
};
```

## Helper/Utility Pattern

**In helpers (`helpers/*.js`)**, create component logger:

```javascript
let { createLogger } = require('./logger');
let logger = createLogger('ComponentName');

function utilityFunction() {
    logger.info('Message', { key: 'value' });
}
```

## Lambda Entry Point Pattern

**In `index.js`**, create child logger with transaction ID:

```javascript
let { createLogger } = require('./helpers/logger');
let logger = createLogger('Lambda');

exports.handler = async (event) => {
    let transaction_id = event.requestContext?.requestId ||
                         `txn-${Date.now()}`;

    //
    //  Create child logger with transaction ID bound to all logs
    //
    let child_logger = logger.child({
        transaction_id: transaction_id,
        event_type: event.httpMethod || 'invocation'
    });

    let container = {
        req: { ...event },
        res: { success: true },
        logger: child_logger  // <- Pass to all modules
    };

    // Pipeline execution...
};
```

## How It Works

1. **wrapper.js** calls `setModuleContext(relativePath)` before module execution
2. **Pino mixin** automatically injects `{ module: relativePath }` into every log
3. **Child logger** adds `{ transaction_id, event_type }` to every log in pipeline
4. **Component logger** adds `{ component: 'ComponentName' }` to helper logs
5. After module execution, `setModuleContext(null)` clears context

## Critical Rules

- **NEVER use `console.log()`** - breaks structured logging, no context, not searchable
- Use `container.logger` in pipeline modules (automatic context injection)
- Use `createLogger('Component')` in helpers/utilities
- Use `child({ bindings })` for transaction tracking
- Pino is concurrent-safe for parallel operations
- **Don't log sensitive data** - keys, passwords, tokens auto-redacted
- Module context is automatic - don't manually add module field

## Example Log Output

```json
{
  "level": "info",
  "time": 1702857600000,
  "module": "/modules/01_key_generate.js",
  "component": "Lambda",
  "transaction_id": "txn-1702857600000",
  "event_type": "invocation",
  "key_id": "a1b2c3d4e5f67890",
  "msg": "Key pair generated successfully"
}
```
