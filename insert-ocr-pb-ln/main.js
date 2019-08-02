import { getText, cleanOcrText, adjustResultText, arabicRegexGlobal, arabicOnlyRegexGlobal, arabicRegex, arabic } from './src';
import { resolve as resolvePath } from 'path';
import { writeFile } from 'fs-extra';
import diff from 'fast-diff';

const correctTextsDir = resolvePath(__dirname, './correctTexts');
const ocrTextsDir = resolvePath(__dirname, './ocrTexts' );
const resultTextDir = resolvePath(__dirname, './result.xml');

const correctTextExt = 'xml';
const ocrTextExt = 'xml';

insertOcrPbLn();

async function insertOcrPbLn() {
  const date = new Date();
  const correctText = await getText(correctTextsDir, correctTextExt);
  const rawOcrText = await getText(ocrTextsDir, ocrTextExt);
  const { ocrText, pbTags } = cleanOcrText(rawOcrText);
  const pbTags2 = [ ...pbTags ];
  writeFile('./test.xml', ocrText.replace(arabicOnlyRegexGlobal, m => pbTags2.shift()), 'utf8');

  let resultText = '<pb id="1-1-000"/>\n';
  const diffPatches = diff(correctText, ocrText);
  writeFile('./test.json', JSON.stringify(diffPatches, null, ' '), 'utf8');
  let isPreface = true;

  diffPatches.forEach(patch => {
    let [ pointer, trunc ] = patch;

    const isCorrectText = 1 !== pointer;

    if (isCorrectText) {
      resultText += trunc;
      return;
    }

    // the trunc is from ocr text
    const hasTag = arabicRegex.test(trunc);

    if (hasTag) {
      if (isPreface) {
        resultText += /[\s\S]*ﺕ/.exec(trunc)[0].replace(arabicRegexGlobal, `\n${arabic}\n`);
        isPreface = false;
        return;
      }
      resultText += `\n${arabic}\n`;
      return;
    }

    if (isPreface) {
      resultText += trunc;
      return;
    }

    const hasLn = /\n/.test(trunc);

    if (hasLn) {
      resultText += '\n';
    }

    return;
  });

  resultText = adjustResultText(resultText);
  resultText = resultText.replace(arabicOnlyRegexGlobal, m => pbTags.shift());

  await writeFile(resultTextDir, resultText, 'utf8');
  console.log(new Date() - date);
}

