# GitHub Copilot Instructions

This repository uses a modular instruction system where specific guidelines are organized into focused instruction files in `.github/instructions/`. These instruction files automatically apply based on their `applyTo` patterns.

## Instruction System Overview

All general instructions that apply workspace-wide are located in `.github/instructions/` with the `general_` prefix. These are automatically applied to all chat requests.

Specialized agents are defined in `.github/agents/` for specific roles and tasks. Switch to these agents when you need specialized expertise.

## Available Agents

-   `@Infrastructure` - AWS CloudFormation specialist using Grapes CLI framework for modular infrastructure code
-   `@Netmind` - Network engineer specializing in Ubiquiti, VLANs, routing, and firewalls
-   `@Compliance` - AWS compliance auditor for regulatory documentation and infrastructure assessment
-   `@Investigator` - AWS issue investigator for root cause analysis and incident resolution

## Core Principles

This workspace values clarity, precision, and truth over comfort. The instruction files define how to interact, think, and execute tasks. Key themes:

-   Honesty without disguise - say things as they are, even if harsh
-   Brevity over speculation - every sentence must serve a purpose
-   Forward thinking - anticipate consequences before acting
-   Self-audit - review responses for repetition, vagueness, or contradiction
-   Question vs action - distinguish between information requests and commands to execute

## Instruction File Organization

General instructions (apply to all files):

-   `general_principles.instruction.md` - Core values and communication style
-   `general_interaction.instruction.md` - Questions vs actions, forward thinking, self-audit
-   `general_thinking.instruction.md` - When to use Sequential Thinking MCP
-   `general_boundaries.instruction.md` - Forbidden commands and restrictions
-   `general_cli.instruction.md` - Safe command execution patterns
-   `general_naming.instruction.md` - File and resource naming conventions
-   `general_markdown.instruction.md` - Markdown formatting rules
-   `general_mcp.instruction.md` - Model Context Protocol guidelines
-   `general_memory.instruction.md` - Memory ritual for maintaining focus

Code-specific instructions (apply to code files):

-   `code_style.instruction.md` - Code formatting and style guidelines
-   `code_naming.instruction.md` - Variable and function naming conventions
-   `code_comments.instruction.md` - Comment requirements and patterns
-   `code_logger.instruction.md` - Logging standards and practices

## Using This System

1. For general tasks, the base instructions apply automatically
2. For specialized work, invoke the appropriate agent with `@AgentName`
3. All agents inherit the general instructions and add their domain expertise
4. Instruction files use `applyTo` patterns to scope their application

## Best Practices

-   Keep agents focused on their domain expertise
-   Let general instructions handle common patterns
-   Use instruction files for reusable guidelines
-   Reference instruction files in agents and prompts rather than duplicating content
-   Organize instructions by scope (general, code, agent-specific)

This modular approach keeps agents clean, reduces duplication, and makes the system maintainable.

## Modular Pipeline Framework

### Key Concepts

#### Container Object

A centralized state object that is passed through each module during execution. This allows modules to share data and maintain state across the entire pipeline.

#### Numbered Modules

Module filenames must start with numbers (`01_init.js`, `02_fetch.js`, `03_process.js`) to define their execution order. This ensures predictable and consistent execution flow.

#### Step Toggling

Use the `container.steps` object to conditionally skip modules during execution:

```js
container.steps = {
    "03_placed": false, // Skip module 03_placed.js
    "04_processing": false, // Skip module 04_processing.js
};
```

### Module Guidelines

#### File Organization

-   **Location**: All modules must be placed in `src/modules/`
-   **Naming**: Files must be numbered (e.g., `01_start.js`, `02_create_user.js`) to define execution order
-   **Structure**: The modules folder is flat - only top-level numbered `.js` files are loaded; subdirectories are ignored
-   **Grouping**: Files can be grouped by appending a common string after the number to enable batch skipping of execution branches

#### Single Responsibility Principle

Each module file should have one clear, focused responsibility. Keep modules small, cohesive, and easy to understand.

### Framework Architecture

#### Module Discovery and Loading

-   Modules are automatically discovered by `index.js`
-   `wrapper.js` logs each module's relative path before executing its handler
-   Execution order is determined solely by numeric prefixes in filenames

#### Error Handling Pattern

Follow this consistent error handling structure in all modules:

```js
// 1. Isolate and name request payloads above try block
const { query, payload } = container.req;

try {
    // Module logic here
} catch (error) {
    // 2. Log error context using container.logger (NEVER console.log)
    container.logger.error("Module processing failed", {
        query,
        payload,
        error: error.message,
    });

    // 3. Update container with useful metadata
    container.error = {
        module: "module_name",
        context: { query, payload },
        originalError: error.message,
    };

    // 4. Throw clear, enriched error
    throw new Error(`Failed to process in module_name: ${error.message}`);
}
```

#### Error Handling Best Practices

-   Use module-level `try/catch` only to enrich errors or handle domain-specific failures
-   Avoid duplicating loader-level logging
-   Always update `container.res` or `container.error` with useful metadata before throwing
-   Surface what failed and why - avoid vague error messages

### Development Workflow

#### Local Testing with Payloads

The `.payloads/` folder provides a way to test your Lambda function locally in an environment that mimics AWS Lambda 1:1.

**Folder Structure:**

```
.payloads/
├── README.md              # Documentation
├── context.js             # Mock AWS Lambda context object
└── event/                 # Event payload files
    ├── default.json       # Default test payload
    └── custom_test.json   # Add your own test payloads here
```

**Running Locally:**

```bash
# Run with default payload (.payloads/event/default.json)
npm run locally

# Run with a specific payload file (extension optional)
npm run locally custom_test
```

**Creating Test Payloads:**

1. Create a new JSON file in `.payloads/event/` with your test data
2. Name it descriptively (e.g., `webhook_order_placed.json`, `api_user_created.json`)
3. Structure it to match the actual event your Lambda will receive in production
4. Run it using `npm run locally <filename>` (no need to include `.json` extension)

**Example Payload:**

```json
// .payloads/event/webhook_order_placed.json
{
    "httpMethod": "POST",
    "body": {
        "event_type": "order.placed",
        "order_id": "12345",
        "customer_id": "67890"
    },
    "headers": {
        "X-Webhook-Signature": "abc123..."
    }
}
```

**Benefits:**

-   Test locally without deploying to AWS
-   Rapid iteration and debugging
-   Create multiple test scenarios as separate payload files
-   Consistent testing environment that matches production
-   Easy to simulate different webhook events or API calls

**Context Object:**

The `.payloads/context.js` file mocks the AWS Lambda context object. You can modify it to test:

-   Different timeout scenarios (`getRemainingTimeInMillis`)
-   Various function configurations (`memoryLimitInMB`, `functionName`)
-   Request tracking (`awsRequestId`)

#### Creating New Modules

1. Choose an appropriate number prefix based on desired execution order
2. Select a similar existing module as a style reference
3. Copy the style and structure exactly
4. Implement your specific functionality
5. Follow the established error handling pattern

#### Debugging

-   Use `console.log(container)` in modules to inspect current state
-   Check `container.steps` to verify which modules are enabled/disabled
-   Review module execution logs to trace the pipeline flow
-   Test with different payload files from `.payloads/event/` to simulate various scenarios

#### Module Skipping

Instead of adding conditional `if` statements within modules, use the `container.steps` toggle system to control execution flow at the framework level.

**Individual Module Skipping:**

Skip a single module by using its exact normalized name (without number prefix or `.js` extension):

```js
container.steps = {
    user_create: false, // Skips only 03_user_create.js
};
```

**Group Skipping:**

Skip multiple modules that share a common substring by using that substring as the key. The framework uses a substring match (`includes`) to determine if a module should be skipped:

```js
// Given modules: 03_webhook_parse.js, 04_webhook_validate.js, 05_webhook_process.js
container.steps = {
    webhook: false, // Skips ALL modules containing "webhook" in their name
};
```

**How It Works:**

1. The framework strips the numeric prefix and `.js` extension from the module filename
2. It strips the same from your step key
3. It checks if the normalized step key appears **anywhere** in the normalized module name using `includes()`
4. If the step is set to `false` and the key matches, the module is skipped

**Practical Examples:**

```js
// Module structure:
// 01_start.js
// 02_user_get.js
// 03_user_validate.js
// 04_user_update.js
// 05_email_send.js
// 06_email_log.js
// 07_end.js

container.steps = {
    user: false, // Skips: 02_user_get, 03_user_validate, 04_user_update
    email: false, // Skips: 05_email_send, 06_email_log
    user_get: false, // Skips: only 02_user_get (more specific match)
};
```

**Best Practices:**

-   Use specific substring keys for group control (e.g., `"payment"`, `"webhook"`, `"notification"`)
-   Name your modules with clear grouping prefixes to enable batch toggling
-   More specific keys will match fewer modules (e.g., `"user_validate"` vs `"user"`)
-   Document the grouping strategy in your module naming convention
