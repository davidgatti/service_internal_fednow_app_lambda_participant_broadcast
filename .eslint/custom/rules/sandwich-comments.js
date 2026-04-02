//
//  ESLint Sandwich Comment Enforcer - Maintains visual consistency by
//  requiring all standalone line comments to be wrapped with empty delimiter
//  lines (//). This creates a predictable visual rhythm where every comment
//  block is clearly separated from code, preventing cognitive friction when
//  scanning files. The pattern eliminates ambiguity about where comment blocks
//  start and end, making code structure instantly recognizable.
//
module.exports = {

    //
    //  ESLint rule metadata declares this as a fixable layout rule that
    //  automatically corrects whitespace violations, allowing developers to
    //  run eslint --fix to apply sandwich comment formatting without manual
    //  intervention
    //
    meta: {
        type: 'layout',
        fixable: 'whitespace',
        docs: {
            description: 'Enforce sandwich comments',
            category: 'Stylistic Issues'
        }
    },

    //
    //  Create the rule checker that analyzes source code and reports
    //  violations. Uses ESLint's context API to access source code, manage
    //  violations, and provide automatic fixes for detected formatting issues.
    //
    create(context) {

        //
        //  Access ESLint's source code API for reading file content, comments,
        //  and line-level details needed to validate sandwich comment
        //  formatting
        //
        let sourceCode = context.sourceCode;

        //
        //  Identify ESLint directive comments that control linting behavior and
        //  should be excluded from sandwich comment enforcement. These
        //  pragmatic comments (eslint-disable, eslint-enable, etc.) serve a
        //  meta-function and forcing sandwich wrapping would harm their
        //  visibility and purpose.
        //
        function isEslintDirectiveComment(comment) {

            //
            //  Reject non-line comments immediately since ESLint directives are
            //  always line comments, never block comments
            //
            if (!comment || comment.type !== 'Line') {

                //
                //  >>  Exit
                //
                return false;

            }

            //
            //  Extract and normalize comment text for pattern matching
            //
            let value = (comment.value || '').trim();

            //
            //  Match ESLint directive prefix pattern to identify control
            //  comments
            //

            //
            //  >>  Exit
            //
            return /^eslint-(?:disable|enable|env|disable-next-line|disable-line)\b/.test(value);

        }

        //
        //  Return rule visitor that processes the entire program AST. Using
        //  Program() ensures we analyze all comments in the file in a single
        //  pass rather than visiting individual nodes repeatedly.
        //

        //
        //  >>  Exit
        //
        return {
            Program() {

                //
                //  Retrieve all comments in the file for filtering and grouping
                //  analysis
                //
                let comments = sourceCode.getAllComments();

                //
                //  Filter for standalone line comments that contain content and
                //  require sandwich formatting. Excludes block comments, empty
                //  delimiters, ESLint directives, and trailing comments since
                //  these serve different purposes and don't need sandwich
                //  wrapping.
                //
                let contentComments = comments.filter(c => {

                    //
                    //  Skip block comments entirely as they use different
                    //  formatting conventions and sandwich rules don't apply
                    //
                    if (c.type !== 'Line') {

                        //
                        //  >>  Exit
                        //
                        return false;

                    }

                    //
                    //  Skip empty delimiter lines (// with no content) since
                    //  they ARE the sandwich wrappers we're trying to enforce
                    //
                    if (c.value.trim().length === 0) {

                        //
                        //  >>  Exit
                        //
                        return false;

                    }

                    //
                    //  Skip ESLint control directives that manage linting
                    //  behavior
                    //
                    if (isEslintDirectiveComment(c)) {

                        //
                        //  >>  Exit
                        //
                        return false;

                    }

                    //
                    //  Determine if comment is standalone or trailing by
                    //  checking if the line starts with the comment marker
                    //  after whitespace. Trailing comments appear after code on
                    //  the same line and don't need sandwich formatting.
                    //
                    let lineStr = sourceCode.lines[c.loc.start.line - 1];

                    //
                    //  Test if line begins with comment marker (ignoring
                    //  leading whitespace)
                    //
                    let isStandalone = /^\s*\/\//.test(lineStr);

                    //
                    //  Exclude trailing comments from sandwich enforcement
                    //
                    if (!isStandalone) {

                        //
                        //  >>  Exit
                        //
                        return false;

                    }

                    //
                    //  Include this standalone content comment for sandwich
                    //  validation
                    //

                    //
                    //  >>  Exit
                    //
                    return true;

                });

                //
                //  Exit early if no content comments found, preventing
                //  unnecessary processing when file contains only delimiters or
                //  code
                //
                if (contentComments.length === 0) {

                    //
                    //  >>  Exit
                    //
                    return;

                }

                //
                //  Group consecutive content comments into logical blocks. Each
                //  group represents a multi-line comment block that should
                //  share a single pair of sandwich delimiters rather than
                //  wrapping each line individually. Empty comment delimiters
                //  between content comments are treated as structural section
                //  dividers and do not break grouping.
                //
                let groups = [];

                //
                //  Initialize first group with the first content comment
                //
                let currentGroup = [contentComments[0]];

                //
                //  Iterate through remaining comments to build groups based on
                //  line adjacency, accounting for empty comment delimiters
                //  between content comments
                //
                for (let i = 1; i < contentComments.length; i++) {

                    //
                    //  Track previous content comment for comparison
                    //
                    let prev = contentComments[i - 1];

                    //
                    //  Track current content comment being evaluated
                    //
                    let curr = contentComments[i];

                    //
                    //  Check if previous and current comments are separated
                    //  only by empty comment lines (delimiters) with no code in
                    //  between. If so, they belong to the same group.
                    //
                    let onlySeparatedByComments = true;

                    //
                    //  Check each line between previous and current comments
                    //
                    for (let lineNum = prev.loc.end.line; lineNum < curr.loc.start.line - 1; lineNum++) {

                        //
                        //  Get line content between the two comments
                        //
                        let betweenLine = sourceCode.lines[lineNum];

                        //
                        //  Normalize for checking if it's a comment or code
                        //
                        let trimmed = '';

                        //
                        //  Extract trimmed content if line exists
                        //
                        if (betweenLine) {

                            //
                            //  Set trimmed content
                            //
                            trimmed = betweenLine.trim();

                        }

                        //
                        //  If line is not empty and not a comment delimiter
                        //  (//), then there's code separating the comments
                        //
                        if (trimmed.length > 0 && trimmed !== '//') {

                            //
                            //  Code found between comments, so they're separate
                            //
                            onlySeparatedByComments = false;

                            //
                            //  >>  Exit
                            //
                            break;

                        }

                    }

                    //
                    //  If only comments (or empty lines) separate them, keep in
                    //  same group. Otherwise, start a new group.
                    //
                    if (onlySeparatedByComments && curr.loc.start.line <= prev.loc.end.line + 10) {

                        //
                        //  Extend current group with adjacent content
                        //
                        currentGroup.push(curr);

                        //
                        //  >>  Continue
                        //
                        continue;

                    }

                    //
                    //  Finalize current group since non-comment separator
                    //  detected
                    //
                    groups.push(currentGroup);

                    //
                    //  Start new group with current comment
                    //
                    currentGroup = [curr];

                }

                //
                //  Finalize last group after loop completes
                //
                groups.push(currentGroup);

                //
                //  Validate sandwich formatting for each comment group by
                //  checking for proper delimiter lines above and below, correct
                //  spacing, and consistent indentation. Reports violations with
                //  automatic fixes.
                //
                groups.forEach(group => {

                    //
                    //  Identify first comment in group for top delimiter
                    //  validation
                    //
                    let first = group[0];

                    //
                    //  Identify last comment in group for bottom delimiter
                    //  validation
                    //
                    let last = group[group.length - 1];

                    //
                    //  Extract indentation level from first comment line to
                    //  maintain consistent spacing when auto-fixing delimiter
                    //  insertion
                    //
                    let indent = sourceCode.lines[first.loc.start.line - 1].match(/^\s*/)[0];

                    //
                    //  Enforce 2-space formatting between // and comment
                    //  content for visual consistency. This spacing standard
                    //  ensures comments align predictably and improves
                    //  readability across the codebase.
                    //
                    group.forEach(comment => {

                        //
                        //  Extract raw comment text (content after //)
                        //
                        let commentValue = comment.value;

                        //
                        //  Validate spacing for non-empty comments, requiring
                        //  exactly 2 spaces after the // marker. Empty
                        //  delimiters are excluded.
                        //
                        if (commentValue.trim().length > 0 && !commentValue.startsWith('  ')) {

                            //
                            //  Report spacing violation with automatic fix that
                            //  normalizes to 2-space format
                            //
                            context.report({
                                loc: comment.loc,
                                message: 'Comment content must have 2 spaces after //',
                                fix(fixer) {

                                    //
                                    //  Remove existing irregular spacing
                                    //
                                    let trimmed = commentValue.trim();

                                    //
                                    //  Reconstruct comment with proper 2-space
                                    //  formatting
                                    //

                                    //
                                    //  >>  Exit
                                    //
                                    return fixer.replaceText(comment, `//  ${trimmed}`);

                                }
                            });

                        }

                    });

                    //
                    //  Validate top delimiter exists for sandwich wrapping. The
                    //  top delimiter must be an empty line comment (//)
                    //  appearing directly above the first content comment in
                    //  the group.
                    //
                    let firstIndex = comments.indexOf(first);

                    //
                    //  Look back one comment to check for top delimiter
                    //
                    let prevComment = comments[firstIndex - 1];

                    //
                    //  Track whether valid top delimiter exists
                    //
                    let hasTopDelimiter = false;

                    //
                    //  Store reference to top delimiter for later validation
                    //
                    let topDelimiter = null;

                    //
                    //  Detect valid top delimiter by checking if previous
                    //  comment is an empty line comment on the immediately
                    //  preceding line
                    //
                    if (prevComment &&
                        prevComment.type === 'Line' &&
                        prevComment.value.trim().length === 0 &&
                        prevComment.loc.end.line === first.loc.start.line - 1) {

                        //
                        //  Mark top delimiter as present
                        //
                        hasTopDelimiter = true;

                        //
                        //  Store delimiter reference for spacing validation
                        //
                        topDelimiter = prevComment;

                    }

                    //
                    //  Report missing top delimiter and provide automatic fix
                    //  that inserts proper delimiter with appropriate spacing
                    //
                    if (!hasTopDelimiter) {

                        //
                        //  Report violation for missing top sandwich delimiter
                        //
                        context.report({
                            loc: first.loc,
                            message: 'Comment block must be preceded by an empty `//` line.',
                            fix(fixer) {

                                //
                                //  Calculate line number before first comment
                                //
                                let lineBeforeFirst = first.loc.start.line - 1;

                                //
                                //  Check if previous line contains code to
                                //  determine spacing strategy
                                //
                                if (lineBeforeFirst > 0) {

                                    //
                                    //  Read content of previous line
                                    //
                                    let prevLine = sourceCode.lines[lineBeforeFirst - 1];

                                    //
                                    //  Normalize line content for empty check
                                    //
                                    let prevLineTrimmed = '';

                                    //
                                    //  Extract trimmed content if line exists
                                    //
                                    if (prevLine) {

                                        //
                                        //  Set trimmed content
                                        //
                                        prevLineTrimmed = prevLine.trim();

                                    }

                                    //
                                    //  Insert blank line before delimiter when
                                    //  code precedes comment to maintain visual
                                    //  separation per style guide
                                    //
                                    if (prevLineTrimmed.length > 0) {

                                        //
                                        //  Insert newline, delimiter, and
                                        //  another newline with proper
                                        //  indentation
                                        //

                                        //
                                        //  >>  Exit
                                        //
                                        return fixer.insertTextBefore(first, `\n${indent}//\n${indent}`);

                                    }

                                }

                                //
                                //  Insert delimiter only when no code precedes
                                //  comment
                                //

                                //
                                //  >>  Exit
                                //
                                return fixer.insertTextBefore(first, `//\n${indent}`);

                            }
                        });

                        //
                        //  >>  Return
                        //
                        return;

                    }

                    //
                    //  Validate spacing before top delimiter. Requires
                    //  blank line when code precedes delimiter, prevents
                    //  excess blank lines.
                    //
                    let lineBeforeDelimiter = topDelimiter.loc.start.line - 1;

                    //
                    //  Check spacing rules only when delimiter isn't at
                    //  file start
                    //
                    if (lineBeforeDelimiter > 0) {

                        //
                        //  Read line preceding top delimiter
                        //
                        let prevLine = sourceCode.lines[lineBeforeDelimiter - 1];

                        //
                        //  Normalize content for type detection
                        //
                        let prevLineTrimmed = '';

                        //
                        //  Extract trimmed content if line exists
                        //
                        if (prevLine) {

                            //
                            //  Set trimmed content
                            //
                            prevLineTrimmed = prevLine.trim();

                        }

                        //
                        //  Identify if previous line contains code (not a
                        //  delimiter or blank line)
                        //
                        let isCode = false;

                        //
                        //  Check if line has content and is not a delimiter
                        //
                        if (prevLineTrimmed.length > 0) {

                            //
                            //  Check if content is not a comment delimiter
                            //
                            if (prevLineTrimmed !== '//') {

                                //
                                //  Set as code
                                //
                                isCode = true;

                            }

                        }

                        //
                        //  Enforce blank line before delimiter when code
                        //  precedes it
                        //
                        if (isCode) {

                            //
                            //  Calculate line number before the code line
                            //
                            let lineBeforePrev = lineBeforeDelimiter - 1;

                            //
                            //  Check if blank line already exists before
                            //  code
                            //
                            let isBlankLineBefore = false;

                            //
                            //  Check line position and content
                            //
                            if (lineBeforePrev > 0) {

                                //
                                //  Check if previous line is blank
                                //
                                if (sourceCode.lines[lineBeforePrev - 1].trim().length === 0) {

                                    //
                                    //  Set blank line exists
                                    //
                                    isBlankLineBefore = true;

                                }

                            }

                            //
                            //  Report missing blank line and auto-fix by
                            //  inserting one
                            //
                            if (!isBlankLineBefore) {

                                //
                                //  Report spacing violation
                                //
                                context.report({
                                    loc: topDelimiter.loc,
                                    message: 'Blank line required before comment delimiter',
                                    fix(fixer) {

                                        //
                                        //  Insert blank line before
                                        //  delimiter
                                        //

                                        //
                                        //  >>  Exit
                                        //
                                        return fixer.insertTextBefore(topDelimiter, '\n' + indent);

                                    }
                                });

                            }

                            //
                            //  >>  Return
                            //
                            return;

                        }

                        //
                        //  Previous line is blank - validate spacing to prevent
                        //  double blank lines which violate spacing standards
                        //
                        if (prevLineTrimmed.length === 0) {

                            //
                            //  Previous line is blank - check for double
                            //  blank lines which violate spacing standards
                            //
                            let lineBeforePrev = lineBeforeDelimiter - 1;

                            //
                            //  Validate spacing before blank line
                            //
                            if (lineBeforePrev > 0) {

                                //
                                //  Read line before the blank line
                                //
                                let lineBeforePrevContent = sourceCode.lines[lineBeforePrev - 1];

                                //
                                //  Normalize for blank detection
                                //
                                let trimmedBefore = '';

                                //
                                //  Extract trimmed content if line exists
                                //
                                if (lineBeforePrevContent) {

                                    //
                                    //  Set trimmed content
                                    //
                                    trimmedBefore = lineBeforePrevContent.trim();

                                }

                                //
                                //  Detect double blank lines and report
                                //  violation
                                //
                                if (trimmedBefore.length === 0) {

                                    //
                                    //  Report excess spacing violation
                                    //
                                    context.report({
                                        loc: topDelimiter.loc,
                                        message: 'Remove extra blank line before comment delimiter',
                                        fix(fixer) {

                                            //
                                            //  Calculate range start for
                                            //  removal
                                            //
                                            let start = sourceCode.getIndexFromLoc({ line: lineBeforeDelimiter, column: 0 });

                                            //
                                            //  Calculate range end for
                                            //  removal
                                            //
                                            let end = sourceCode.getIndexFromLoc({ line: lineBeforeDelimiter + 1, column: 0 });

                                            //
                                            //  Remove one blank line
                                            //

                                            //
                                            //  >>  Exit
                                            //
                                            return fixer.removeRange([start, end]);

                                        }
                                    });

                                }

                            }

                        }

                    }

                    //
                    //  Validate bottom delimiter exists for sandwich wrapping.
                    //  The bottom delimiter must be an empty line comment (//)
                    //  appearing directly below the last content comment in the
                    //  group.
                    //
                    let lastIndex = comments.indexOf(last);

                    //
                    //  Look ahead one comment to check for bottom delimiter
                    //
                    let nextComment = comments[lastIndex + 1];

                    //
                    //  Track whether valid bottom delimiter exists
                    //
                    let hasBottomDelimiter = false;

                    //
                    //  Detect valid bottom delimiter by checking if next
                    //  comment is an empty line comment on the immediately
                    //  following line
                    //
                    if (nextComment &&
                        nextComment.type === 'Line' &&
                        nextComment.value.trim().length === 0 &&
                        nextComment.loc.start.line === last.loc.end.line + 1) {

                        //
                        //  Mark bottom delimiter as present
                        //
                        hasBottomDelimiter = true;

                    }

                    //
                    //  Report missing bottom delimiter and provide automatic
                    //  fix
                    //
                    if (!hasBottomDelimiter) {

                        //
                        //  Report violation for missing bottom sandwich
                        //  delimiter
                        //
                        context.report({
                            loc: last.loc,
                            message: 'Comment block must be followed by an empty `//` line.',
                            fix(fixer) {

                                //
                                //  Insert delimiter after last comment with
                                //  proper indentation
                                //

                                //
                                //  >>  Exit
                                //
                                return fixer.insertTextAfter(last, `\n${indent}//`);

                            }
                        });

                    }

                    //
                    //  Validate spacing after bottom delimiter. Prevents excess
                    //  blank lines while respecting padded-blocks and comment
                    //  block separation.
                    //
                    if (hasBottomDelimiter) {

                        //
                        //  Get reference to bottom delimiter for spacing
                        //  validation
                        //
                        let bottomDelimiter = comments[comments.indexOf(last) + 1];

                        //
                        //  Calculate line number after bottom delimiter
                        //
                        let lineAfterDelimiter = bottomDelimiter.loc.end.line + 1;

                        //
                        //  Validate spacing only if more content exists after
                        //  delimiter
                        //
                        if (lineAfterDelimiter <= sourceCode.lines.length) {

                            //
                            //  Read next line after delimiter
                            //
                            let nextLine = sourceCode.lines[lineAfterDelimiter - 1];

                            //
                            //  Handle blank line after delimiter - check what
                            //  follows
                            //
                            if (nextLine !== undefined && nextLine.trim().length === 0) {

                                //
                                //  Calculate line after blank line
                                //
                                let lineAfterBlank = lineAfterDelimiter + 1;

                                //
                                //  Check content after blank line if it exists
                                //
                                if (lineAfterBlank <= sourceCode.lines.length) {

                                    //
                                    //  Read content after blank line
                                    //
                                    let lineAfterBlankContent = sourceCode.lines[lineAfterBlank - 1];

                                    //
                                    //  Normalize content for type detection
                                    //
                                    let trimmed = '';

                                    //
                                    //  Extract trimmed content if line exists
                                    //
                                    if (lineAfterBlankContent) {

                                        //
                                        //  Set trimmed content
                                        //
                                        trimmed = lineAfterBlankContent.trim();

                                    }

                                    //
                                    //  Remove blank line when code follows (not
                                    //  delimiter or closing brace). Preserves
                                    //  blank lines before closing braces for
                                    //  padded-blocks compatibility.
                                    //
                                    if (trimmed.length > 0 && trimmed !== '//' && !trimmed.startsWith('}')) {

                                        //
                                        //  Report excess spacing violation
                                        //
                                        context.report({
                                            loc: {
                                                start: { line: lineAfterDelimiter, column: 0 },
                                                end: { line: lineAfterDelimiter, column: nextLine.length }
                                            },
                                            message: 'Remove blank line after comment delimiter',
                                            fix(fixer) {

                                                //
                                                //  Calculate removal range
                                                //  start
                                                //
                                                let start = sourceCode.getIndexFromLoc({ line: lineAfterDelimiter, column: 0 });

                                                //
                                                //  Calculate removal range end
                                                //
                                                let end = sourceCode.getIndexFromLoc({ line: lineAfterDelimiter + 1, column: 0 });

                                                //
                                                //  Remove blank line
                                                //

                                                //
                                                //  >>  Exit
                                                //
                                                return fixer.removeRange([start, end]);

                                            }
                                        });

                                    }

                                }

                                //
                                //  >>  Return
                                //
                                return;

                            }

                            //
                            //  Next line is a delimiter - validate separation
                            //  between consecutive comment blocks
                            //
                            if (nextLine !== undefined && nextLine.trim() === '//') {

                                //
                                //  Bottom delimiter immediately followed by
                                //  another top delimiter requires blank line
                                //  separator between distinct comment blocks
                                //
                                let nextDelimiterIndex = comments.findIndex(c =>
                                    c.loc.start.line === lineAfterDelimiter &&
                                    c.type === 'Line' &&
                                    c.value.trim().length === 0
                                );

                                //
                                //  Report missing separator and auto-fix by
                                //  inserting blank line
                                //
                                if (nextDelimiterIndex !== -1) {

                                    //
                                    //  Get reference to next delimiter
                                    //
                                    let nextDelimiter = comments[nextDelimiterIndex];

                                    //
                                    //  Report spacing violation between comment
                                    //  blocks
                                    //
                                    context.report({
                                        loc: nextDelimiter.loc,
                                        message: 'Blank line required between comment blocks',
                                        fix(fixer) {

                                            //
                                            //  Extract indentation from current
                                            //  line
                                            //
                                            let indent = sourceCode.lines[lineAfterDelimiter - 1].match(/^\s*/)[0];

                                            //
                                            //  Insert blank line between
                                            //  comment blocks
                                            //

                                            //
                                            //  >>  Exit
                                            //
                                            return fixer.insertTextBefore(nextDelimiter, '\n' + indent);

                                        }
                                    });

                                }

                            }

                        }

                    }

                });

            }
        };

    }
};
