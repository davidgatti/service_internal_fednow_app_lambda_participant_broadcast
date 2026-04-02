//
//  Custom ESLint rule to enforce line comments over block comments.
//  Converts block comments to sandwich-style line comments.
//
module.exports = {
    meta: {
        type: 'layout',
        fixable: 'whitespace',
        docs: {
            description: 'Disallow block comments, use line comments instead',
            category: 'Stylistic Issues'
        }
    },
    create(context) {

        //
        //  Get ESLint source code API to access all comments in the file for
        //  analysis and transformation
        //
        let sourceCode = context.sourceCode;

        //
        //  Return visitor that runs once per file at Program level to capture
        //  all comments before traversing the AST
        //
        return {
            Program() {

                //
                //  Retrieve all comments in the file including those not
                //  attached to specific AST nodes for comprehensive style
                //  checking
                //
                let comments = sourceCode.getAllComments();

                //
                //  Iterate through comments to identify and transform
                //  block-style comments into codebase-standard line comments
                //
                comments.forEach(comment => {

                    //
                    //  Skip line comments since they already conform to style
                    //  guide requirements and need no transformation
                    //
                    if (comment.type !== 'Block') {

                        //
                        //  >>  Exit
                        //
                        return;

                    }

                    //
                    //  Extract comment content and remove surrounding
                    //  whitespace for checking ESLint directive patterns
                    //
                    let blockTrimmed = (comment.value || '').trim();

                    //
                    //  Skip ESLint configuration directives since they control
                    //  linter behavior and must remain as block comments for
                    //  ESLint parsing
                    //
                    if (/^eslint-(?:disable|enable|env)\b/.test(blockTrimmed)) {

                        //
                        //  >>  Exit
                        //
                        return;

                    }

                    //
                    //  Get indentation by finding the start of the comment's
                    //  line and measuring whitespace. Uses getIndexFromLoc to
                    //  handle coordinate systems in parsers like
                    //  svelte-eslint-parser.
                    //
                    let commentStartIndex = sourceCode.getIndexFromLoc(comment.loc.start);

                    //
                    //  Retrieve the complete raw source text of the file to
                    //  enable line-boundary detection via character index
                    //  arithmetic
                    //
                    let fullText = sourceCode.getText();

                    //
                    //  Find the character index where the comment's line begins
                    //  by searching backwards from the comment start for the
                    //  preceding newline, adding 1 to step past it
                    //
                    let lineStartIndex = fullText.lastIndexOf('\n', commentStartIndex - 1) + 1;

                    //
                    //  Slice the source between the line start and comment
                    //  start to capture any whitespace or code that precedes
                    //  the comment on the same line
                    //
                    let textBeforeComment = fullText.slice(lineStartIndex, commentStartIndex);

                    //
                    //  Extract leading whitespace from the pre-comment text to
                    //  reproduce the same indentation in every line of the
                    //  replacement sandwich-style comment block
                    //
                    let indent = textBeforeComment.match(/^\s*/)[0];

                    //
                    //  Extract lines from block comment
                    //
                    let blockContent = comment.value;

                    //
                    //  Parse multi-line block content into individual lines,
                    //  strip JSDoc-style asterisks and indentation to extract
                    //  pure content, and discard empty lines produced by blank
                    //  separators
                    //
                    let lines = blockContent.split('\n').map(line => {

                        //
                        //  Remove leading whitespace and asterisks
                        //
                        let cleaned = line.replace(/^\s*\*?\s?/, '');

                        //
                        //  >>  Exit
                        //
                        return cleaned;

                    }).filter(line => line.length > 0);

                    //
                    //  Build sandwich-style comment. First line has no indent
                    //  because existing whitespace before the comment is
                    //  preserved when replacing. Subsequent lines need indent
                    //  after each newline.
                    //
                    let lineComments = [
                        '//',
                        ...lines.map(line => `${indent}//  ${line}`),
                        `${indent}//`
                    ];

                    //
                    //  Join formatted lines with newlines to create complete
                    //  replacement text maintaining original structure
                    //
                    let replacement = lineComments.join('\n');

                    //
                    //  Report style violation to ESLint with auto-fix
                    //  capability to transform block comment into
                    //  sandwich-style line comments
                    //
                    context.report({
                        node: comment,
                        message: 'Block comments are not allowed. Use line comments with sandwich delimiters.',
                        fix(fixer) {

                            //
                            //  Replace block comment with sandwich-style line
                            //  comment format matching codebase standards
                            //
                            return fixer.replaceText(comment, replacement);

                        }
                    });

                });

            }
        };

    }
};

