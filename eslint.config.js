import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import ts from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

// 统一 flat config
/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  // 忽略文件
  {
    ignores: [
      'lib/**',
      'logs/**',
      'dist/**',
      'node_modules/**',
      '**/*.css',
      '**/*.jpg',
      '**/*.png',
      '**/*.yaml',
      '**/*.yml',
      '.tmp/**',
      'frontend/dist/**',
      '*.config.js',
      '*.config.ts',
      '.puppeteerrc.cjs',
      'src/env.d.ts'
    ]
  },
  // TypeScript 声明文件配置
  {
    files: ['**/*.d.ts'],
    rules: {
      'spaced-comment': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off'
    }
  },
  // 基础 JS 推荐
  js.configs.recommended,
  // TS 推荐 (包含 parser 与插件)
  ...ts.configs.recommended,
  // 添加更严格的TypeScript规则
  ...ts.configs.strict,
  // TypeScript 文件配置
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: ts.parser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  // React 规则
  {
    plugins: { react },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      // 关闭prop-types检查，因为使用TypeScript
      'react/prop-types': 'off',
      'react/display-name': 'off',
      'react/jsx-key': 'error',
      'react/jsx-no-duplicate-props': 'error',
      'react/jsx-no-undef': 'error',
      'react/no-array-index-key': 'warn',
      'react/no-danger': 'warn',
      'react/no-deprecated': 'error',
      'react/no-direct-mutation-state': 'error',
      'react/no-find-dom-node': 'error',
      'react/no-is-mounted': 'error',
      'react/no-render-return-value': 'error',
      'react/no-string-refs': 'error',
      'react/no-unescaped-entities': 'error',
      'react/no-unknown-property': 'error',
      'react/no-unsafe': 'warn',
      'react/self-closing-comp': 'error'
    },
    settings: {
      react: { version: 'detect' }
    }
  },
  // 关闭与 Prettier 冲突的格式化规则
  prettier,
  // 主要配置
  {
    languageOptions: {
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021
      }
    },
    rules: {
      // TypeScript 相关规则
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        }
      ],
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-var-requires': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-empty-function': 'warn',
      '@typescript-eslint/no-inferrable-types': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/require-await': 'error',

      // 代码质量规则
      'prefer-const': ['error', { destructuring: 'all' }],
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-unused-expressions': 'error',
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-alert': 'warn',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-script-url': 'error',
      'no-self-compare': 'error',
      'no-sequences': 'error',
      'no-throw-literal': 'error',
      'no-unmodified-loop-condition': 'error',
      'no-useless-call': 'error',
      'no-useless-concat': 'error',
      'no-useless-return': 'error',
      'prefer-promise-reject-errors': 'error',
      'require-await': 'error',
      'yoda': 'error',

      // 最佳实践
      'eqeqeq': ['error', 'always'],
      'curly': ['error', 'all'],
      'no-multi-spaces': 'error',
      'no-trailing-spaces': 'error',
      'eol-last': 'error',
      'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1 }],
      'comma-dangle': ['error', 'never'],
      'semi': ['error', 'always'],
      'quotes': ['error', 'single', { avoidEscape: true }],
      'indent': ['error', 2],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'comma-spacing': ['error', { before: false, after: true }],
      'key-spacing': ['error', { beforeColon: false, afterColon: true }],
      'space-before-blocks': 'error',
      'space-in-parens': ['error', 'never'],
      'space-infix-ops': 'error',
      'keyword-spacing': 'error',
      'arrow-spacing': 'error',
      'block-spacing': 'error',
      'brace-style': ['error', '1tbs', { allowSingleLine: true }],
      'camelcase': ['error', { properties: 'never' }],
      'comma-style': ['error', 'last'],
      'func-call-spacing': ['error', 'never'],
      'function-paren-newline': ['error', 'multiline'],
      'implicit-arrow-linebreak': ['error', 'beside'],
      'max-len': ['error', { code: 100, ignoreUrls: true, ignoreStrings: true }],
      'no-mixed-operators': 'error',
      'no-tabs': 'error',
      'operator-linebreak': ['error', 'before'],
      'padded-blocks': ['error', 'never'],
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'return' },
        { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
        { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] }
      ],
      'quote-props': ['error', 'as-needed'],
      'space-before-function-paren': ['error', 'never'],
      'space-unary-ops': 'error',
      'spaced-comment': ['error', 'always', { 
        line: { 
          markers: ['/'], 
          exceptions: ['///'] 
        } 
      }],
      'template-tag-spacing': 'error'
    }
  }
];
