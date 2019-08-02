import { arabic, arabicOnlyRegex, pbTagsRegex, nonTibAraWhitespaceRegex, shedRegex } from './constants';

export default (rawText) => {
  const pbTags = rawText.match(pbTagsRegex);

  const ocrText = rawText.replace(pbTagsRegex, arabic)
    .replace(nonTibAraWhitespaceRegex, '')
    .split(/[\r\n]+/)
    .map(line => line.trim())
    .filter(isNotText)
    .join('\n');

  return { ocrText, pbTags };
};

function isNotText(line) {
  return line.length > 40 || shedRegex.test(line) || arabicOnlyRegex.test(line);
}

