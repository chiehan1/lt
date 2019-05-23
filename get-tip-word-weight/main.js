import { readJson, readFile, writeFile} from 'fs-extra';
import globby from 'globby';
import naturalSort from 'javascript-natural-sort';

const dbNames = ['gampopa'];
//const dbNames = ['jiangkangyur', 'degekangyur', 'degetengyur', 'gampopa', '8thkarmapa', 'mipam', 'tsongkhapa', 'gorampa', 'taranatha', 'bonpokangyur'];

const getTipWordWeight = async (dbNames) => {
  let tipWords = await readJson('./../../tip-word/tipWords.json');
  const tipWordsRegexs = tipWords.map(tipWord => new RegExp(`[\s་།]${tipWord.bo.substring(0, bo.length - 1)}[\s་།]`, 'g'));

  for (const dbName of dbNames) {
    const globPath = `./../../${dbName}/${dbName}*/${dbName}*.xml`;

    const folderMap = {};
    const pathsByFolders = [];

    (await globby(globPath)).sort(naturalSort)
      .forEach(xmlPath => {
        const folderRegex = new RegExp(`${dbName}\\d+(-\\d+)?`);

        const folder = folderRegex.exec(xmlPath)[0];

        let folderIndex = folderMap[folder];

        if (folderIndex) {
          pathsByFolders[folderIndex].push(xmlPath);
          return;
        }

        folderIndex = pathsByFolders.length;
        folderMap[folder] = folderIndex;
        pathsByFolders[folderIndex] = [xmlPath];
      });

    for (const pathsByFolder of pathsByFolders) {
      const folderText = '';

      for (const xmlPath of pathsByFolder) {
        let xmlText = await readFile(xmlPath, 'utf8');
        xmlText = xmlText.replace(/<(?!pb)[^>]+?>/g, '');

        folderText += xmlText;
      }

      for (const regex of tipWordsRegexs) {
        const { bo } = tipWord;
        const tipWordRegex = new RegExp(`[\s་།]${bo.substring(0, bo.length - 1)}[\s་།]`, 'g');

        const occrs = (folderText.match(tipWordRegex) || []).length;

        if (! tipWord.weights) {
          tipWord.weights = {
            'jiangkangyur': 100,
            'degekangyur': 100,
            'degetengyur': 100,
            'mipam': 100,
            'gampopa': 100,
            '8thkarmapa': 100,
            'gorampa': 100,
            'tsongkhapa': 100,
            'taranatha': 100,
            'bonpokangyur': 100
          };
        }

        tipWord.weights[dbName] += occrs;

        if (occrs) {
          console.log(dbName, bo, tipWord.weights[dbName]);
        }
      }
    }
  }

  tipWords = tipWords.filter(tipWord => {
    return Object.values(tipWord.weights)
      .some(e => !!(e - 100));
  });

  await writeFile('./newTipWord', JSON.stringify(tipWords, null, ' '), 'utf8');
};

getTipWordWeight(dbNames);

/*
const dbIdMap = {
  'jiangkangyur': 0,
  'degekangyur': 1,
  'degetengyur': 1000,
  'mipam': 10000,
  'gampopa': 20000,
  '8thkarmapa': 20001,
  'gorampa': 30000,
  'taranatha': 40000,
  'tsongkhapa': 50000,
  'bonpokangyur': 100000
};
*/
