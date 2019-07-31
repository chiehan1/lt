import { resolve as resolvePath } from 'path';
import { readJson, writeFile } from 'fs-extra';
import { reorderTipWords, getRoutes, addWordTags, filterTipWords } from './src';

const dbNames = [
  [ 'jiangkangyur', 1, 1 ]
];

main();

async function main() {
  const rawTipWords = await readJson('./tip-word/tipWords.json');
  let tipWords = reorderTipWords(rawTipWords);
  tipWords = filterTipWords(tipWords);
  writeFile(resolvePath(__dirname, './tipWordArr.json'), JSON.stringify(tipWords, null, ' '), 'utf8');

  const xmlRoutes = await getRoutes(dbNames);
  const xmlRoutesLen = xmlRoutes.length;

  let activeRoutes = [];

  for (const [xmlIdx, xmlRoute] of xmlRoutes.entries()) {

    activeRoutes.push(xmlRoute);

    if (0 === (xmlIdx + 1) % 10 || xmlRoutesLen === xmlIdx + 1) {
      await Promise.all(activeRoutes.map(addWordTags.bind(null, tipWords)));
      activeRoutes = [];
    }
  }
}

