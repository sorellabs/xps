var spawn = require('child_process').spawn;
var ps = require('../../');
var _  = require('specify-assertions');
var divergence = _.divergence.divergence;

function containAtLeast(predicate) {
  return function(a) {
    return _.assert( a.some(predicate)
                   , divergence( '{:actual} to contain any object passing {:match}'
                               , '{:actual} to not contain any object passing {:match}'
                               ).make({ actual: a, match: predicate }))
  }
}

function haveEveryItemMatch(predicate) {
  return function(a) {
    return _.assert( a.every(predicate)
                   , divergence( '{:actual} to have all objects passing {:match}'
                               , '{:actual} to not have all objects passing {:match}'
                               ).make({ actual: a, match: predicate }))
  }
}



module.exports = spec 'Core routines' {
  spec 'list()' {
    async 'Should return a list of processes' {
      return ps.list() will _.haveClass('Array');
    }

    async 'Should have objects match the structure { name: String, pid: Number }' {
      return ps.list() will haveEveryItemMatch(function(a){
                                                 return typeof a.name === 'string'
                                                 &&     typeof a.pid  === 'number'
                                              })
    }

    async 'Should contain at least the current process' {
      return ps.list() will containAtLeast(function(a) {
                                             return /\bnode(?:js)?\b|\biojs\b/.test(a.name)
                                             &&     a.pid === process.pid
                                          })
    }
  }

  spec 'kill(pid)' {
    async 'Should kill the process with the given ID' {
      var child = spawn(process.execPath);

      return $do {
        ps.list() will containAtLeast(function(a){ return a.pid === child.pid });
        ps.kill(child.pid);
        ps.list() will haveEveryItemMatch(function(a){ return a.pid !== child.pid });
      }
    }
  }
}
