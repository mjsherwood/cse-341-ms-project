import * as rimraf from 'rimraf';

if (process.env.SKIP_CLEAN !== 'true') {
  rimraf.sync('dist');
}