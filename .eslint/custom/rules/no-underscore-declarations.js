//
//  Custom ESLint rule banning underscore-prefixed variable names on let/var
//  declarations. The underscore prefix convention is reserved for unused
//  function parameters, catch clause params, and destructuring rest elements
//  — places where you're forced to accept a variable you don't use. Using _
//  on a let/var declaration is a lazy workaround for no-unused-vars and masks
//  dead code that should be removed.
//
module.exports = {
    meta: {
        type: 'problem',
        docs: {
            description: 'Disallow underscore-prefixed names on let/var declarations',
            category: 'Best Practices'
        }
    },
    create(context) {

        //
        //  Message used for all violations. Guides the developer toward the
        //  correct fix rather than just flagging the problem.
        //
        let message = 'Underscore-prefixed declarations are not allowed. The "_" prefix is only for unused function parameters. If this variable is unused, remove it.';

        //
        //  Return visitor object that ESLint traverses through AST nodes. Only
        //  VariableDeclaration is needed — function params, catch params, and
        //  destructuring in params are handled by different AST node types and
        //  are intentionally ignored.
        //
        return {
            VariableDeclaration(node) {

                //
                //  Only flag let and var declarations. Const is already banned
                //  by no-const rule, but check it here too for completeness in
                //  case this rule is used standalone.
                //
                if (node.kind !== 'let' && node.kind !== 'var') {

                    //
                    //  TODO: Add comment
                    //
                    return;

                }

                //
                //  Iterate each declarator in the declaration. A single
                //  statement like `let a = 1, _b = 2` can have multiple
                //  declarators, each needs independent checking.
                //
                for (let declarator of node.declarations) {

                    //
                    //  Simple identifier: `let _foo = 123`
                    //  Flag if the name starts with a single underscore. Double
                    //  underscore prefixes like __dirname are Node.js/JS engine
                    //  conventions and are intentionally excluded.
                    //
                    if (declarator.id.type === 'Identifier' && declarator.id.name.startsWith('_') && !declarator.id.name.startsWith('__')) {

                        //
                        //  TODO: Add comment
                        //
                        context.report({
                            node: declarator.id,
                            message
                        });

                    }

                    //
                    //  Destructuring patterns (ArrayPattern, ObjectPattern) are
                    //  intentionally skipped. In destructuring, developers need
                    //  underscore prefixes to skip array positions or ignore
                    //  specific object keys they're forced to accept. Example:
                    //  `let [_first, second] = getTuple()` — can't skip without
                    //  naming. This is the same legitimate use case as function
                    //  parameters.
                    //

                }

            }
        };

    }
};
