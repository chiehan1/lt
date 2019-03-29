const csvPath = process.argv[2];

const fs = require('fs');
const Path = require('path');
const csv2json = require('csvjson').toObject;

const fileName = Path.basename(csvPath, '.csv');

const csvStr = fs.readFileSync(csvPath, 'utf8');
const json = csv2json(csvStr).map(obj => {
  delete obj[''];
  return obj;
});

fs.writeFileSync(`./${fileName}.json`, JSON.stringify(json, '', ' '), 'utf8');
