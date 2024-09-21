// @ts-check
/* eslint-disable filename-export/match-default-export */

import {fixupPluginRules} from '@eslint/compat';
import eslint from '@eslint/js';
import pluginTypescript from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import pluginFilenameExport from 'eslint-plugin-filename-export';
import pluginImport from 'eslint-plugin-import';
import pluginNoRelativeImportPaths from 'eslint-plugin-no-relative-import-paths';
import pluginPrettier from 'eslint-plugin-prettier';
import configPrettierRecommended from 'eslint-plugin-prettier/recommended';
import configReactJSXRuntime from 'eslint-plugin-react/configs/jsx-runtime.js';
import configReactRecommended from 'eslint-plugin-react/configs/recommended.js';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginReactRefresh from 'eslint-plugin-react-refresh';
import tailwindPlugin from 'eslint-plugin-tailwindcss';
import eslintTS from 'typescript-eslint';

const eslint_config = [
  eslint.configs.recommended,
  ...eslintTS.configs.recommended,
  ...eslintTS.configs.stylistic,
  ...tailwindPlugin.configs['flat/recommended'],
  configReactRecommended,
  configReactJSXRuntime,
  configPrettierRecommended,
  {
    files: ['**/*.{js,ts,jsx,tsx}'],
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {modules: true},
        ecmaVersion: 'latest',
        project: './tsconfig.linter.json',
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    plugins: {
      import: pluginImport,
      prettier: pluginPrettier,
      '@typescript-eslint': pluginTypescript,
      'react-refresh': pluginReactRefresh,
      'react-hooks': fixupPluginRules(pluginReactHooks),
      'filename-export': pluginFilenameExport,
      'no-relative-import-paths': pluginNoRelativeImportPaths,
    },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      /**
       * Allow empty arrow functions `() => {}`, while keeping other empty functions restricted
       * @see https://eslint.org/docs/latest/rules/no-empty-function#allow-arrowfunctions
       */
      '@typescript-eslint/no-empty-function': ['error', {allow: ['arrowFunctions']}],
      '@typescript-eslint/ban-ts-comment': 1,
      'no-const-assign': 'error',
      /** Restrict imports from devDependencies since they are not included in library build. peerDependencies are ok */
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: false,
          peerDependencies: true,
        },
      ],
      /**
       * Enforce import order with empty lines between import group
       * @see https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md
       */
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
          pathGroups: [
            {
              pattern: 'toolbar/**',
              group: 'internal',
            },
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc' /* sort in ascending order. Options: ['ignore', 'asc', 'desc'] */,
            caseInsensitive: true /* ignore case. Options: [true, false] */,
          },
        },
      ],
      /**
       * When there is only a single export from a module, prefer using default export over named export.
       * @see https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/prefer-default-export.md
       */
      'import/prefer-default-export': [
        'error',
        {
          target: 'single',
        },
      ],
      /**
       * Prevent exporting anonymous functions, classes, and objects.
       * @see https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-anonymous-default-export.md
       */
      'import/no-anonymous-default-export': [
        'error',
        {
          allowArray: false,
          allowArrowFunction: false,
          allowAnonymousClass: false,
          allowAnonymousFunction: false,
          allowCallExpression: true,
          allowLiteral: false,
          allowObject: false,
        },
      ],
      /**
       * Enforces that filenames match the name of the default export.
       * @see https://github.com/ekwoka/eslint-plugin-filename-export?tab=readme-ov-file#rules
       */
      'filename-export/match-default-export': [
        'error',
        {
          casing: 'strict',
          stripextra: false,
        },
      ],
      /**
       * Reports use of an exported name as the locally imported name of a default export.
       * https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-named-as-default.md
       *
       * TODO: need to update the plugin once it suppots ESLint v9
       * Depends on https://github.com/import-js/eslint-plugin-import/pull/2996
       */
      // 'import/no-named-as-default': 'error',
      /**
       * Disallow combined module and type imports like this `import React, {FC} from 'react'`.
       * Eslint will try to split into type and module imports instead
       * @see https://typescript-eslint.io/rules/consistent-type-imports/
       */
      '@typescript-eslint/consistent-type-imports': ['error', {}],
      /**
       * Enforce absolute imports within src/lib/*
       * https://www.npmjs.com/package/eslint-plugin-no-relative-import-paths
       */
      'no-relative-import-paths/no-relative-import-paths': [
        'error',
        {
          rootDir: 'src/lib',
          prefix: 'toolbar',
        },
      ],
      'import/no-cycle': 'error',
      'prettier/prettier': [
        'error',
        {
          semi: true,
          singleQuote: true,
          jsxSingleQuote: false,
          trailingComma: 'es5',
          bracketSpacing: false,
          jsxBracketSameLine: true,
          arrowParens: 'avoid',
        },
      ],
      /* Required by vite */
      'react-refresh/only-export-components': ['warn', {allowConstantExport: true}],
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      /**
       * Allow unused variables with names stating with '_'
       * @see https://eslint.org/docs/latest/rules/no-unused-vars
       * @see https://typescript-eslint.io/rules/no-unused-vars/
       */
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          ignoreRestSiblings: true,
          args: 'after-used',
        },
      ],
    },
  },
  /* Allow devDependencies imports for tests and config files */
  {
    files: [
      '**/*.spec.*',
      '**/testUtils/*.{js,jsx,ts,tsx}',
      '*/*.{js,jsx,ts,tsx}',
      '**/setupTests.ts',
      '**/*.stories.*',
      '*.config.{js,ts}',
    ],
    plugins: {
      import: pluginImport,
    },
    rules: {
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: true,
          peerDependencies: true,
        },
      ],
    },
  },
  /* Disable `environment` directory imports for library files */
  {
    files: ['src/lib/**/*.{js,jsx,ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/env/**'],
              message: 'Imports from environment directory are forbidden in the library files.',
            },
          ],
        },
      ],
    },
  },
  /* Disable `template` directory imports for all files */
  {
    files: ['src/**/*.{js,jsx,ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/templates/**'],
              message: 'Imports from templates directory are forbidden.',
            },
          ],
        },
      ],
    },
  },
  /**
   * Disable rules of hooks for story files in order to have better story code display.
   * @see TemplateName.stories.tsx
   */
  {
    files: ['**/*.stories.*'],
    rules: {
      'react-hooks/rules-of-hooks': 'off',
    },
  },
  {
    ignores: ['**/*.snap', 'dist/**', 'mock/**', '*.config.{js,ts}'],
  },
];

export default eslint_config;
