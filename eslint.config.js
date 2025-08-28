import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import ts from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

/**
 * ESLint 配置文件
 * 
 * 使用 ESLint Flat Config 格式
 * 包含 TypeScript、React 和代码质量规则
 * 
 * 特殊处理：
 * - 禁用了 no-mixed-operators 规则以避免与格式化工具冲突
 * - 配置了 Prettier 兼容性
 * - 针对修仙插件项目优化了规则
 */
/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  // 忽略不需要检查的文件和目录
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
  // TypeScript 声明文件配置 - 放宽注释规则
  {
    files: ['**/*.d.ts'],
    rules: {
      'spaced-comment': 'off',
    }
  },
  // 基础 JavaScript 推荐规则
  js.configs.recommended,
  // TypeScript 推荐规则 (包含 parser 与插件)
  ...ts.configs.recommended,
  // 添加更严格的 TypeScript 规则
  ...ts.configs.strict,
  // TypeScript 文件配置 - 指定解析器和项目配置
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
  // React 相关规则配置
  {
    plugins: { react },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      // 关闭 prop-types 检查，因为使用 TypeScript 类型系统
      'react/prop-types': 'off',
      'react/display-name': 'off',
      'react/jsx-key': 'error',
      'react/jsx-no-duplicate-props': 'error',
      'react/jsx-no-undef': 'error',
      'react/no-array-index-key': 'off',
      'react/no-danger': 'off',
      'react/no-deprecated': 'error',
      'react/no-direct-mutation-state': 'error',
      'react/no-find-dom-node': 'error',
      'react/no-is-mounted': 'error',
      'react/no-render-return-value': 'error',
      'react/no-string-refs': 'error',
      'react/no-unescaped-entities': 'error',
      'react/no-unknown-property': 'error',
      'react/no-unsafe': 'off',
      'react/self-closing-comp': 'error'
    },
    settings: {
      react: { version: 'detect' }
    }
  },
  // 关闭与 Prettier 冲突的格式化规则
  prettier,
  // 主要代码质量规则配置
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
      // ===== TypeScript 相关规则 =====
      // 未使用变量检查 - 忽略以下划线开头的变量
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        }
      ],
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-var-requires': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-inferrable-types': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/require-await': 'error',

      // ===== 代码质量规则 =====
      // 优先使用 const - 解构时也要求使用 const
      'prefer-const': ['error', { destructuring: 'all' }],
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-unused-expressions': 'error',
      'no-console': 'off',
      'no-debugger': 'error',
      'no-alert': 'off',
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

      // ===== 最佳实践规则 =====
      // 严格相等比较 - 禁止使用 === 和 !=
      'eqeqeq': ['error', 'always'],
      'curly': ['error', 'all'],
      'no-multi-spaces': 'error',
      'no-trailing-spaces': 'error',
      'eol-last': 'error',
      'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1 }],
      'comma-dangle': ['error', 'never'],
      'semi': ['error', 'always'],
      'quotes': ['error', 'single', { avoidEscape: true }],
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
      'function-paren-newline': 'off',
      'implicit-arrow-linebreak': ['error', 'beside'],
      // 最大行长度限制 - 100字符，忽略URL和字符串
      'max-len': ['error', { code: 100, ignoreUrls: true, ignoreStrings: true }],
      
      // 禁用混合运算符检查 - 与自动格式化工具冲突
      'no-mixed-operators': 'off',
      // 禁止使用制表符，统一使用空格
      'no-tabs': 'error',
      // 运算符换行规则 - 运算符放在行首
      'operator-linebreak': ['error', 'before'],
      // 禁止块级代码前后有空行
      'padded-blocks': ['error', 'never'],
      // 语句间空行规则
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'return' },
        { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
        { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] }
      ],
      // 对象属性引号规则 - 只在必要时使用引号
      'quote-props': ['error', 'as-needed'],
      // 函数括号前空格规则 - 禁止空格
      'space-before-function-paren': 'off',
      // 一元运算符空格规则
      'space-unary-ops': 'error',
      // 注释空格规则 - 要求空格，但允许特殊标记
      'spaced-comment': ['error', 'always', { 
        line: { 
          markers: ['/'], 
          exceptions: ['///'] 
        } 
      }],
      // 模板标签间距规则
      'template-tag-spacing': 'error'
    }
  }
];
