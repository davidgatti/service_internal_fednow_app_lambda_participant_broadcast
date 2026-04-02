import js from '@eslint/js';
import markdown from '@eslint/markdown';
import rulesDirPlugin from 'eslint-plugin-rulesdir';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

//
//  Get the directory of this config file
//
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//
//  Set the rules directory to absolute path
//
rulesDirPlugin.RULES_DIR = join(__dirname, '.eslint', 'custom', 'rules');

//
// Base configuration for all JavaScript files
//

let base_config = {
    languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
        globals: {
          console: 'readonly',
          process: 'readonly',
          Buffer: 'readonly',
          fetch: 'readonly',
          __dirname: 'readonly',
          __filename: 'readonly',
          exports: 'writable',
          module: 'writable',
          require: 'readonly',
          global: 'readonly',
          setTimeout: 'readonly',
          clearTimeout: 'readonly',
          setInterval: 'readonly',
          clearInterval: 'readonly',
          setImmediate: 'readonly',
          clearImmediate: 'readonly',
          describe: 'readonly',
          it: 'readonly',
          test: 'readonly',
          expect: 'readonly',
          beforeEach: 'readonly',
          afterEach: 'readonly',
          beforeAll: 'readonly',
          afterAll: 'readonly',
          jest: 'readonly',
          URL: 'readonly',
          URLSearchParams: 'readonly',
          AbortController: 'readonly'
        }
    },
  plugins: {
    rulesdir: rulesDirPlugin
  },
    rules: {
      //
      // Custom rules
      //

      'rulesdir/wrap-comments': 'error',
      'rulesdir/sandwich-comments': 'error',
      'rulesdir/no-block-comments': 'error',
      'rulesdir/no-const': 'error',
      'rulesdir/no-else': 'error',
      'rulesdir/no-underscore-declarations': 'error',
      'rulesdir/no-logical-fallback': 'error',
      'rulesdir/require-comment-blocks': 'error',

      //
      // Ternary expressions
      //

      'no-ternary': 'error',
      'rulesdir/no-trailing-spaces': 'error',

      //
      // Code quality rules - Bug prevention
      //

      curly: 'error',
      eqeqeq: 'error',
      'no-throw-literal': 'error',
      semi: ['error', 'always'],
      'no-unused-vars': ['error', { args: 'after-used', ignoreRestSiblings: true, varsIgnorePattern: '^_', argsIgnorePattern: '^_' }],
      'no-console': 'off',

      //
      // Async/Promise errors
      //

      'no-async-promise-executor': 'error',
      'no-await-in-loop': 'off',
      'no-promise-executor-return': 'off',
      'require-atomic-updates': 'off',

      //
      // Common logic errors
      //

      'no-constant-condition': 'error',
      'no-dupe-else-if': 'error',
      'no-duplicate-case': 'error',
      'no-unreachable': 'error',
      'no-unreachable-loop': 'error',
      'no-unsafe-negation': 'error',
      'use-isnan': 'error',
      'valid-typeof': 'error',

      //
      // Variable declaration errors
      //

      'no-redeclare': 'error',
      'no-shadow': 'off',
      'no-undef': 'error',
      'no-use-before-define': ['error', { functions: false, classes: true, variables: true }],

      //
      // Function errors
      //

      'no-empty-function': 'off',
      'no-loop-func': 'error',
      'no-return-await': 'off',

      //
      // Error handling - try/catch enforcement
      //

      'no-empty': ['error', { allowEmptyCatch: false }],
      'no-useless-catch': 'error',
      'prefer-promise-reject-errors': 'error',

      //
      // Object/Array errors
      //

      'no-prototype-builtins': 'error',
      'no-self-assign': 'error',
      'no-self-compare': 'error',

      //
      // Error handling
      //

      'no-ex-assign': 'error',
      'no-loss-of-precision': 'error',

      //
      // Security
      //

      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',

      //
      // Formatting rules
      //

      indent: [
        'error',
        4,
        {
          SwitchCase: 1,
          VariableDeclarator: 1,
          outerIIFEBody: 1,
          FunctionDeclaration: { parameters: 1, body: 1 },
          FunctionExpression: { parameters: 1, body: 1 },
          CallExpression: { arguments: 1 },
          ArrayExpression: 1,
          ObjectExpression: 1,
          ImportDeclaration: 1,
          flatTernaryExpressions: false,
          ignoreComments: false
        }
      ],
      quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1 }],

      //
      // Style Enforcement
      //

      'prefer-const': 'off',
      'no-var': 'error',
      'camelcase': 'off',
      'no-trailing-spaces': 'error',
      'comma-dangle': ['error', 'never'],
      'comma-spacing': ['error', { before: false, after: true }],
      'key-spacing': ['error', { beforeColon: false, afterColon: true }],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'space-before-blocks': 'error',
      'space-in-parens': ['error', 'never'],
      'space-infix-ops': 'error',
      'keyword-spacing': ['error', { before: true, after: true }],
      'brace-style': ['error', '1tbs', { allowSingleLine: true }],
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'return' },
        { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
        { blankLine: 'always', prev: '*', next: ['const', 'let', 'var'] },
        { blankLine: 'always', prev: 'expression', next: 'expression' },
        { blankLine: 'any', prev: 'cjs-import', next: 'cjs-import' },
        {
          blankLine: 'always',
          prev: '*',
          next: 'block-like'
        },
        {
          blankLine: 'always',
          prev: 'block-like',
          next: '*'
        }
      ],
      'padded-blocks': ['error', 'always'],
      'max-len': [
        'warn',
        {
          code: 200,
          comments: 80,
          tabWidth: 4,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreTrailingComments: false
        }
      ],

      //
      // Additional strict formatting rules
      //

      'no-else-return': ['error', { allowElseIf: false }],
      'no-lonely-if': 'error',
      'spaced-comment': ['error', 'always', {
        line: { markers: ['/'], exceptions: ['/'] },
        block: { balanced: true }
      }]
    }
};

export default [
  {
    ignores: [
      '**/node_modules/**',
      '.vscode-test/**',
      'out/**',
      '.releases/**',
      '**/*.template',
      '**/build/**',
      '**/dist/**',
      'coverage/**',
      '**/.svelte-kit/**',
      '**/.db/**',
      '.eslint/custom/tests/**',
      'ecosystem.*.config.js'
    ]
  },

  //
  // JavaScript files - regular linting
  //

  {
    files: ['**/*.js'],
    ...base_config
  },

  //
  // Markdown files - lint markdown syntax
  //

  {
      files: ['**/*.md'],
      plugins: {
        markdown
      },
      language: 'markdown/gfm',
      rules: {
      'markdown/fenced-code-language': 'off',
      'markdown/no-html': 'off'
    }
  },

  //
  // JavaScript code blocks in markdown - apply full JavaScript linting
  //

  {
      files: ['**/*.md/*.js'],
      ...markdown.configs.processor,
      ...base_config
    }
];
