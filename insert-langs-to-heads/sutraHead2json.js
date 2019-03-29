const dbPath = process.argv[2];
const headRange = '1234';

const fs = require('fs');
const Path = require('path');
const glob = require('glob');
const naturalSort = require('javascript-natural-sort');
const htmlParse = require('html-parse-stringify2').parse;

const dbName = Path.basename(dbPath);
const globPath = `${dbPath}/${dbName}*/${dbName}*.xml`;

const xmlPaths = glob.sync(globPath)
  .sort(naturalSort);

const sutraHeadRegex = new RegExp('<(sutra|head) [^>]+?>', 'g');
const isSutra = tag => new RegExp('sutra').exec(tag);
const sutraRegex = new RegExp('<sutra id="([^"]+?)"');
const isInHeadRange = tag => new RegExp(`n="${headRange}"`).exec(tag);

const headsInSutras = {};
let sutraId = '';

xmlPaths.forEach(xmlPath => {
  const xml = fs.readFileSync(xmlPath, 'utf8');

  xml.replace(sutraHeadRegex, tag => {

    if (isSutra(tag)) {
      sutraId = sutraRegex.exec(tag)[1];
      headsInSutras[sutraId] = [];
      return;
    }

    if (isInHeadRange) {
      const headAttrs = htmlParse(tag)[0].attrs;
      headsInSutras[sutraId].push(headAttrs);
    }
  });

  console.log(`find tags in ${xmlPath} done`);
});

fs.writeFileSync(`./${dbName}-sutra-head.json`, JSON.stringify(headsInSutras, '', ' '), 'utf8');
