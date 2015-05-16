// # module: xps
//
// Cross-platform module for listing and killing processes.

'use strict';

module.exports =
  process.platform === 'win32'?   require('./windows')
  : /* otherwise */               require('./linux');
