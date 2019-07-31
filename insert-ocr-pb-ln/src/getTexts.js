import glob from 'glob';
import naturalSort from 'javascript-natural-sort';
import { readFile } from 'fs-extra';
import { join as joinPath } from 'path';

export default async (folderRoute, ext) = {
  const globPath = joinPath(folderRoute, '**', `*.${ext}`);

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

