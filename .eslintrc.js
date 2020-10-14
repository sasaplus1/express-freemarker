module.exports = {
  env: {
    node: true
  },
  extends: ['eslint:recommended', 'plugin:node/recommended', 'prettier'],
  overrides: [
    {
      env: {
        mocha: true
      },
      files: ['test/**/*.js']
    }
  ],
  parserOptions: {
    ecmaVersion: 3
  },
  root: true
};
