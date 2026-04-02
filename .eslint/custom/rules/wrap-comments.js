//
//  Custom ESLint rule enforcing 80-character line width limit for comments.
//  Groups consecutive line comments into logical blocks and rewraps them
//  together to prevent orphaned words or broken narrative flow. Implements
//  intelligent grouping that respects comment boundaries, list formatting,
//  and handles edge cases like long URLs that cannot be wrapped.
//
module.exports = {
    meta: {
        type: 'layout',
        fixable: 'whitespace',
        docs: {
            description: 'Wrap line comments to 80 characters',
            category: 'Stylistic Issues'
        }
    },
    create(context) {

        //
        //  ESLint context API providing access to source code and AST for
        //  comment analysis
        //
        let sourceCode = context.sourceCode;

        //
        //  Maximum character width per line enforced by this rule to maintain
        //  readability and consistent formatting across the codebase
        //
        let MAX_WIDTH = 80;

        //
        //  Wrap comment text to fit within max width while preserving word
        //  boundaries. Uses greedy line-filling algorithm that maximizes
        //  words per line without exceeding the character limit.
        //
        function wrapText(text, maxWidth, indent) {

            //
            //  Extract all words from text, filtering out whitespace to enable
            //  clean rewrapping regardless of original formatting
            //
            let words = text.match(/\S+/g);

            //
            //  Default to empty array if no words found
            //
            if (!words) {

                //
                //  Set empty array
                //
                words = [];

            }

            //
            //  Handle edge case where text contains only whitespace or is empty
            //
            if (words.length === 0) {

                //
                //  >>  Exit
                //
                return [];

            }

            //
            //  Accumulator for completed lines after wrapping
            //
            let lines = [];

            //
            //  Current line being built word-by-word until it reaches max width
            //
            let currentLine = [];

            //
            //  Running character count for current line excluding prefix
            //
            let currentLen = 0;

            //
            //  Character count for comment prefix including indentation and
            //  comment delimiter
            //
            let prefixLen = indent.length + 4;

            //
            //  Process each word and place it on current line if it fits, or
            //  start a new line if adding it would exceed max width
            //
            for (let word of words) {

                //
                //  Calculate word length for boundary checking
                //
                let wordLen = word.length;

                //
                //  Space separator needed before word if line already has
                //  content
                //
                let spaceLen = 0;

                //
                //  Add space if line has content
                //
                if (currentLine.length > 0) {

                    //
                    //  Set space length
                    //
                    spaceLen = 1;

                }

                //
                //  Check if adding this word would exceed max width. If so,
                //  flush current line and start new line with this word.
                //
                if (currentLine.length > 0 && prefixLen + currentLen + spaceLen + wordLen > maxWidth) {

                    //
                    //  Flush completed line to output
                    //
                    lines.push(currentLine.join(' '));

                    //
                    //  Start new line with word that didn't fit
                    //
                    currentLine = [word];

                    //
                    //  Reset length counter for new line
                    //
                    currentLen = wordLen;

                    //
                    //  >>  Continue
                    //
                    continue;

                }

                //
                //  Word fits on current line, add it
                //
                currentLine.push(word);

                //
                //  Update length counter including space separator if
                //  needed
                //
                currentLen += spaceLen + wordLen;

            }

            //
            //  Flush final line if it has content
            //
            if (currentLine.length > 0) {

                //
                //  Add remaining words to output
                //
                lines.push(currentLine.join(' '));

            }

            //
            //  >>  Exit
            //
            return lines;

        }

        //
        //  ESLint visitor pattern returning Program node handler that runs
        //  once to analyze all comments in the file
        //
        return {
            Program() {

                //
                //  Retrieve all comments from source code for analysis
                //
                let comments = sourceCode.getAllComments();

                //
                //  Track which comments have been processed to prevent
                //  duplicate handling when grouping consecutive comments
                //
                let handled = new Set();

                //
                //  Iterate through all comments to find groups that need
                //  wrapping
                //
                for (let i = 0; i < comments.length; i++) {

                    //
                    //  Current comment being analyzed for grouping and wrapping
                    //
                    let comment = comments[i];

                    //
                    //  Skip block comments as this rule only processes line
                    //  comments
                    //
                    if (comment.type !== 'Line') {

                        //
                        //  >>  Exit
                        //
                        continue;

                    }

                    //
                    //  Skip comments already processed as part of a group
                    //
                    if (handled.has(comment)) {

                        //
                        //  >>  Exit
                        //
                        continue;

                    }

                    //
                    //  Skip empty comments as they serve as visual separators
                    //
                    if (comment.value.trim().length === 0) {

                        //
                        //  >>  Exit
                        //
                        continue;

                    }

                    //
                    //  Get source line to extract indentation for group
                    //  detection
                    //
                    let lineText = sourceCode.lines[comment.loc.start.line - 1];

                    //
                    //  Extract indentation whitespace before comment delimiter
                    //
                    let indentMatch = lineText.match(/^(\s*)\/\//);

                    //
                    //  Skip malformed comments that don't match expected format
                    //
                    if (!indentMatch) {

                        //
                        //  >>  Exit
                        //
                        continue;

                    }

                    //
                    //  Store indentation for matching consecutive comments at
                    //  same level
                    //
                    let indent = indentMatch[1];

                    //
                    //  Initialize group with current comment as first member
                    //
                    let group = [comment];

                    //
                    //  Mark comment as processed to prevent duplicate handling
                    //
                    handled.add(comment);

                    //
                    //  Track line number to detect consecutive comments
                    //
                    let lastLineNum = comment.loc.end.line;

                    //
                    //  Scan forward to find consecutive comments at same
                    //  indentation level that should be grouped together for
                    //  rewrapping
                    //
                    for (let j = i + 1; j < comments.length; j++) {

                        //
                        //  Next comment candidate for adding to group
                        //
                        let next = comments[j];

                        //
                        //  Stop grouping if next comment is block style
                        //
                        if (next.type !== 'Line') {

                            //
                            //  >>  Exit
                            //
                            break;

                        }

                        //
                        //  Stop grouping if next comment is not on immediately
                        //  following line
                        //
                        if (next.loc.start.line !== lastLineNum + 1) {

                            //
                            //  >>  Exit
                            //
                            break;

                        }

                        //
                        //  Extract comment content for list detection
                        //
                        let nextVal = next.value.trim();

                        //
                        //  Stop grouping at empty comment as it marks section
                        //  boundary
                        //
                        if (nextVal.length === 0) {

                            //
                            //  >>  Exit
                            //
                            break;

                        }

                        //
                        //  Stop grouping if next comment starts a list item, as
                        //  lists should not be rewrapped
                        //
                        if (/^[-*]\s/.test(nextVal) || /^\d+\.\s/.test(nextVal)) {

                            //
                            //  >>  Exit
                            //
                            break;

                        }

                        //
                        //  Stop grouping if current comment starts a list item
                        //
                        if (/^[-*]\s/.test(comment.value.trim()) || /^\d+\.\s/.test(comment.value.trim())) {

                            //
                            //  >>  Exit
                            //
                            break;

                        }

                        //
                        //  Get source line for indentation verification
                        //
                        let nextLineText = sourceCode.lines[next.loc.start.line - 1];

                        //
                        //  Stop grouping if indentation level differs
                        //
                        if (!nextLineText.startsWith(indent + '//')) {

                            //
                            //  >>  Exit
                            //
                            break;

                        }

                        //
                        //  Add consecutive comment to group for combined
                        //  wrapping
                        //
                        group.push(next);

                        //
                        //  Mark as processed to prevent duplicate handling
                        //
                        handled.add(next);

                        //
                        //  Update line tracker for next iteration
                        //
                        lastLineNum = next.loc.end.line;

                    }

                    //
                    //  Check if ANY line in group exceeds max width to
                    //  determine if wrapping is needed
                    //
                    let needsWrap = group.some(c => {

                        //
                        //  Get full source line including indentation
                        //
                        let lText = sourceCode.lines[c.loc.start.line - 1];

                        //
                        //  >>  Exit
                        //
                        return lText.length > MAX_WIDTH;

                    });

                    //
                    //  Skip groups that already fit within width limit
                    //
                    if (!needsWrap) {

                        //
                        //  >>  Exit
                        //
                        continue;

                    }

                    //
                    //  Combine all comment text from group into single string
                    //  for rewrapping
                    //
                    let allText = group.map(c => c.value.trim()).join(' ');

                    //
                    //  Apply wrapping algorithm to fit text within max width
                    //
                    let wrapped = wrapText(allText, MAX_WIDTH, indent);

                    //
                    //  Calculate prefix length for wrapped line validation
                    //
                    let prefixLen = indent.length + 4;

                    //
                    //  Check if wrapped version still exceeds max width, which
                    //  happens with long URLs or unbreakable tokens that exceed
                    //  80 characters
                    //
                    let resultStillFails = wrapped.some(w => (prefixLen + w.length) > MAX_WIDTH);

                    //
                    //  Handle edge case where wrapping cannot satisfy the width
                    //  constraint due to long unbreakable content
                    //
                    if (resultStillFails) {

                        //
                        //  Reconstruct current source text for comparison to
                        //  detect if wrapping would change anything
                        //
                        let currentSourceText = group.map(c => sourceCode.lines[c.loc.start.line - 1].trim()).join('\n');

                        //
                        //  Reconstruct what the fixed version would look like
                        //
                        let newSourceText = wrapped.map(l => `${indent}//  ${l}`.trim()).join('\n');

                        //
                        //  Skip reporting if wrapped version is identical to
                        //  current version, preventing infinite loop when
                        //  content cannot be wrapped to satisfy width
                        //  constraint
                        //
                        if (currentSourceText === newSourceText) {

                            //
                            //  >>  Exit
                            //
                            continue;

                        }

                    }

                    //
                    //  Start position for text replacement range
                    //
                    let startRange = group[0].range[0];

                    //
                    //  End position for text replacement range
                    //
                    let endRange = group[group.length - 1].range[1];

                    //
                    //  Format first line of wrapped output
                    //
                    let firstLineRep = `//  ${wrapped[0]}`;

                    //
                    //  Format remaining lines with proper indentation and
                    //  newlines
                    //
                    let restLinesRep = wrapped.slice(1).map(l => `\n${indent}//  ${l}`).join('');

                    //
                    //  Combine first and remaining lines into final replacement
                    //  text
                    //
                    let finalRep = firstLineRep + restLinesRep;

                    //
                    //  Report violation to ESLint with automatic fix that
                    //  replaces the entire comment group with wrapped version
                    //
                    context.report({
                        loc: {
                            start: group[0].loc.start,
                            end: group[group.length - 1].loc.end
                        },
                        message: `Comment block exceeds ${MAX_WIDTH} characters`,
                        fix(fixer) {

                            //
                            //  >>  Exit
                            //
                            return fixer.replaceTextRange(
                                [startRange, endRange],
                                finalRep
                            );

                        }
                    });

                }

            }
        };

    }
};
