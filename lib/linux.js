// # module: xps.linux
//
// Contains Linux's utilities for listing and killing processes.

'use strict';

// -- Dependencies -----------------------------------------------------
var shell = require('./utils').shell;
var K     = require('core.lambda').constant;
var path  = require('path');


// -- Implementation ---------------------------------------------------

// ### function: list()
//
// Returns the complete list of running processes for the current user.
//
// @type: () -> Task(Error, [{ name: String, pid: Number }])
exports.list = list;
function list() {
  return shell('ps', ['axo', 'pid,comm']).map(parse);

  function parse(text) {
    return text.output
               .trim()
               .split(/\n/)
               .slice(1)
               .map(function(line) {
                 var match = line.match(/\s*(\d+)\s+(.+)\s*/);
                 if (match == null) {
                   return null;
                 } else {
                   return { name: path.basename(match[2]), pid: Number(match[1]) };
                 }
               })
               .filter(Boolean);
  }
}

// ### function: kill(pid)
//
// Kills the process with the given PID.
//
// @type: (Number) -> Task(Error, Undefined)
exports.kill = kill;
function kill(pid) {
  if (typeof pid !== "number") {
    throw new TypeError(`Expected pid to be a number`);
  }
  return shell('kill', ['-9', pid]).map(K(undefined));
}
