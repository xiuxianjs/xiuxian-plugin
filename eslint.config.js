import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import globals from 'globals'
import pluginReact from 'eslint-plugin-react'
import typescriptEslint from 'typescript-eslint'
/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    languageOptions: {
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    plugins: {
      prettier: prettier,
      react: pluginReact.configs.recommended
    }
  },
  js.configs.recommended,
  ...typescriptEslint.configs.recommended
]
