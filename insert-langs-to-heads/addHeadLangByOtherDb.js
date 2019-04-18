const targetDbPath = process.argv[2];
const otherDbSutraHeadPath = process.argv[3];
const sutraIdMapPath = process.argv[4];
const targetSutraKey = 'degeId';
const otherSutraKey = 'jiangId';
const headRange = [2];
const volRange = [1, 102];

const fs = require('fs');
const glob = require('glob');
const Path = require('path');
const toWylie = require('wylie').toWylie;
const htmlParse = require('html-parse-stringify2').parse;
const naturalSort = require('javascript-natural-sort');
const otherDbSutraHead = require(otherDbSutraHeadPath);
poolJiangHwaYenHeadTogether(otherDbSutraHead);
const sutraIdMap = makeSutraIdMap(require(sutraIdMapPath), targetSutraKey, otherSutraKey);

const targetDbName = Path.basename(targetDbPath);
const globPath = `${targetDbPath}/${targetDbName}*/${targetDbName}*.xml`;

const xmlPaths = glob.sync(globPath)
  .filter(path => {
    const volN = new RegExp(`${targetDbName}(\\d+)`).exec(path)[1];
    return volN >= volRange[0] && volN <= volRange[1];
  })
  .sort(naturalSort);

const sutraHeadRegex = new RegExp('<(sutra|head) [^>]+?>', 'g');
const isSutra = tag => new RegExp('sutra').exec(tag);
const sutraRegex = new RegExp('<sutra id="([^"]+?)"');
const isInHeadRange = n => -1 !== headRange.indexOf(n);

let targetHeadShouldChange = false;
let otherSutraHeads = [];
let otherSutraHeadCount = 0;
let otherSutraId = '';

fs.writeFileSync('./log.xml', '', 'utf8');

xmlPaths.forEach(xmlPath => {
  let xml = fs.readFileSync(xmlPath, 'utf8');

  xml = xml.replace(sutraHeadRegex, tag => {

    if (isSutra(tag)) {
      targetHeadShouldChange = false;
      let targetSutraId = sutraRegex.exec(tag)[1];

      if (isDegeHwaYen1stSutraTag(targetSutraId)) {
        targetSutraId = 'd44';
      }

      if (shouldPassDegeHwaYenSubSutraId(targetSutraId)) {
        targetHeadShouldChange = true;
        return tag;
      }

      const hasMatchedSutra = sutraIdMap[targetSutraId];

      if (hasMatchedSutra) {
        targetHeadShouldChange = true;
        otherSutraHeadCount = 0;
        otherSutraId = sutraIdMap[targetSutraId];
        otherSutraHeads = otherDbSutraHead[otherSutraId].filter(headRow => -1 !== headRange.indexOf(Number(headRow.n)));
      }

      return tag;
    }

    if (! targetHeadShouldChange) {
      return tag;
    }

    const headAttrs = htmlParse(tag)[0].attrs;
    const {n: targetN, t: targetT} = headAttrs;

    if (! isInHeadRange(Number(targetN))) {
      return tag;
    }

    const otherSutraRow = otherSutraHeads[otherSutraHeadCount];

    if (! otherSutraRow) {
      logMessage(`no ${otherSutraKey} to match in ${xmlPath}\n${targetSutraKey}: ${targetN} ${targetT}\n${otherSutraKey}: ${otherSutraId} ${otherSutraHeadCount}\n`);
      return tag;
    }

    const {n: otherN, t: otherT, bo, en, tw, cn} = otherSutraRow;

    if (targetN !== otherN || targetT !== otherT) {
      logMessage(`n and t not match in ${xmlPath}\n${targetSutraKey}: ${targetN} ${targetT}\n${otherSutraKey}: ${otherN} ${otherT}\n`);

      otherSutraHeadCount++;
      return tag;
    }

    if (! bo) {
      logMessage(`there is no bo in ${otherSutraKey}: ${otherSutraId}\n`)
    }

    headAttrs.bo = targetT;
    headAttrs.en = en || toWylie(headAttrs.bo);
    headAttrs.tw = tw || headAttrs.bo;
    headAttrs.cn = cn || headAttrs.bo;

    if (! bo || ! en || ! tw || ! cn) {
      logMessage(`missing [bo, en, tw, cn] in ${otherSutraKey}\n${xmlPath}\n${targetSutraKey}: ${targetN} ${targetT}\n${otherSutraKey}: ${otherN} ${otherT}\n`);

      otherSutraHeadCount++;
      return tag;
    }

    if (! headAttrs.bo || ! headAttrs.en || ! headAttrs.tw || ! headAttrs.cn) {
      throw `missing [bo, en, tw, cn] in ${targetSutraKey} ${xmlPath}\n${targetSutraKey}: ${targetN} ${targetT}\n${otherSutraKey}: ${otherN} ${otherT}\n`;
    }

    otherSutraHeadCount++;
    return makeTag(headAttrs);
  });

  fs.writeFileSync(xmlPath, xml, 'utf8');
  console.log(`${xmlPath} insert langs done`);
});

function logMessage(message) {
  console.log(message);
  fs.appendFileSync('./log.xml', `${message}\n`);
}

function makeTag(headAttrs) {
  const {n, t, bo, en, tw, cn, ...rest} = headAttrs;

  let restAttrStr = Object.entries(rest)
    .map(entry => entry.join('="') + '"')
    .join(' ');

  restAttrStr = '' === restAttrStr ? '' : ` ${restAttrStr}`;

  return `<head n="${n}" t="${t}" bo="${bo}" en="${en}" tw="${tw}" cn="${cn}"${restAttrStr}/>`;
}

function makeSutraIdMap(sutraMap, targetSutraKey, otherSutraKey) {
  const newMap = {};
  sutraMap.forEach(row => {
    const targetSutraId = row[targetSutraKey];
    const otherSutraId = row[otherSutraKey];

    if (targetSutraId && otherSutraId) {
      newMap[targetSutraId] = otherSutraId;
    }
  });
  return newMap;
}

function poolJiangHwaYenHeadTogether(otherDbSutraHead) {
  const J299aHeads = otherDbSutraHead['J299a'];
  const J299bHeads = otherDbSutraHead['J299b'];
  const J299cHeads = otherDbSutraHead['J299c'];
  const J299dHeads = otherDbSutraHead['J299d'];
  const J299eHeads = otherDbSutraHead['J299e'];
  const J299fHeads = otherDbSutraHead['J299f'];
  const J299gHeads = otherDbSutraHead['J299g'];

  otherDbSutraHead['J299'].push(...J299aHeads, ...J299bHeads, ...J299cHeads, ...J299dHeads, ...J299eHeads, ...J299fHeads, ...J299gHeads);
}

function shouldPassDegeHwaYenSubSutraId(sutraId) {
  return /^d44[bcd]$/.test(sutraId);
}

function isDegeHwaYen1stSutraTag(sutraId) {
  return 'd44a' === sutraId;
}
