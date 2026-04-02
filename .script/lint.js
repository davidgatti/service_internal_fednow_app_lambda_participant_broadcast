#!/usr/bin/env node

//
//  Lint Runner — Timeline UI
//
//  Executes all lint checks in sequence, printing a single-line timeline
//  entry per step as it completes. All underlying command output is
//  suppressed; the timeline IS the output. Stops on first failure with
//  a short error extract and rerun command.
//
let { spawnSync } = require('child_process');

//
//  ─────────────────────────────────────────────
//  PUBLIC — Timeline UI helpers
//  ─────────────────────────────────────────────

//
//  Format a duration in milliseconds to a human-readable string.
//  Uses one decimal place for clean alignment.
//
function duration_format(ms) {

    //
    //  Convert milliseconds to seconds with one decimal
    //
    return (ms / 1000).toFixed(1) + 's';

}

//
//  Print a single timeline entry with dot leaders for alignment.
//  icon is the leading symbol, label is the step name,
//  suffix is the trailing text (duration or status).
//
function timeline_print(icon, label, suffix, dot_column) {

    //
    //  Calculate number of dots needed to reach the alignment column.
    //  Minimum 2 dots so the leader is always visible.
    //
    let dots_needed = dot_column - label.length;

    //
    //  Clamp to minimum of 2 dots
    //
    if (dots_needed < 2) {

        //
        //  Ensure at least 2 dots for visual continuity
        //
        dots_needed = 2;

    }

    //
    //  Build the dot leader string with spaces on each side
    //
    let dots = ' ' + '.'.repeat(dots_needed) + ' ';

    //
    //  Print the formatted line
    //
    console.log(`  ${icon}  ${label}${dots}${suffix}`);

}

//
//  Extract a useful error message from combined lint output.
//  Returns the first non-empty, non-deprecation line from stderr,
//  or first non-empty stdout line as fallback.
//
function error_extract(stdout, stderr) {

    //
    //  Try stderr first — most tools report errors there
    //
    if (stderr) {

        //
        //  Split stderr and find first meaningful line
        //
        let stderr_lines = stderr.split('\n');

        //
        //  Scan for first non-empty line
        //
        for (let line of stderr_lines) {

            //
            //  Trim and check for content
            //
            let trimmed = line.trim();

            //
            //  Skip deprecation warnings — they are noise, not the real error
            //
            if (trimmed && !trimmed.toLowerCase().includes('deprecated')) {

                //
                //  Found a meaningful error line
                //
                return trimmed;

            }

        }

    }

    //
    //  Fallback to stdout — some linters report errors there
    //
    if (stdout) {

        //
        //  Split stdout and find first meaningful line
        //
        let stdout_lines = stdout.split('\n');

        //
        //  Scan for first non-empty line
        //
        for (let line of stdout_lines) {

            //
            //  Trim and check for content
            //
            let trimmed = line.trim();

            //
            //  Return first non-empty line
            //
            if (trimmed) {

                //
                //  Found a meaningful output line
                //
                return trimmed;

            }

        }

    }

    //
    //  Last resort — nothing useful found in output
    //
    return 'Unknown error (no output captured)';

}

//
//  ─────────────────────────────────────────────
//  PUBLIC — Lint step definitions
//  ─────────────────────────────────────────────

//
//  Lint step definitions with their npm script commands. Order matches the
//  original chained npm run lint command. Commands reference package.json
//  scripts as single source of truth.
//
let steps = [
    { name: 'Lint: ESLint',
        command: 'npm run lint:eslint' },
    { name: 'Lint: Knip',
        command: 'npm run lint:knip' },
    { name: 'Lint: Markdown',
        command: 'npm run lint:md' }
];

//
//  ─────────────────────────────────────────────
//  PUBLIC — Main execution
//  ─────────────────────────────────────────────

//
//  Calculate dot leader alignment column from the longest step name.
//  All dots align to the same column for a visually clean timeline.
//
let dot_column = 0;

//
//  Find the longest step name to determine alignment
//
for (let step of steps) {

    //
    //  Track the maximum name length
    //
    if (step.name.length > dot_column) {

        //
        //  Update with longer name
        //
        dot_column = step.name.length;

    }

}

//
//  Add padding after the longest name so dots do not start immediately
//
dot_column += 4;

//
//  Print header
//
console.log('\n\u{1F50D} Lint Runner\n');

//
//  Record wall-clock start time for total duration reporting
//
let run_start_time = Date.now();

//
//  Track overall pass/fail for exit code
//
let all_passed = true;

//
//  Execute each lint step sequentially, printing one timeline line per step
//
for (let step of steps) {

    //
    //  Timestamp when step execution starts
    //
    let start = Date.now();

    //
    //  Execute lint command using spawnSync.
    //  stdio:pipe suppresses all output — the timeline is the only output.
    //
    let result = spawnSync(step.command, {
        shell: true,
        encoding: 'utf-8',
        stdio: 'pipe',
        env: process.env,
        maxBuffer: 10 * 1024 * 1024
    });

    //
    //  Calculate elapsed time for this step
    //
    let elapsed = Date.now() - start;

    //
    //  Check if step passed
    //
    if (result.status === 0) {

        //
        //  Step passed — print checkmark with duration
        //
        timeline_print('\u2713', step.name, duration_format(elapsed), dot_column);

        //
        //  Continue to next lint step
        //
        continue;

    }

    //
    //  Step failed — print X mark, error extract, and rerun command
    //
    timeline_print('\u2717', step.name, duration_format(elapsed), dot_column);

    //
    //  Extract and display the most relevant error lines
    //
    let error = error_extract(result.stdout, result.stderr);

    //
    //  Print error block with indentation matching the timeline
    //
    console.log('');

    //
    //  Display the extracted error
    //
    console.log('  ' + error.split('\n').join('\n  '));

    //
    //  Print rerun command so the developer can see full output
    //
    console.log('');

    //
    //  Display the rerun command
    //
    console.log('  \u2192 Rerun: ' + step.command);

    //
    //  Trailing newline after error block
    //
    console.log('');

    //
    //  Mark the run as failed and stop immediately
    //
    all_passed = false;

    //
    //  Stop on first failure
    //
    break;

}

//
//  Blank line separator before the total
//
console.log('');

//
//  Print total wall-clock elapsed time
//
console.log('  Total: ' + duration_format(Date.now() - run_start_time));

//
//  Trailing newline for clean terminal output
//
console.log('');

//
//  Exit with appropriate code — 0 for all pass, 1 for any failure
//
if (!all_passed) {

    //
    //  At least one step failed
    //
    process.exit(1);

}
