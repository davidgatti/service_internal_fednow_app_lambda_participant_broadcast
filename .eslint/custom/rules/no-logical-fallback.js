//
//  Custom ESLint rule prohibiting logical operators for fallback patterns.
//  Catches expressions like `a || b` and `a && b` used for default values
//  or conditional assignment. Forces explicit if statements for better
//  branch coverage tracking and code clarity.
//
module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Disallow logical operators (|| &&) for fallback/default patterns',
            category: 'Best Practices'
        },
        messages: {
            noLogicalOr: 'Avoid "||" for fallbacks. Use explicit if statement instead.',
            noLogicalAnd: 'Avoid "&&" for conditional execution. Use explicit if statement instead.'
        }
    },
    create(context) {

        //
        //  Check if expression is used as a value (assignment, return,
        //  argument) rather than as a condition in if/while/for statements.
        //
        function is_used_as_value(node) {

            //
            //  Get parent node to determine usage context
            //
            let parent = node.parent;

            //
            //  Assignment: let x = a || b
            //
            if (parent.type === 'VariableDeclarator' && parent.init === node) {

                //
                //  >>  Return true - used as value
                //
                return true;

            }

            //
            //  Assignment expression: x = a || b
            //
            if (parent.type === 'AssignmentExpression' && parent.right === node) {

                //
                //  >>  Return true - used as value
                //
                return true;

            }

            //
            //  Return statement: return a || b
            //
            if (parent.type === 'ReturnStatement') {

                //
                //  >>  Return true - used as value
                //
                return true;

            }

            //
            //  Function argument: func(a || b)
            //
            if (parent.type === 'CallExpression' && parent.arguments.includes(node)) {

                //
                //  >>  Return true - used as value
                //
                return true;

            }

            //
            //  Object property: { key: a || b }
            //
            if (parent.type === 'Property' && parent.value === node) {

                //
                //  >>  Return true - used as value
                //
                return true;

            }

            //
            //  Array element: [a || b]
            //
            if (parent.type === 'ArrayExpression') {

                //
                //  >>  Return true - used as value
                //
                return true;

            }

            //
            //  Nested logical expression: (a || b) || c
            //
            if (parent.type === 'LogicalExpression') {

                //
                //  >>  Return recursive check
                //
                return is_used_as_value(parent);

            }

            //
            //  Conditional (ternary) test or consequence
            //
            if (parent.type === 'ConditionalExpression') {

                //
                //  >>  Return true - used as value
                //
                return true;

            }

            //
            //  >>  Return false - not used as value
            //
            return false;

        }

        //
        //  Return visitor object for AST traversal
        //
        return {
            LogicalExpression(node) {

                //
                //  Only flag logical expressions used as values, not as
                //  conditions in control flow statements
                //
                if (!is_used_as_value(node)) {

                    //
                    //  >>  Exit - not used as value
                    //
                    return;

                }

                //
                //  Report || violation
                //
                if (node.operator === '||') {

                    //
                    //  Report logical or fallback pattern
                    //
                    context.report({
                        node: node,
                        messageId: 'noLogicalOr'
                    });

                    //
                    //  >>  Exit
                    //
                    return;

                }

                //
                //  Report && violation
                //
                if (node.operator === '&&') {

                    //
                    //  Report logical and conditional pattern
                    //
                    context.report({
                        node: node,
                        messageId: 'noLogicalAnd'
                    });

                }

            }

        };

    }

};
