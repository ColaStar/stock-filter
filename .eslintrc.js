module.exports = {
    {
        'root': true,
        'env': {
          'node': true,
          'browser': true,
          'es6': true
        },
        'parserOptions': {
          'ecmaVersion': 12,
          'sourceType': 'module'
        },
        'plugins': [],
        'extends': [
          'eslint:recommended',
          'plugin:prettier/recommended',
        ],
        'globals': {},
        'rules': {
          'prettier/prettier': 'error'
        },
        'overrides': [{
          'files': ['*-test.js'],
          'excludedFiles': '',
          'rules': {}
        }]
      }
};