import glob from 'glob';
import { sep,  } from 'path';
import { readFile } from 'fs-extra';

export default async (volPath) => {
  const xmlPaths = await getXmlPaths(volPath);
  const xmls = await Promise.all(xmlPaths.map(path => readFile(path, 'utf8')));

  return xmls;
};

async function getXmlPaths(volPath) {
  return new Promise((res, rej) => {
    const volPathParts = volPath.split(sep);
    const dbName = volPathParts[volPathParts.length - 2];

    glob(`${volPath}${sep}${dbName}*.xml`, (err, paths) => {
      if (err) {
        rej(err);
        return;
      }
      res(paths);
    });
  });
}

