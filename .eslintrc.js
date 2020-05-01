module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    "airbnb-base",
    "plugin:vue/base",
    "plugin:vue/essential",
    "plugin:vue/strongly-recommended",
    "plugin:vue/recommended",
    "plugin:import/typescript",
    "plugin:jest/all",
    "prettier",
    "prettier/@typescript-eslint",
    "prettier/vue",
  ],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parserOptions: {
    ecmaVersion: 2019,
    parser: "@typescript-eslint/parser",
    sourceType: "module",
  },
  plugins: ["vue", "jest", "@typescript-eslint", "vuetify", "prettier"],
  rules: {
    "prettier/prettier": "error",
    "no-console": "off",
    "vue/html-closing-bracket-spacing": "off",
    "no-underscore-dangle": "off",
    "@typescript-eslint/no-unused-vars": "error",
    "no-unused-vars": "off",
    "vue/no-v-html": "off",
    "jest/no-hooks": "off",
    "no-param-reassign": "off",
    "no-restricted-syntax": [
      "error",
      "ForInStatement",
      "LabeledStatement",
      "WithStatement",
    ],
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        ts: "never",
      },
    ],
    "vuetify/no-deprecated-classes": "error",
    "vuetify/grid-unknown-attributes": "error",
    "vuetify/no-legacy-grid": "error",
  },
  settings: {
    "import/resolver": {
      node: {
        paths: ["src"],
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
      webpack: {
        config: "./node_modules/@vue/cli-service/webpack.config.js",
      },
    },
  },
};
