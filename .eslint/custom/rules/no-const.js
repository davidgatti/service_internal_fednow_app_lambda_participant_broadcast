//
//  Custom ESLint rule enforcing let over const for variable declarations.
//  Standardizes codebase to single declaration keyword to eliminate cognitive
//  overhead of deciding between const and let, reducing decision fatigue during
//  code writing and code review. Provides automatic fix to convert const to
//  let.
//
module.exports = {
    meta: {
        type: 'suggestion',
        fixable: 'code',
        docs: {
            description: 'Disallow const declarations, use let instead',
            category: 'Best Practices'
        }
    },
    create(context) {

        //
        //  Return visitor object that ESLint traverses through AST nodes. This
        //  pattern allows the rule to intercept and validate variable
        //  declarations during the linting phase.
        //
        return {
            VariableDeclaration(node) {

                //
                //  Check if declaration uses const keyword
                //
                if (node.kind === 'const') {

                    //
                    //  Report violation to ESLint with automatic fix. The fix
                    //  function enables --fix flag to automatically convert
                    //  const to let, reducing manual refactoring effort across
                    //  the codebase.
                    //
                    context.report({
                        node,
                        message: 'Use "let" instead of "const"',
                        fix(fixer) {

                            //
                            //  Get source code accessor for token-level
                            //  operations
                            //
                            let sourceCode = context.sourceCode;

                            //
                            //  Locate const keyword token in the declaration
                            //
                            let constToken = sourceCode.getFirstToken(node);

                            //
                            //  >>  Exit
                            //
                            return fixer.replaceText(constToken, 'let');

                        }
                    });

                }

            }
        };

    }
};
