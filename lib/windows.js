// # module: xps.windows
//
// Windows utilities for listing and killing processes.

'use strict';

// -- Dependencies -----------------------------------------------------
var Task   = require('data.task');
var msTask = require('ms-task');
var csv    = require('csv');


// -- Helpers ----------------------------------------------------------

// ### function: parseCSV(text)
//
// A wrapper over csv's parse function.
//
// @type: (String) -> Task(Error, { name: String, pid: Number })
function parseCSV(text) {
  return new Task(function(reject, resolve) {
    csv.parse(text, function(error, rows) {
      if (error)  reject(error);
      else        resolve(rows.slice(1).map(function(row) {
                    return { name: row[0], pid: Number(row[1]) };
                  }));
    });
  });
}

// ### function: taskList()
//
// A wrapper over the ms-task's task.list function.
//
// @type: () -> Task(Error, String)
function taskList() {
  return new Task(function(reject, resolve) {
    msTask('/fo csv', function(error, data) {
      if (error)  reject(error);
      else        resolve(data);
    });
  });
}

// -- Implementation ---------------------------------------------------

// ### function: list()
//
// Returns the complete list of running processes for the current user.
//
// @type: () -> Task(Error, [{ name: String, pid: Number }])
exports.list = list;
function list() {
  return taskList().chain(parseCSV);
}

// ### function: kill(pid)
//
// Kills the process with the given PID
//
// @type: (Number) -> Task(Error, Undefined)
exports.kill = kill;
function kill(pid) {
  return new Task(function(reject, resolve) {
    msTask.kill(pid, function(error) {
      if (error)  reject(error);
      else        resolve();
    });
  });
}
