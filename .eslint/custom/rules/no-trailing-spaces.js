//
//  Custom ESLint Rule: no-trailing-spaces enforces consistent whitespace
//  hygiene by removing trailing spaces from all lines including blank lines.
//  Prevents git diff noise from invisible whitespace changes and maintains
//  clean code formatting standards across the codebase.
//
module.exports = {
    meta: {
        type: 'layout',
        docs: {
            description: 'Disallow trailing whitespace at the end of lines',
            category: 'Stylistic Issues'
        },
        fixable: 'whitespace',
        schema: []
    },

    create(context) {

        //
        //  Access ESLint source code API for line-by-line inspection
        //
        let sourceCode = context.sourceCode;

        //
        //  >>  Exit
        //
        return {
            Program() {

                //
                //  Extract all source code lines for trailing space detection
                //
                let lines = sourceCode.lines;

                //
                //  Scan each line for trailing whitespace violations
                //
                lines.forEach((line, index) => {

                    //
                    //  Remove trailing spaces to compare against original line
                    //
                    let trimmed = line.trimEnd();

                    //
                    //  Detect trailing whitespace by comparing original vs
                    //  trimmed
                    //
                    if (line !== trimmed) {

                        //
                        //  Convert zero-based index to one-based line number
                        //  for error reporting
                        //
                        let lineNumber = index + 1;

                        //
                        //  Calculate number of trailing spaces for error
                        //  message
                        //
                        let trailingSpaces = line.length - trimmed.length;

                        //
                        //  Build plural suffix for message
                        //
                        let suffix = '';

                        //
                        //  Add 's' for plural when more than one space
                        //
                        if (trailingSpaces > 1) {

                            //
                            //  Set plural suffix
                            //
                            suffix = 's';

                        }

                        //
                        //  Report ESLint violation with auto-fix capability for
                        //  trailing spaces
                        //
                        context.report({
                            loc: {
                                start: { line: lineNumber, column: trimmed.length },
                                end: { line: lineNumber, column: line.length }
                            },
                            message: `Line has ${trailingSpaces} trailing space${suffix}`,
                            fix(fixer) {

                                //
                                //  Calculate absolute character index where
                                //  line starts in file
                                //
                                let lineStart = sourceCode.getIndexFromLoc({ line: lineNumber, column: 0 });

                                //
                                //  Calculate absolute character index where
                                //  line ends in file
                                //
                                let lineEnd = sourceCode.getIndexFromLoc({ line: lineNumber, column: line.length });

                                //
                                //  >>  Exit
                                //
                                return fixer.replaceTextRange([lineStart, lineEnd], trimmed);

                            }
                        });

                    }

                });

            }
        };

    }
};
