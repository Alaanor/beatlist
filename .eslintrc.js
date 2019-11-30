module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'plugin:vue/base',
    'plugin:vue/essential',
    'plugin:vue/strongly-recommended',
    'plugin:vue/recommended',
    'plugin:import/typescript',
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  plugins: [
    'vue',
    '@typescript-eslint',
  ],
  rules: {
    'no-console': 'off',
    'vue/html-closing-bracket-spacing': 'off',
  },
  settings: {
    'import/resolver': {
      node: {
        paths: ['src'],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
};
