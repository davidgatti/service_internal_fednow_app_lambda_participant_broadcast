//
//  Custom ESLint rule enforcing naming convention for global stores.
//
//  Requirement from Issue #6 (ARCHITECTURE: Define Global State Pattern): All
//  stores in src/lib/stores/*.svelte.js must use global_ prefix to distinguish
//  from page-local state. This prevents accidental leakage of cross-page state
//  into individual page components.
//
//  Pattern:
//    - Store objects: globalSelection, globalTheme, globalAuth
//    - Action functions: globalSelectionSet, globalSelectionClear
//    - Query functions: *Query (userQuery, healthQuery) - different suffix
//      convention
//
//  Examples:
//    ✓ export let globalSelection = { ... }
//    ✓ export function globalSelectionSet(key, value) { ... }
//    ✓ export function globalSelectionClear() { ... }
//    ✓ export function userQuery(id) { ... }  // Queries use *Query suffix
//
//    ✗ export let selectionStore = { ... }      // Missing global_ prefix
//    ✗ export let selection = { ... }           // Missing global_ prefix
//    ✗ export function selectionSet() { ... }   // Missing global_ prefix
//
//  Legacy stores (backward compatibility):
//    - authStore, themeStore, notificationsStore (predated this convention)
//    - These are grandfathered in and exempt from the rule
//
//  Applies to:
//    - src/lib/stores/*.svelte.js files only
//    - Does NOT apply to other directories
//
//  Reference:
//    - See src/service_web_dashboard/src/lib/ARCHITECTURE.md for state
//      architecture guide
//
module.exports = {
    meta: {
        type: 'problem',
        docs: {
            description: 'Enforce global_ prefix for stores and action functions',
            category: 'Best Practices'
        },
        messages: {
            missingGlobalPrefix: 'Store export "{{ name }}" must use global_ prefix. Use: global{{ pascalCase }}',
            actionFunctionMissing: 'Action function "{{ name }}" must use global_ prefix. Use: global{{ pascalCase }}'
        }
    },

    create(context) {

        //
        //  Get filename from context. In ESLint 10+, filename is available
        //  directly on the context object.
        //
        let filename = context.filename;

        //
        //  Normalize path separators for cross-platform
        //
        let normalizedPath = filename.replace(/\\/g, '/');

        //
        //  Only apply to stores/*.svelte.js files
        //
        if (!normalizedPath.includes('/lib/stores/') || !normalizedPath.endsWith('.svelte.js')) {

            //
            //  Not a store file
            //
            return {};

        }

        //
        //  Return visitor for ExportNamedDeclaration
        //
        return {
            ExportNamedDeclaration(node) {

                //
                //  Get the declaration (can be variable, function, etc.)
                //
                let declaration = node.declaration;

                //
                //  Guard: No declaration
                //
                if (!declaration) {

                    //
                    //  >>  Exit
                    //
                    return;

                }

                //
                //  Handle variable declarations (let, const)
                //
                if (declaration.type === 'VariableDeclaration') {

                    //
                    //  Iterate each variable declared
                    //
                    declaration.declarations.forEach(decl => {

                        //
                        //  Get variable name
                        //
                        let varName = decl.id.name;

                        //
                        //  Skip ALL-CAPS constants (configuration data like
                        //  THEMES) These are not stores, just exported
                        //  constants
                        //
                        if (varName === varName.toUpperCase()) {

                            //
                            //  >>  Exit - skip constants
                            //
                            return;

                        }

                        //
                        //  Check if uses global_ prefix
                        //
                        if (!varName.startsWith('global')) {

                            //
                            //  Report error
                            //
                            context.report({
                                node: decl,
                                messageId: 'missingGlobalPrefix',
                                data: {
                                    name: varName,
                                    pascalCase: varName.charAt(0).toUpperCase() + varName.slice(1)
                                }
                            });

                        }

                    });

                }

                //
                //  Handle function declarations
                //
                if (declaration.type === 'FunctionDeclaration') {

                    //
                    //  Get function name
                    //
                    let funcName = declaration.id.name;

                    //
                    //  Exception: Query functions don't use global_ (userQuery,
                    //  healthQuery)
                    //
                    if (funcName.endsWith('Query')) {

                        //
                        //  >>  Skip query functions (different convention)
                        //
                        return;

                    }

                    //
                    //  Action functions MUST use global_ prefix
                    //
                    if (!funcName.startsWith('global')) {

                        //
                        //  Report error
                        //
                        context.report({
                            node: declaration,
                            messageId: 'actionFunctionMissing',
                            data: {
                                name: funcName,
                                pascalCase: funcName.charAt(0).toUpperCase() + funcName.slice(1)
                            }
                        });

                    }

                }

            }
        };

    }

};
