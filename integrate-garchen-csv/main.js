import { readFile, writeFileSync } from 'fs';
import Path from 'path';
import glob from 'glob';
import { toObject as csv2json } from 'csvjson';
import { compare as tibetanSort } from 'tibetan-sort-js';
import { union, asyncWrap } from './helpers';
import { fnTibColMap, tibCnDictionaryName } from './tibColName';

let getTibEntry = tibEntryColumn => entryObj => {
  let tibEntry = entryObj[tibEntryColumn];
  return tibEntry.replace(/^[་། ]*(.+?)[་། ]*$/, '$1') + '་';
};

const checkTibEntry = entry => {
  return /^[\u0f00-\u0fff ()]+$/.test(entry);
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

    const getTibEntryByColName = getTibEnty(tibEntryColumn);
    return entryObjs.map(getTibEntryByColName).filter(checkTibEntry);
  }));

  const boEntries = union(...boEntryArrs).sort(tibetanSort)
    .map(entry => { bo: entry });

  const jsonString = JSON.stringify(boEntries, null, '  ');
  const resultString = `export default = ${jsonString};`;
  writeFileSync('./result.js', resultString, 'utf8');
};

integrateGarchenCsv();
