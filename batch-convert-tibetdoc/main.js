let srcFolderPath = process.argv['2'];

import { JSONToHTML, parse, parseFile, createURL, HTMLtoText } from 'tibetdoc-parser';
import { getDctRoutes, setResultRoute } from './src';
import { resolve as resolvePath, basename as getPathBaseName } from 'path';
import { readFile, writeFile } from 'fs-extra';

batchConvertTibetdoc();

async function batchConvertTibetdoc() {
  srcFolderPath = resolvePath(__dirname, srcFolderPath);
  let dctRoutes = await getDctRoutes(srcFolderPath);

  const srcFolderName = getPathBaseName(srcFolderPath);
  const dctFolderRegex = new RegExp(`^.+?(?=${srcFolderName}[\\\/\\\\])`)

  for (const dctRoute of dctRoutes) {
    const dct = await readFile(dctRoute, 'binary');
    const dctJson = parse(dct);
    const dctHtml = JSONToHTML(dctJson);
    const utf8DctText = HTMLtoText(dctHtml).replace(/ +/g, ' ')
      .replace(/\r?\n/g, ' ');

    const resultRoute = await setResultRoute(__dirname, dctFolderRegex, dctRoute);
    writeFile(resultRoute, utf8DctText, 'utf8', err => {
      if(err) {
        throw err;
      }
      console.log(`${resultRoute} created`);
    });
  }
}

