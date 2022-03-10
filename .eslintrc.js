module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    'no-console': process.env.VUE_APP_ENV !== 'development' ? 'warn' : 'off',
    'no-debugger': process.env.VUE_APP_ENV !== 'development' ? 'warn' : 'off',
  },
};
