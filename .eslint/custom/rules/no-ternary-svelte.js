//
//  Custom ESLint rule that disallows ternary expressions in Svelte files.
//  Templates should only display pre-computed values - all logic belongs
//  in the <script> section using if statements or $derived.by().
//
module.exports = {

    //
    //  Rule metadata declaring this as a stylistic suggestion with a fixed
    //  error message guiding developers toward the correct pattern
    //
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Disallow ternary operators in Svelte files',
            category: 'Stylistic Issues'
        },
        messages: {
            noTernary: 'Avoid ternary expressions. Compute value in script with if statement or $derived.by().'
        }
    },

    //
    //  Rule factory that returns AST visitors scoped only to Svelte files.
    //  Non-Svelte files receive an empty visitor object to avoid false
    //  positives in shared JavaScript modules processed by the same ESLint
    //  config.
    //
    create(context) {

        //
        //  Resolve the filename using the ESLint v8 flat config API first,
        //  falling back to the legacy getFilename() for backwards compatibility
        //
        let filename = context.filename;

        //
        //  Legacy ESLint API fallback for versions that expose getFilename()
        //  instead of the filename property introduced in flat config
        //
        if (!filename) {

            //
            //  >>  Exit
            //
            filename = context.getFilename();

        }

        //
        //  Skip non-Svelte files entirely - ternaries are valid in plain JS
        //
        if (!filename.endsWith('.svelte')) {

            //
            //  >>  Exit
            //
            return {};

        }

        //
        //  Return AST visitor that triggers on every ternary expression found
        //  anywhere in the Svelte file, including inside <script> blocks
        //
        return {

            //
            //  Report every ConditionalExpression node as a violation, forcing
            //  developers to move conditional logic into $derived.by() or if
            //  statements in the script section where it can be properly tested
            //
            ConditionalExpression(node) {

                //
                //  Report the ternary expression
                //
                context.report({
                    node: node,
                    messageId: 'noTernary'
                });

            }

        };

    }

};
