import { readFile, writeFileSync } from 'fs';
import Path from 'path';
import glob from 'glob';
import { toObject as csv2json } from 'csvjson';
import { compare as tibetanSort } from 'tibetan-sort-js';
import { union, asyncWrap } from './helpers';
import { fnTibColMap, tibCnDictionaryName } from './tibColName';

let getTibEntry = tibEntryColumn => entryObj => {
  let tibEntry = entryObj[tibEntryColumn];
  tibEntry = tibEntry
    .replace(/^[་།༏ ༽\u0f0c྄ོུྐྔྕེྨིྱླ]*(.*?)[་།༏ \u0f0c]*$/, '$1') // ྄ \u0f84
    .replace(/^\((.+?)\)$/, '$1')
    .replace(/^༼(.+?)༽$/, '$1')
    .replace(/^[་།༏ ༽\u0f0c྄ོུྐྔྕེྨིྱླ]*(.*?)[་།༏ \u0f0c]*$/, '$1');

    return tibEntry;
};

const checkTibEntry = entry => {
  // \u0f3c\u0f3d ༼  ༽
  return /^[\u0f00-\u0f3b\u0f3e-\u0fff]+$/.test(entry);
};

const integrateGarchenCsv = async () => {
  const globRoute = './dictionaryCsvs/**/*.csv';
  const csvRoutes = await asyncWrap(glob)(globRoute);

  const boEntryArrs = await Promise.all(csvRoutes.map(async route => {
    const csv = await asyncWrap(readFile)(route, 'utf8');
    const entryObjs = csv2json(csv);

    const isTibCnDictionary = (new RegExp(tibCnDictionaryName)).test(route);
    const dictionaryName =  isTibCnDictionary ? tibCnDictionaryName : Path.basename(route, '.csv');
    const tibEntryColumn = fnTibColMap[dictionaryName];

    const getTibEntryByColName = getTibEntry(tibEntryColumn);
    return entryObjs.map(getTibEntryByColName).filter(checkTibEntry);
  }));

  const boEntries = union(...boEntryArrs).sort(tibetanSort)
    .map(entry => ({ bo: `${entry}་` }));

  const jsonString = JSON.stringify(boEntries, null, '  ');
  const resultString = `export default = ${jsonString};\n`;
  writeFileSync('./result.js', resultString, 'utf8');
};

integrateGarchenCsv();
