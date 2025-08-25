import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import ts from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

// 统一 flat config
/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  // 忽略文件（迁移自 .eslintignore）
  {
    ignores: [
      'lib/**',
      'logs/**',
      '**/*.css',
      '**/*.jpg',
      '**/*.png',
      '**/*.yaml',
      '.tmp/**',
      'dist/**',
      'node_modules/**'
    ]
  },
  // 基础 JS 推荐
  js.configs.recommended,
  // TS 推荐 (包含 parser 与插件)
  ...ts.configs.recommended,
  // 添加更严格的TypeScript规则
  ...ts.configs.strict,
  // React 规则（若未来需要可再细化）
  {
    plugins: { react },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      // 关闭prop-types检查，因为使用TypeScript
      'react/prop-types': 'off',
      'react/display-name': 'off'
    },
    settings: {
      react: { version: 'detect' }
    }
  },
  // 关闭与 Prettier 冲突的格式化规则
  prettier,
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
      // 保持变量声明优化
      'prefer-const': ['error', { destructuring: 'all' }],
      // 未使用变量：允许以下划线开头占位
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        }
      ],
      // 空代码块：避免无意义的空块
      'no-empty': ['error', { allowEmptyCatch: true }],
      // 允许非空断言，但建议谨慎使用
      '@typescript-eslint/no-non-null-assertion': 'warn',
      // 允许any类型，但建议指定具体类型
      '@typescript-eslint/no-explicit-any': 'warn',
      // 自动修复相关规则
      'no-trailing-spaces': 'error',
      'eol-last': 'error',
      'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1 }],
      'comma-dangle': ['error', 'never'],
      semi: ['error', 'always'],
      quotes: ['error', 'single', { avoidEscape: true }],
      indent: ['error', 2],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'comma-spacing': ['error', { before: false, after: true }],
      'key-spacing': ['error', { beforeColon: false, afterColon: true }],
      'space-before-blocks': 'error',
      'space-before-function-paren': ['error', 'always'],
      'space-in-parens': ['error', 'never'],
      'space-infix-ops': 'error',
      'keyword-spacing': 'error'
    }
  }
];
