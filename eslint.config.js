import eslintPluginAstro from 'eslint-plugin-astro';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default [
  // Astro files
  ...eslintPluginAstro.configs.recommended,
  
  // TypeScript files
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },

  // `status: draft` only unpublishes a story if every surface reads the
  // collection through the same gate. See src/utils/stories.ts.
  {
    files: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.astro'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'astro:content',
              importNames: ['getCollection'],
              message:
                'Import getPublishedStories from @utils/stories instead — getCollection bypasses the draft gate.',
            },
          ],
        },
      ],
    },
  },

  // The one file allowed to reach the collection directly.
  {
    files: ['src/utils/stories.ts'],
    rules: {
      'no-restricted-imports': 'off',
    },
  },

  // Accessibility for React/JSX
  {
    files: ['**/*.jsx', '**/*.tsx', '**/*.astro'],
    plugins: {
      'jsx-a11y': jsxA11y,
    },
    rules: {
      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/aria-props': 'warn',
      'jsx-a11y/aria-role': 'warn',
    },
  },

  // Global ignores
  {
    ignores: [
      'dist/',
      'node_modules/',
      '.astro/',
      '.github/',
      'public/',
      // Read-only reference exports live here; linting them floods the report.
      'tmp/',
      '*.config.js',
      '*.config.mjs',
    ],
  },
];
