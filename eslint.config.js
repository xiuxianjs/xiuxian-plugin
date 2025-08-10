import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import ts from 'typescript-eslint'
import prettier from 'eslint-config-prettier'

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
      '.tmp/**'
    ]
  },
  // 基础 JS 推荐
  js.configs.recommended,
  // TS 推荐 (包含 parser 与插件)
  ...ts.configs.recommended,
  // React 规则（若未来需要可再细化）
  {
    plugins: { react },
    rules: {
      ...react.configs.recommended.rules,
      // 已使用 TypeScript 进行类型标注，关闭重复/噪音校验
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
        ...globals.node
      }
    },
    rules: {
      // 保持变量声明优化
      'prefer-const': ['error', { destructuring: 'all' }],
      // 全局禁止显式 any，允许以 _any 变量名形式的临时迁移占位
      '@typescript-eslint/no-explicit-any': [
        'error',
        { ignoreRestArgs: false }
      ],
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
      'no-empty': ['error', { allowEmptyCatch: true }]
    }
  }
  // 针对已治理的核心类型/工具文件收紧 any 约束，形成“渐进式收口”策略
  // 若某些旧逻辑仍需 any，可在对应文件头部添加 eslint-disable-next-line 注释（限局部）
]
