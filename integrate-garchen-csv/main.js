import { promises as fsPromise }, fs from 'fs';
import glob from 'glob';
import { toObject as csv2json } from 'csvjson';
import { compare as tibetanSort } from 'tibetan-sort-js';
import { union, asyncWrap } from './helpers';
import tibColName from './tibColName';

const integrateGarchenCsv = async () => {
  const globRoute = './dictionaryCsvs/**/*.csv';
  const csvRoutes = await asyncWrap(glob)(globRoute);

  const boEntryArrs = await Promise.all(csvRoutes.map(route => {
    const csv = await fsPromise.readFile(route, 'utf8');
    const json = csv2json(csv);

  }));

  const boEntries = union(...boEntryArrs).sort(tibetanSort)
    .map(entry => { bo: entry });

  fs.writeFile('./result.js', `export default = ${JSON.stringify(boEntries, null, '  ')}`, 'utf8');
};

integrateGarchenCsv();
