import { mkdirp } from 'fs-extra';
import { join as joinPath, dirname as getDir } from 'path';

export default async (mainRoute, dctFolderRegex, dctRoute) => {
  const resultRoute = joinPath(mainRoute, dctRoute.replace(dctFolderRegex, '')).replace('.dct', '.xml');
  const resultDir = getDir(resultRoute);
  await mkdirp(resultDir);
  return resultRoute;
};

