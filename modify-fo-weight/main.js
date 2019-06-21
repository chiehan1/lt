import { writeJson, readJson } from 'fs-extra';
import percentile from 'percentile';
import { targetKdbs } from './config';

main(targetKdbs);

async function main(targetKdbs) {
  const jsonPaths = ['./fo-entries.json', '../../tip-word/tipWords.json'];
  const [foEntries, tipWords] = await Promise.all(jsonPaths.map(path => readJson(path)));

  targetKdbs.forEach(config => modifyKdbWeight(config, foEntries, tipWords));

  writeJson('./newTipWords.json', tipWords, {spaces: ' '});
}

function modifyKdbWeight(config, foEntries, tipWords) {
  const [ kdbName, nonFoPercent, foPercent ] = config;
  const weightCol = `${kdbName}WeightInText`;
  let nonFoWeights = [];
  let kdbFoEntries = [];

  tipWords.forEach((tipWord, index) => {
    const weight = tipWord[weightCol];
    const bo = tipWord.bo;

    if (weight > 100) {
      !foEntries.includes(bo) ? nonFoWeights.push(weight) : kdbFoEntries.push([tipWord, index]);
    }
  });

  nonFoWeights.sort();
  kdbFoEntries.sort((a, b) => a[0][weightCol] - b[0][weightCol]);

  const nonFoPercentile = percentile(100 - nonFoPercent, nonFoWeights);
  const foPercentileItem = percentile(100 - foPercent, kdbFoEntries, item => item[0][weightCol]);
  const foPercentile = foPercentileItem[0][weightCol];

  info(kdbName, nonFoWeights.length, nonFoPercent, kdbFoEntries.length, foPercent, nonFoPercentile, foPercentileItem);

  const percentileDiff = nonFoPercentile - foPercentile;
  if (percentileDiff <= 0) {
    throw `percentileDiff: ${percentileDiff}`;
  }

  kdbFoEntries.forEach(row => {
    const index = row[1];
    const newWeight = row[0][weightCol] + percentileDiff;
    tipWords[index][weightCol] = newWeight;
  });
}

function info(kdbName, nonFoEntryN, nonFoPercent, foEntryN, foPercent, nonFoPercentile, foPercentileItem) {
  console.log(kdbName);
  console.log('fonFoNumber', nonFoEntryN * nonFoPercent / 100, 'foNumber', foEntryN * foPercent / 100);
  console.log(nonFoPercentile, foPercentileItem);
}
