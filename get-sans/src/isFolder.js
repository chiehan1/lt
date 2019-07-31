import { stat } from 'fs-extra';
import { join as joinPath } from 'path';

export default async (dbName, folderDir, promise, folderName) => {
  const folderPaths = await promise;

  const validNameReg = new RegExp(`^${dbName}\\d+(-\\d+)?$`);
  const isValidName = validNameReg.test(folderName);

  const folderPath = joinPath(folderDir, folderName);
  const isFolder = (await stat(folderPath)).isDirectory();

  if (isValidName && isFolder) {
    folderPaths.push(folderPath);
  }

  return folderPaths;
};

