import glob from 'glob';
import naturalSort from 'javascript-natural-sort';
import { readFile } from 'fs-extra';
import { join as joinPath } from 'path';

export default async(folderRoute, ext) => {
  const fileRoutes = await getRoutes(folderRoute, ext);
  const texts = await Promise.all(fileRoutes.map(getText));

  return texts.reduce((result, nextText) => result + newText);
};

function getRoutes(folderRoute, ext) {
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
}

function getText(fileRoute) {
  return readFile(fileRoute, 'utf8');
}

