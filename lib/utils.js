// # module: xps.utils
//
// Contains common utilities.

'use strict';

// -- Dependencies -----------------------------------------------------
var Task    = require('data.task');
var exec    = require('child_process').execFile;
var compose = require('core.lambda').compose;
var unary   = require('core.arity').unary;

// -- Implementation ---------------------------------------------------

// ### function: shell(command, args)
//
// Runs a process and returns the result.
//
// @type: (String, [String]) -> Task(Error, { output: String, error: String })
exports.shell = shell;
function shell(cmd, args) {
  return new Task(function(reject, resolve) {
    exec(cmd, args, function(error, stdout, stderr) {
      if (error)  reject(error);
      else        resolve({ output: stdout, error: stderr });
    });
  });
}

