const checkSyllables = require('check-tibetan').checkSyllables;
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const naturalSort = require('javascript-natural-sort');
const kdbName = process.argv[2];

const totalResult = [];
let resultStr = '';

const routes = glob.sync(`../../${kdbName}/${kdbName}*/${kdbName}*.xml`).sort(naturalSort);

routes.forEach(route => {
  const paths = route.split(path.sep);
  const volN = /.+?([\d-]+)$/.exec(paths[3])[1];
  const filePos = paths[3] + path.sep + paths[4];
  const pbInfos = [];

  const text = fs.readFileSync(route, 'utf8').replace(/\r\n/g, '\n');
  const pbTexts = text.replace(/<pb/g, '~delimiter~<pb').split('~delimiter~');
  pbTexts.shift();

  pbTexts.forEach(pbText => {
    const pbId = /<pb id="(.+?)"/.exec(pbText)[1];
    const lines = pbText.replace(/<pb.+?>/, '').trim().split('\n');
    const lineInfos = [];

    lines.forEach((line, i) => {
      const wrongSylInfos = checkSyllables(line);
      if (wrongSylInfos.length > 0) {
        const wrongSyls = wrongSylInfos.map(wrongSylInfo => wrongSylInfo[2]);
        lineInfos.push([++i, wrongSyls]);
      }
    });

    if (Object.keys(lineInfos).length > 0) {
      pbInfos.push([pbId, lineInfos]);
    }
  });

  if (pbInfos.length > 0) {
    totalResult.push([filePos, volN, pbInfos]);
  }
});

totalResult.forEach(fileInfo => {
  resultStr += `\nVolumn ${fileInfo[1]}, ${fileInfo[0]}\n`

  fileInfo[2].forEach(pbInfo => {
    resultStr += `\npbId ${pbInfo[0]} :\n`

    pbInfo[1].forEach(lineInfo => {
      resultStr += `\nline ${lineInfo[0]}\n${lineInfo[1].join('\n')}\n`;
    });
  });
});

console.log(resultStr);