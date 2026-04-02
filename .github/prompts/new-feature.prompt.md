---
mode: agent
description: scaffolds a new module based on the modular pipeline framework
---

# Scaffold a new module for the modular pipeline

## Step 1: Get module details

Ask "What's the module name and its core responsibility?" if information isn't already provided.

- Module should have one clear, focused responsibility
- Name should follow `entity_action` format (e.g., `user_create`, `data_process`)

## Step 2: Determine execution order

Ask "What execution order should this module have?" to determine the numeric prefix.

- Review existing modules in `src/modules/` to understand current sequence
- Suggest appropriate number based on logical flow

## Step 3: Generate module file

Create new module file `src/modules/XX_${input:moduleName}.js` with:

### Basic module structure:

```js
//
// Description of what this module does
//
module.exports = async (container) => {
    
    // 
    //  Isolate and name request payloads
    //
    let { query, payload } = container.req;
    
    //
    //  Try to run the code
    //
    try 
    {
        // Module-specific logic here
    } 
    catch (error) 
    {
        
        // 
        //  Log context for debugging
        //
        console.info('Module context:', { query, payload });
        
        // 
        //  Surface the error
        //
        throw error;
        
    }
    
};
```

## Step 4: Update documentation

Remind to:

- Update project README if this adds significant functionality
- Add inline comments explaining complex logic
- Follow existing code style from similar modules
- Test with `npm run locally` before submitting
