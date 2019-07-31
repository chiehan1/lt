import { readFile, writeFile } from 'fs-extra';
import getWordPos from './getWordPos';

export default async (tipWords, xmlRoute) => {
  let xml = await readFile(xmlRoute, 'utf8');

  const frameTags = [], frameTagMark = '~!@frameTag@!~';
  let wordPosArr = [];
  const relaxTsheg = `(\u0f0b|\u0f0c)([\\n\\[\\]\\{\\}\\(\\)<>]|${frameTagMark})*?`;
  const wordStart = `(?<=([\\s\\[\\]\\{\\}\\(\\)<>\u0f01-\u0f14\u0f3a-\u0f3d\u0fd0-\u0fd4\u0fd9\u0fda]|${frameTagMark}))`;
  const wordEnding = `(?=([\\s\\[\\]\\{\\}\\(\\)<>\u0f01-\u0f14\u0f3a-\u0f3d\u0fd0-\u0fd4\u0fd9\u0fda]|${frameTagMark}))`;
  
  xml = xml.replace(/<(sutra|division|vol|head|bampo|\/?ttitle|\/?stitle)[^>]+?>/g, '').trim();

  xml = xml.replace(/<[^>]+?>/g, m => {
    frameTags.push(m);
    return frameTagMark;
  });

  const tipWordsLen = tipWords.length;

  for (let i = 0; i < tipWordsLen; i++) {
    const tipWord = tipWords[i];
    const relaxTipWord = wordStart + tipWord.replace(/\u0f0b/g, relaxTsheg) + wordEnding;
    const wordRegex = new RegExp(relaxTipWord);
    const wordRegexG = new RegExp(relaxTipWord, 'g');

    if (wordRegex.test(xml)) {

      for (const match of xml.matchAll(wordRegexG)) {
        const { '0': m, index } = match;
        const lastIndex = index + m.length - 1;
        getWordPos(wordPosArr, index, lastIndex, 0, wordPosArr.length - 1);
      }

      console.log(xmlRoute, tipWord, wordRegexG);
    }
  }
  
  for (let i = wordPosArr.length - 1; i >= 0; i--) {
    const [ index, lastIndex ] = wordPosArr[i];
    xml = xml.slice(0, index) + '<' + xml.slice(index, lastIndex + 1) + '/>' + xml.slice(lastIndex + 1);
  }

  xml = xml.replace(new RegExp(frameTagMark, 'g'), mark => frameTags.shift());

  await writeFile(xmlRoute, xml, 'utf8');
  console.log(xmlRoute, 'done');
};

