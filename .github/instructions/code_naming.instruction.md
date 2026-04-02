---
name: "naming-conventions"
description: "File, variable, class, and function naming conventions using hierarchical prefix naming"
applyTo: "**/*.js"
---

# Naming Conventions

## General Principles

Follow a structured, prefix-first pattern that moves from general purpose to specific action:

-   **Format**: `entityAction`, not `actionEntity`
-   **Examples**:
    -   ✅ `userGet`, `userDelete`, `messageParse`, `configLoad`
    -   ❌ `getUser`, `deleteUser`, `parseMessage`, `loadConfig`

## Hierarchical Logic

Use **Hierarchical Prefix Naming**, a naming convention that uses `{category}{subcategory}{specific}` structure to create logical grouping and hierarchy.

-   **Pattern**: `{category}{Subcategory}{SpecificDetail}` (camelCase)
-   **Examples**: 
    -   Files: `webhookParsePayload.js`, `webhookValidateSignature.js`
    -   Variables: `sqsMessageBody`, `mqConnectionStatus`, `awsRegionName`
    -   Functions: `messageValidateFormat()`, `connectionRetryEstablish()`
-   Use **camelCase** for all files, functions, and variables (not snake_case or kebab-case)
-   Use **PascalCase** for classes only

Treat naming like a subdomain or folder tree structure:

-   Group similar functionality together by prefix
-   This approach makes sorting, searching, and filtering consistent across development tools
-   Examples that naturally group together:
    -   Files: `userCreate.js`, `userUpdate.js`, `userDelete.js`
    -   Variables: `userId`, `userName`, `userEmail`
    -   Functions: `userGet()`, `userValidate()`, `userSave()`

## File Naming

Apply hierarchical prefix naming to organize files by domain:

-   **Pattern**: `{domain}{Action}{Detail}.js` (camelCase)
-   **Examples**:
    -   ✅ `messageSignRsa.js`, `messageFormatMqrfh2.js`
    -   ✅ `connectionEstablishMq.js`, `connectionMonitorHealth.js`
    -   ✅ `loggerCreatePino.js`, `errorSerializeSafe.js`
    -   ❌ `rsaSigner.js`, `mqrfh2Formatter.js` (action-first, wrong order)
    -   ❌ `message_sign_rsa.js`, `logger_create_pino.js` (snake_case, wrong format)

## Variable Naming

Use camelCase following the hierarchical pattern:

-   **Pattern**: `{category}{Subcategory}{Detail}` (camelCase)
-   **Examples**:
    -   ✅ `sqsQueueUrl`, `mqChannelName`, `awsAccountId`
    -   ✅ `messageReceiptHandle`, `connectionRetryCount`
    -   ✅ `pinoLogger`, `ecsMetadata`, `enrichedContext`
    -   ❌ `queueUrl`, `channelName`, `accountId` (missing category prefix)
    -   ❌ `sqs_queue_url`, `mq_channel_name` (snake_case, wrong format)

**Counter variables**: Simple names like `i`, `j`, `k` for loop counters are acceptable

**Temporary variables**: Still follow pattern when meaningful - `tempMessageBody` not `tmp` or `x`

**Constants**: Use SCREAMING_SNAKE_CASE for module-level constants:
-   ✅ `PRIVATE_KEY_FOR_TESTS`, `MAX_RETRY_COUNT`, `DEFAULT_TIMEOUT_MS`

## Class Naming

Use PascalCase for class names, following domain-first hierarchy:

-   **Pattern**: `{Domain}{Action}{Detail}` (no underscores, capitalize each word)
-   **Examples**:
    -   ✅ `SqsConsumer`, `MqConnection`, `FedNowConnect`
    -   ✅ `MessageSigner`, `HealthController`, `ShutdownMonitor`
    -   ❌ `Consumer`, `Connection`, `Signer` (too generic)
    -   ❌ `SQS_Consumer`, `mq_connection` (wrong casing)

**Rule**: Class names should be specific enough to convey their domain without needing to read the file path

## Function and Method Naming

Use camelCase following entity-first hierarchy:

-   **Pattern**: `{entity}{Action}{Detail}()` (camelCase)
-   **Examples**:
    -   ✅ `messageParse()`, `connectionEstablish()`, `queueDeleteMessage()`
    -   ✅ `errorSerialize()`, `loggerCreateChild()`, `configLoadEnv()`
    -   ✅ `getPinoLogger()`, `fetchEcsMetadata()`, `createLogMethods()`
    -   ❌ `parseMessage()`, `establishConnection()`, `deleteMessage()` (action-first, wrong order)
    -   ❌ `message_parse()`, `connection_establish()` (snake_case, wrong format)

**Private methods**: Use `#` prefix with same naming pattern - `#messageValidate()`, `#connectionRetry()`

**Getters/Setters**: Follow entity-first pattern - `statusGet()`, `configSet()` or use getter/setter syntax