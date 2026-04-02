---
name: "javascript-code-style"
description: "Comprehensive coding style guide based on the codebase's best practices"
applyTo: "**/*.js"
---

# JavaScript Code Style Guide

This codebase follows a distinctive, highly-commented style optimized for readability and maintainability. Every pattern below is extracted from actual production code.

## Variable Declarations

**Always use `let`** - never `const` or `var`:

```javascript
let awsRegion = process.env.AWS_REGION || 'us-east-1';
let sqsQueueName = process.env.SQS_QUEUE_NAME;
let isRunning = false;
```

## Class Structure

### Class-Level Comment

Multi-line comment describing the class's responsibility:

```javascript
//
//  AWS SQS Consumer with long polling and graceful shutdown support.
//  Continuously polls SQS queue for incoming FedNow messages, processes them
//  in parallel for maximum throughput, and handles shutdown signals to prevent
//  message loss during application termination. Uses EventEmitter pattern for
//  clean integration with application lifecycle management.
//
class SQSConsumer {
```

### Constructor Comments

Explain what initialization does and WHY:

```javascript
//
//  Initialize SQS client with AWS SDK v3 and configure queue settings. Sets
//  up graceful shutdown monitoring to prevent message loss during
//  application termination by subscribing to EventEmitter shutdown signals
//
constructor() {
```

### Property Initialization with Inline Comments

Every property assignment gets a comment explaining its purpose:

```javascript
//
//  Track consumer state to prevent duplicate polling loops
//
this.isRunning = false;

//
//  IBM MQ channel manager reference for message processing - injected
//  after initialization
//
this.channels = null;

//
//  Retry mechanism state
//
this.retryTimer = null;
this.retryInterval = 5000;
this.isRetrying = false;
```

### Public vs Private Method Separation

Classes must clearly separate public API methods from private implementation using visual section markers. This provides instant clarity about which methods are part of the external contract vs internal helpers.

**Section markers:**
```javascript
////////////////////////////////////////////////////////////////////////////
//  PUBLIC
////////////////////////////////////////////////////////////////////////////
```

```javascript
////////////////////////////////////////////////////////////////////////////
//  PRIVATE
////////////////////////////////////////////////////////////////////////////
```

**Complete example:**
```javascript
class HealthController {

    constructor() {
        // Initialize properties
        this.#setupRoute();
        this.#subscribeToShutdown();
    }

    ////////////////////////////////////////////////////////////////////////////
    //  PUBLIC
    ////////////////////////////////////////////////////////////////////////////

    //
    //  Start Express HTTP server on configured port for health check probes.
    //
    async start() {
        // Public method called by app orchestrator
    }

    //
    //  Required setup method called by app orchestrator to inject MQ
    //  connection dependency.
    //
    registerMQConnection(mqConnection) {
        // Public method called by app orchestrator
    }

    ////////////////////////////////////////////////////////////////////////////
    //  PRIVATE
    ////////////////////////////////////////////////////////////////////////////

    //
    //  Configure single health check endpoint for AWS load balancer probes.
    //
    #setupRoute() {
        // Private method using # prefix - only callable from within class
    }

    //
    //  Register EventEmitter listener for coordinated shutdown signaling.
    //
    #subscribeToShutdown() {
        // Private method using # prefix - only callable from within class
    }

}
```

**Rules:**
- Use `#` prefix for private methods to enforce privacy at language level
- Place PUBLIC section before PRIVATE section
- Section markers span full width (76 characters) for visual separation
- All private methods must use `#` prefix and appear in PRIVATE section
- All public methods appear in PUBLIC section
- Constructor always appears first, before any section markers

## Method Structure

### Method-Level Comment

Explain what the method does, its behavior, and side effects:

```javascript
//
//  Register EventEmitter listener for graceful shutdown notifications. When
//  shutdown signal is received, stops the polling loop to prevent new
//  message processing while allowing current messages to complete
//
subscribe() {

    let fnLogger = logger.fn('subscribe');
```

### Function-Scoped Logger

**First line of every method** (after comment):

```javascript
async start() {

    let fnLogger = logger.fn('start');
    
    // ... rest of method
}
```

### Inline Code Comments

Comment **WHY** the code does something, not **WHAT** it does:

```javascript
//
//  Stop polling loop gracefully without interrupting current messages
//
this.stop();

//
//  Only delete message after successful processing
//
await this.delete(message.ReceiptHandle);
```

## Comment Formatting Rules

### Multi-Line Comment Blocks

Use `//` with leading/trailing blank comment lines:

```javascript
//
//  This is a properly formatted multi-line comment.
//  Second line continues the thought.
//  Third line completes the explanation.
//
let variable = value;
```

### Sectioning Within Methods

Group related code with descriptive comments:

```javascript
//
//  Get AWS configuration from environment variables
//
let awsRegion = process.env.AWS_REGION || 'us-east-1';
let awsAccountId = process.env.AWS_ACCOUNT_ID;

//
//  Create AWS SQS client configured with environment region
//
this.sqs = new SQSClient({
    region: awsRegion
});
```

## Control Flow Formatting

### If Statements

Opening brace on same line, blank lines around blocks:

```javascript
if (!awsAccountId) {

    throw new Error('AWS_ACCOUNT_ID environment variable is required');

}

if (this.isRunning) {

    fnLogger.warn('Consumer already running');
    return;

}
```

### No Else or Else If

**NEVER use `else` or `else if` statements** - use early returns with `>>` exit marker instead:

❌ **WRONG** - do not use else/else if:
```javascript
if (context && context.err) {
    errorToReport = context.err;
} else if (context && context.error) {
    errorToReport = context.error;
} else {
    errorToReport = new Error(message);
}
```

✅ **CORRECT** - use early returns:
```javascript
if (context && context.err) {

    //
    //  >>  Exit
    //
    return context.err;

}

if (context && context.error) {

    //
    //  >>  Exit
    //
    return context.error;

}

//
//  >>  Exit
//
return new Error(message || 'Unknown error');
```

### Try-Catch Blocks

Comment the purpose, blank lines inside blocks:

```javascript
try {

    //
    //  Send message to IBM MQ channel manager for signing and routing
    //  to MQ. Pass child logger for continued tracking.
    //
    let result = await this.channels.send(transaction, txLogger);

} catch (error) {

    //
    //  Log processing error but do NOT delete message from queue. This
    //  allows SQS to retry the message according to retry policy
    //
    txLogger.error('Failed to process SQS message', {
        err: error
    });

}
```

### While/For Loops

Comment the loop's purpose:

```javascript
//
//  Continue polling until graceful shutdown signal received
//
while (this.isRunning) {

    // ... loop body
    
}
```

## Complex Logic Comments

When logic is non-obvious, explain with **THE PROBLEM** / **THE SOLUTION** / **FLOW** structure:

```javascript
//
//  Custom error serializer that handles frozen/sealed error objects.
//
//  THE PROBLEM:
//  IBM MQ error objects are frozen using Object.freeze() to prevent
//  accidental modification of diagnostic information. When Pino tries to
//  serialize these errors, it attempts to add a Symbol(circular-ref-tag)
//  property to track circular references. Since frozen objects cannot have
//  new properties added, this throws:
//  "TypeError: Cannot add property Symbol(circular-ref-tag), object is not
//  extensible"
//
//  THE SOLUTION:
//  Create a plain JavaScript object copy with all the error information.
//  The copy is not frozen, so Pino can safely add its tracking symbols
//  without crashing. The original frozen error remains untouched.
//
//  FLOW:
//  Frozen MQ Error → Create extensible copy → Pino adds symbols to copy →
//  Success
//
function safeErrorSerializer(error) {
```

## Detailed Property Comments

For complex properties, explain with context:

```javascript
//
//  Copy IBM MQ reason code (numeric)
//  mqrc is a numeric code that identifies the specific MQ failure.
//  For example: 2009 = MQRC_CONNECTION_BROKEN
//  Only copy if it exists to avoid adding undefined properties.
//
if (error.mqrc !== undefined) {

    serialized.mqrc = error.mqrc;

}
```

## Function-Level Documentation

Document parameters and behavior:

```javascript
//
//  Fetch ECS metadata from AWS ECS metadata endpoint.
//  Returns cluster, task_id, revision, and availability zone.
//  Falls back to 'unknown' if metadata is unavailable (local development).
//
async function fetchEcsMetadata() {
```

## Code Organization

### Imports at Top

Grouped by source (external libs, then internal modules):

```javascript
let { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } = require('@aws-sdk/client-sqs');
let { createLogger } = require('../utils/logger');
let shutdownMonitor = require('../utils/shutdownMonitor');
```

### Module-Level Variables

After imports, before class definition:

```javascript
//
//  Create logger instance for SQS consumer operations
//
let logger = createLogger('SqsConsumer');
```

### Exports at End

At the very end of file:

```javascript
//
//  Export singleton instance to ensure only one SQS consumer operates across
//  the entire application, preventing duplicate message processing and
//  conflicting polling loops that could cause race conditions
//
let sqsConsumer = new SQSConsumer();

//
//  Exports
//
module.exports = sqsConsumer;
```

## Indentation and Spacing

- **Two spaces** for indentation (never tabs)
- **Blank lines** inside `if`, `try`, `catch`, `while` blocks
- **Blank lines** between method definitions
- **Semicolons required** - always terminate statements with semicolons for explicit statement boundaries

## Naming Conventions

- **Classes**: PascalCase (`SQSConsumer`, `FedNowConnect`)
- **Methods/Functions**: camelCase (`subscribe`, `handleHealthCheck`)
- **Variables**: camelCase (`awsRegion`, `sqsQueueName`)
- **Logger instances**: `logger` at module level, `fnLogger` for function-scoped
- **Constants**: Regular camelCase (not UPPER_CASE in this codebase)

## Error Messages

Be specific about what failed and why:

```javascript
throw new Error('AWS_ACCOUNT_ID environment variable is required');
```

## Logging Statements

Include structured context objects:

```javascript
logger.info('SQS Consumer initialized', {
    queueUrl: this.queueUrl,
    sqsQueueName: this.sqsQueueName
});

fnLogger.warn('Received shutdown notification', { reason });
```

## Early Exit and Return Statements

When returning early from a function (e.g., validation checks, guard clauses), use the `>>` exit marker:

```javascript
if (this.signalListenersRegistered) {

    //
    //  <>  Log
    //
    fnLogger.warn('Signal listeners already registered');

    //
    //  >>  Exit
    //
    return;

}
```

For returns with values, include the exit marker before the return:

```javascript
//
//  >>  Exit
//
return this.isShuttingDown;
```

**Purpose**: The `>>` marker provides visual separation indicating control flow exits, making it instantly recognizable when scanning code that a function terminates at that point.

## Throw Statements

When throwing errors, use the `^^` surface marker to indicate that an error is being surfaced:

```javascript
if (!awsAccountId) {

    //
    //  ^^  Surface
    //
    throw new Error('AWS_ACCOUNT_ID environment variable is required');

}
```

For throws with context or custom error objects:

```javascript
//
//  ^^  Surface
//
throw new ValidationError('Invalid message format', { messageId });
```

**Purpose**: The `^^` marker provides visual separation indicating an error is being thrown/surfaced, making exception handling paths instantly recognizable when scanning code.

**Rules**:
- Every `throw` statement needs this comment
- Place comment directly before the throw statement (no blank lines)
- Use exactly `//  ^^` format (two spaces, double caret)
- No additional text needed in the comment

## Summary: The Golden Rules

1. **Comment WHY, not WHAT** - explain purpose and reasoning
2. **Use `let` exclusively** - no `const` or `var`
3. **Blank lines inside blocks** - improves readability
4. **Function-scoped logger first** - `let fnLogger = logger.fn('methodName')`
5. **Multi-line comments** - use `//` with blank comment lines
6. **Two-space indentation** - consistent throughout
7. **Detailed class/method headers** - explain purpose and behavior
8. **Group related code** - with descriptive section comments
9. **Explain complex logic** - use PROBLEM/SOLUTION/FLOW structure
10. **Structured logging** - always include context objects