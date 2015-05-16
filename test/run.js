var specify = require('specify-core');
var reporter = require('specify-reporter-spec')();

var suites = [
  require('./specs/core.js')
];

specify.runWithDefaults(suites, reporter);
