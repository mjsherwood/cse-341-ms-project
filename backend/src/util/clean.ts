const rimraf = require('rimraf');

if (process.env.SKIP_CLEAN !== 'true') {
  rimraf.sync('dist');
}