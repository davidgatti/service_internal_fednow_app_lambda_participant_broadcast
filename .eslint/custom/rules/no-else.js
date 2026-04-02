//
//  Custom ESLint rule prohibiting else and else-if statements. Forces early
//  return patterns and guard clauses to reduce nesting depth and improve code
//  readability. Eliminates branching complexity by requiring explicit exit
//  points instead of conditional branches.
//
module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Disallow else and else-if statements',
            category: 'Best Practices'
        },
        messages: {
            noElse: 'Avoid "else" statements. Use early return or guard clause instead.',
            noElseIf: 'Avoid "else if" statements. Use early return or separate if statements.'
        }
    },
    create(context) {

        //
        //  Return visitor object that ESLint traverses through AST nodes. The
        //  IfStatement visitor intercepts all if/else constructs during the
        //  linting phase.
        //
        return {
            IfStatement(node) {

                //
                //  Skip if no alternate branch exists
                //
                if (!node.alternate) {

                    //
                    //  >>  Exit
                    //
                    return;

                }

                //
                //  Report else-if violation when alternate is another
                //  IfStatement
                //
                if (node.alternate.type === 'IfStatement') {

                    //
                    //  Report else-if violation. Target the alternate node
                    //  to position error marker at the else-if location.
                    //
                    context.report({
                        node: node.alternate,
                        messageId: 'noElseIf'
                    });

                    //
                    //  >>  Exit
                    //
                    return;

                }

                //
                //  Report else violation. Target the alternate node to
                //  position error marker at the else block location.
                //
                context.report({
                    node: node.alternate,
                    messageId: 'noElse'
                });

            }

        };

    }

};
