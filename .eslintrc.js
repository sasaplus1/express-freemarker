module.exports = {
  env: {
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:node/recommended',
    'plugin:prettier/recommended'
  ],
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
