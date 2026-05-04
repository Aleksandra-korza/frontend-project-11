import js from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import globals from 'globals'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: {
      js,
      '@stylistic': stylistic,
    },
    extends: ['js/recommended'],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      '@stylistic/semi': ['error', 'never'],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/eol-last': ['error', 'always'],
      '@stylistic/no-trailing-spaces': 'error',
      '@stylistic/arrow-parens': ['error', 'as-needed', {
        requireForBlockBody: true,
      }],
    },
  },
])
