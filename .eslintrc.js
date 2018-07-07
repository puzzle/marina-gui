let rules = require('eslint-config-airbnb');

rules.globals = rules.globals || {};
rules.env = rules.env || {};
rules.rules = rules.rules || {};

rules.env.browser = true;

rules.globals.describe = false;
rules.globals.expect = false;
rules.globals.it = false;
rules.globals.jest = false;

rules.rules['no-underscore-dangle'] = 'off';
rules.rules['react/prop-types'] = 'off';
rules.rules['react/no-array-index-key'] = 'off';
rules.rules['react/prefer-stateless-function'] = 'off';
rules.rules['object-curly-newline'] = 'off';
rules.rules['function-paren-newline'] = 'off';
rules.rules['no-console'] = 'off';
rules.rules['import/prefer-default-export'] = 'off';
rules.rules['no-return-assign'] = ['error', 'except-parens'];
rules.rules['no-use-before-define'] = ['warn', { variables: true, functions: false, classes: true }];
rules.rules['one-var'] = 'off';
rules.rules['max-len'] = ['warn', 140];
rules.rules['no-param-reassign'] = ['error', { props: false }];
rules.rules['no-plusplus'] = ['error', { allowForLoopAfterthoughts: true }];
rules.rules['indent'] = ['error', 2, {
  FunctionDeclaration: { parameters: 'first' },
  SwitchCase: 1
}];
rules.rules['jsx-a11y/anchor-is-valid'] = [ "error", {
  "components": [ "Link" ],
  "specialLink": [ "to" ]
}];

rules.overrides = [{
  'files': ['src/**/*.js'],
}];

module.exports = rules;
