import { extname as pathExtname, join as joinPath } from 'path';
import naturalSort from 'javascript-natural-sort';
import glob from 'glob';

export default (srcFolderPath) => {
  const globPath = joinPath(srcFolderPath, '**', '*.dct');

  return new Promise((res, rej) => {
    glob(globPath, (err, routes) => {
      if (err) {
        rej(err);
        return;
      }
      res(routes.sort(naturalSort));
    });
  });
};

