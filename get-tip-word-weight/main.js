import { get as httpGet } from 'http';
import { get as httpsGet } from 'https';
import { readJson, writeFile } from 'fs-extra';
import {  } from 'async';

const dbNames = ['jiangkangyur', 'degekangyur', 'degetengyur', 'gampopa', '8thkarmapa', 'mipam', 'tsongkhapa', 'gorampa', 'taranatha', 'bonpokangyur'];

const getTipWordWeight = async (dbNames) => {

  let tipWords = (await readJson('./../../tip-word/tipWords.json'))
    .map(tipWord => {
      tipWord.weights = {
        'jiangkangyur': 100,
        'degekangyur': 100,
        'degetengyur': 100,
        'mipam': 100,
        'gampopa': 100,
        '8thkarmapa': 100,
        'gorampa': 100,
        'tsongkhapa': 100,
        'taranatha': 100,
        'bonpokangyur': 100
      };
      return tipWord;
    });

  for (const [index, tipWord] of tipWords.entries()) {

    const { bo } = tipWord;

    for (const dbName of dbNames) {

      const count = await new Promise((resolve, reject) => {

        const uri = `http://localhost:3010/pbs/_search?size=10&kdbName=${dbName}&keyword=${bo}&minScore=1e-7&searchRange=current-kdb`;

        httpGet(encodeURI(uri), res => {
          let result = '';

          res.setEncoding('utf8');
          res.on('data', data => {
            result += data;
          });

          res.on('end', () => {
            resolve(JSON.parse(result).total);
          });
        }).on('error', e => {
          reject(e);
        });

      });

      tipWord.weights[dbName] += count;
    }

    console.log('tipWord', index, 'done');
  }

  tipWords = tipWords.filter(tipWord => {
    return Object.values(tipWord.weights)
      .some(e => !!(e - 100));
  });

  await writeFile('./newTipWord.json', JSON.stringify(tipWords, null, ' '), 'utf8');
};

getTipWordWeight(dbNames);
