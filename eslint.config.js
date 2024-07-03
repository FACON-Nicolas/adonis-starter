import globals from 'globals'
import js from '@eslint/js'
import prettierRecommended from 'eslint-plugin-prettier/recommended'

export default [
  {
    files: ['**/*.js', '**/*.jsx']
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  },
  js.configs.recommended,
  prettierRecommended,
  {
    rules: {
      'no-console': 'warn',
      'prettier/prettier': [
        'warn',
        {
          arrowParens: 'avoid',
          printWidth: 120,
          semicolons: true,
          singleQuote: true,
          trailingComma: 'none'
        }
      ]
    }
  }
]
