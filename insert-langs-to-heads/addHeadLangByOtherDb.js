const targetDbPath = process.argv[2];
const otherDbSutraHeadPath = process.argv[3];
const sutraIdMapPath = process.argv[4];
const targetSutraKey = 'degeId';
const otherSutraKey = 'jiangId';

const fs = require('fs');
const glob = require('glob');
const Path = require('path');
const htmlParse = require('html-parse-stringify2').parse;
const naturalSort = require('javascript-natural-sort');
const otherDbSutraHead = require(otherDbSutraHeadPath);
const sutraIdMap = makeSutraIdMap(require(sutraIdMapPath), targetSutraKey, otherSutraKey);

const targetDbName = Path.basename(targetDbPath);
const globPath = `${targetDbPath}/${targetDbName}*/${targetDbName}*.xml`;

const xmlPaths = glob.sync(globPath)
  .sort(naturalSort);

const sutraHeadRegex = new RegExp('<(sutra|head) [^>]+?>', 'g');
const isSutra = tag => new RegExp('sutra').exec(tag);
const sutraRegex = new RegExp('<sutra id="([^"]+?)"');

let targetHeadShouldChange = false;

let otherSutraId = '';
let otherSutraHeads = [];
let isFirstHead1 = false;

xmlPaths.forEach(xmlPath => {
  let xml = fs.readFileSync(xmlPath, 'utf8');

  xml = xml.replace(sutraHeadRegex, tag => {

    if (isSutra(tag)) {
      targetHeadShouldChange = false;
      const targetSutraId = sutraRegex.exec(tag)[1];
      const hasMatchedSutra = sutraIdMap[targetSutraId];

      if (hasMatchedSutra) {
        targetHeadShouldChange = true;
      }

      otherSutraId = sutraIdMap[targetSutraId];
      othersutraHeads = otherDbSutraHead[otherSutraId];
      return tag;
    }
    
  });
});

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
