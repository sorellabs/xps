// # module: xps.utils
//
// Contains common utilities.

'use strict';

// -- Dependencies -----------------------------------------------------
var Task    = require('data.task');
var exec    = require('child_process').exec;
var compose = require('core.lambda').compose;
var unary   = require('core.arity').unary;

// -- Helpers and aliases ----------------------------------------------
var escapeArg = JSON.stringify;


// -- Implementation ---------------------------------------------------

// ### function: shell(command, args)
//
// Runs a process and returns the result.
//
// @type: (String, [String]) -> Task(Error, { output: String, error: String })
exports.shell = shell;
function shell(cmd, args) {
  var command = cmd + ' ' + args.map(unary(compose(escapeArg)(String))).join(' ');
  return new Task(function(reject, resolve) {
    exec(command, function(error, stdout, stderr) {
      if (error)  reject(error);
      else        resolve({ output: stdout, error: stderr });
    });
  });
}

