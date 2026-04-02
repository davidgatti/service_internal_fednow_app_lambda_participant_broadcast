//
//  ESLint Custom Rule: Visual Queue Consistency Enforcement - Ensures every
//  statement has a comment above it to maintain the predictable comment-code
//  visual rhythm that prevents cognitive friction during code review. This
//  rule enforces the Visual Consistency Principle by automatically inserting
//  placeholder "TODO: Add comment" blocks above any statement that lacks its
//  comment companion, making missing comments immediately visible during
//  development and preventing the mental energy waste of wondering if
//  documentation is missing or incomplete.
//
module.exports = {
    meta: {
        type: 'layout',
        docs: {
            description: 'Require comment blocks above statements',
            category: 'Stylistic Issues',
            recommended: false
        },
        fixable: 'whitespace',
        schema: []
    },

    //
    //  Create ESLint rule visitor that inspects AST nodes and enforces comment
    //  presence. Returns visitor object with Program and BlockStatement
    //  handlers that walk the syntax tree, identify statements missing
    //  comments, and auto-fix violations by inserting placeholder comment
    //  blocks.
    //
    create(context) {

        //
        //  Get ESLint source code API for analyzing comments and code structure
        //
        let sourceCode = context.sourceCode;

        //
        //  Detect if current file is a Svelte component
        //
        let filename = context.filename;

        //
        //  Fall back to the deprecated getFilename() API for older ESLint
        //  versions that don't expose context.filename as a direct property,
        //  ensuring compatibility across ESLint v7 and v8+
        //
        if (!filename) {

            //
            //  Retrieve filename via legacy API when modern property is absent
            //
            filename = context.getFilename();

        }

        //
        //  Flag Svelte files so the rule can restrict enforcement to <script>
        //  blocks only, leaving template markup untouched per the Svelte
        //  commenting guidelines
        //
        let isSvelteFile = filename.endsWith('.svelte');

        //
        //  Check if a node is inside a SvelteScriptElement by walking up
        //  the parent chain. Returns true only for nodes within <script> tags.
        //
        function isInsideScriptElement(node) {

            //
            //  Start traversal at the target node and walk up the parent
            //  chain to search for a SvelteScriptElement ancestor
            //
            let current = node;

            //
            //  Walk up the AST parent chain until a SvelteScriptElement is
            //  found or the root is reached (current becomes null/undefined)
            //
            while (current) {

                //
                //  Current ancestor is a Svelte script container, confirming
                //  the original node lives inside a <script> tag
                //
                if (current.type === 'SvelteScriptElement') {

                    //
                    //  >>  Exit
                    //
                    return true;

                }

                //
                //  Advance to the next ancestor to continue the traversal
                //
                current = current.parent;

            }

            //
            //  >>  Exit
            //
            return false;

        }

        //
        //  Calculate statement indentation by analyzing source code whitespace
        //  prefix. Required for auto-fix placeholder comments to match the
        //  visual alignment of the statement they document, maintaining the
        //  predictable visual rhythm when ESLint inserts missing comments.
        //
        function getIndentation(node) {

            //
            //  Extract the actual source code line where this node starts
            //  to analyze its whitespace prefix
            //
            let line = sourceCode.lines[node.loc.start.line - 1];

            //
            //  Capture leading whitespace (spaces or tabs) using regex to
            //  preserve the exact indentation of the original statement
            //
            let match = line.match(/^(\s*)/);

            //
            //  Extract captured whitespace or default to empty string if regex
            //  somehow failed (defensive programming for edge cases)
            //
            let spaces = '';

            //
            //  Use matched whitespace if regex succeeded
            //
            if (match) {

                //
                //  Set spaces from captured group
                //
                spaces = match[1];

            }

            //
            //  >>  Exit
            //
            return spaces;

        }

        //
        //  Determine if a statement has its required comment companion by
        //  checking for comments within 2 lines above it (allows blank line
        //  separator). This validation prevents false positives when comment
        //  blocks are separated from their statements by whitespace.
        //
        function hasCommentAbove(node) {

            //
            //  Query ESLint API for all comments that appear before this node
            //  in the source code
            //
            let comments = sourceCode.getCommentsBefore(node);

            //
            //  No comments exist before this node, therefore it lacks the
            //  required comment companion
            //
            if (comments.length === 0) {

                //
                //  >>  Exit
                //
                return false;

            }

            //
            //  Get the most recent comment before this node to check if it's
            //  directly above (adjacent) to the statement
            //
            let lastComment = comments[comments.length - 1];

            //
            //  Get line number where the statement begins
            //
            let nodeLine = node.loc.start.line;

            //
            //  Get line number where the last comment ends
            //
            let commentLine = lastComment.loc.end.line;

            //
            //  >>  Exit
            //
            return (nodeLine - commentLine) <= 2;

        }

        //
        //  Filter out structural and module-level nodes that don't need comment
        //  companions. Excludes BlockStatement containers, import/export
        //  declarations, and require() calls since they're scaffolding rather
        //  than executable logic requiring documentation.
        //
        function isRealStatement(node) {

            //
            //  Define structural node types that don't need comments because
            //  they're just containers (braces) rather than executable
            //  statements
            //
            let ignoredTypes = [
                'BlockStatement',
                'EmptyStatement'
            ];

            //
            //  Skip structural elements that are just containers, not actual
            //  executable statements
            //
            if (ignoredTypes.includes(node.type)) {

                //
                //  >>  Exit
                //
                return false;

            }

            //
            //  Skip module imports (require, import statements)
            //
            if (node.type === 'VariableDeclaration') {

                //
                //  Get first variable declarator to inspect its initialization
                //
                let declarator = node.declarations[0];

                //
                //  Check if declarator has initialization expression that might
                //  be a module import (require statement)
                //
                if (declarator && declarator.init) {

                    //
                    //  Check for require() calls
                    //
                    if (declarator.init.type === 'CallExpression' &&
                        declarator.init.callee.name === 'require') {

                        //
                        //  >>  Exit
                        //
                        return false;

                    }

                    //
                    //  Check for destructured require() calls
                    //
                    if (declarator.init.type === 'CallExpression' &&
                        declarator.init.callee.type === 'MemberExpression' &&
                        declarator.init.callee.object.name === 'require') {

                        //
                        //  >>  Exit
                        //
                        return false;

                    }

                }

            }

            //
            //  Skip import declarations
            //
            if (node.type === 'ImportDeclaration' || node.type === 'ExportNamedDeclaration' ||
                node.type === 'ExportDefaultDeclaration' || node.type === 'ExportAllDeclaration') {

                //
                //  >>  Exit
                //
                return false;

            }

            //
            //  Skip closing braces and other structural elements
            //
            if (node.parent && node.parent.type === 'BlockStatement' && node.parent.body[0] !== node) {

                //
                //  Get previous statement in the same block to check if
                //  statements are adjacent (no blank line separation)
                //
                let prevSibling = node.parent.body[node.parent.body.indexOf(node) - 1];

                //
                //  If previous statement ends exactly one line before current
                //  statement starts, they're adjacent and should be treated as
                //  separate statements requiring individual comments
                //
                if (prevSibling && prevSibling.loc.end.line === node.loc.start.line - 1) {

                    //
                    //  >>  Exit
                    //
                    return true;

                }

            }

            //
            //  >>  Exit
            //
            return true;

        }

        //
        //  >>  Exit
        //
        return {

            //
            //  Check all statements in the program
            //
            Program(node) {

                //
                //  For Svelte files, only process statements inside <script>
                //  elements
                //
                let statements;

                //
                //  Branch for Svelte files - collect statements only from
                //  <script> blocks to avoid enforcing comments on template
                //  markup nodes outside the script element
                //
                if (isSvelteFile) {

                    //
                    //  Accumulate script-block statements across all
                    //  SvelteScriptElement children found in the AST body
                    //
                    statements = [];

                    //
                    //  Walk top-level AST nodes to locate SvelteScriptElement
                    //  containers and extract their inner statement lists
                    //
                    node.body.forEach(child => {

                        //
                        //  Collect only from script elements that have a body,
                        //  ignoring template markup and style block nodes
                        //
                        if (child.type === 'SvelteScriptElement' && child.body) {

                            //
                            //  Spread script body statements into the shared
                            //  collection so they are validated for comments
                            //
                            statements.push(...child.body);

                        }

                    });

                }

                //
                //  Regular JS file - process all top-level statements
                //
                if (!isSvelteFile) {

                    //
                    //  Use the entire AST body directly since every top-level
                    //  statement in a plain JS file requires a comment
                    //  companion
                    //
                    statements = node.body;

                }

                //
                //  Iterate through each top-level statement to validate it has
                //  a comment companion above it
                //
                statements.forEach(statement => {

                    //
                    //  Skip structural elements that don't need comment
                    //  companions
                    //
                    if (!isRealStatement(statement)) {

                        //
                        //  >>  Exit
                        //
                        return;

                    }

                    //
                    //  Skip statements that already have comment companions
                    //  above them
                    //
                    if (hasCommentAbove(statement)) {

                        //
                        //  >>  Exit
                        //
                        return;

                    }

                    //
                    //  Report ESLint violation and provide auto-fix to insert
                    //  placeholder comment with TODO marker
                    //
                    context.report({
                        node: statement,
                        message: 'Statement missing comment block',
                        fix(fixer) {

                            //
                            //  Get whitespace prefix to match statement
                            //  indentation
                            //
                            let indent = getIndentation(statement);

                            //
                            //  Build placeholder comment block with TODO marker
                            //
                            let placeholder = `${indent}//\n${indent}//  TODO: Add comment\n${indent}//\n`;

                            //
                            //  Calculate line-start insertion position by
                            //  moving back from statement start to the
                            //  beginning of the line
                            //
                            let insertPos = statement.range[0] - statement.loc.start.column;

                            //
                            //  >>  Exit
                            //
                            return fixer.insertTextBeforeRange([insertPos, insertPos], placeholder);

                        }
                    });

                });

            },

            //
            //  Check statements inside functions and blocks
            //
            BlockStatement(node) {

                //
                //  In Svelte files, only process blocks inside <script>
                //  elements
                //
                if (isSvelteFile && !isInsideScriptElement(node)) {

                    //
                    //  >>  Exit
                    //
                    return;

                }

                //
                //  Iterate through each statement in function bodies and block
                //  scopes to validate comment companions
                //
                node.body.forEach(statement => {

                    //
                    //  Skip structural elements that don't need comment
                    //  companions
                    //
                    if (!isRealStatement(statement)) {

                        //
                        //  >>  Exit
                        //
                        return;

                    }

                    //
                    //  Skip statements that already have comment companions
                    //  above them
                    //
                    if (hasCommentAbove(statement)) {

                        //
                        //  >>  Exit
                        //
                        return;

                    }

                    //
                    //  Report ESLint violation and provide auto-fix to insert
                    //  placeholder comment with TODO marker
                    //
                    context.report({
                        node: statement,
                        message: 'Statement missing comment block',
                        fix(fixer) {

                            //
                            //  Get whitespace prefix to match statement
                            //  indentation
                            //
                            let indent = getIndentation(statement);

                            //
                            //  Build placeholder comment block with TODO marker
                            //  to make missing documentation visible during
                            //  development
                            //
                            let placeholder = `${indent}//\n${indent}//  TODO: Add comment\n${indent}//\n`;

                            //
                            //  Calculate line-start insertion position by
                            //  moving back from statement start to the
                            //  beginning of the line
                            //
                            let insertPos = statement.range[0] - statement.loc.start.column;

                            //
                            //  >>  Exit
                            //
                            return fixer.insertTextBeforeRange([insertPos, insertPos], placeholder);

                        }
                    });

                });

            }
        };

    }
};

