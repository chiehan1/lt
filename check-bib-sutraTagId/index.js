const db = process.argv[2];

const naturalSort = require('javascript-natural-sort');
const glob = require('glob');
const fs = require('fs');
const bib = require(`../../${db}/${db}-bibliography.json`);
const routes = glob.sync(`../../${db}/${db}*/${db}*.xml`).sort(naturalSort);

function getBibSutraIds(bib) {
  let sutraIds = {};
  bib.divisions.forEach(division => {
    division.sutras.forEach(sutra => sutraIds[sutra.sutraid] = true);
  });
  return sutraIds;
}

const sutraTagRegex = /<sutra id="(.+?)"\/>/g;
const bibSutraIds = getBibSutraIds(bib);

routes.forEach(route => {
  const text = fs.readFileSync(route);
  let sutraMatch = sutraTagRegex.exec(text);

  while (sutraMatch) {
    let textSutraId = sutraMatch[1];

    if (bibSutraIds[textSutraId]) {
      sutraMatch = sutraTagRegex.exec(text);
      bibSutraIds[textSutraId] = false;
    }
    else {
      throw `${route}\ntextSutraId ${textSutraId} does not exist in bibliography`;
    }
  }
});

for (let sutraId in bibSutraIds) {
  if (bibSutraIds[sutraId]) {
    throw `${sutraId} in bibliography does not exist in text`;
  }
}

console.log('check done');