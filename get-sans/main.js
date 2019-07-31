import glob from 'glob';
import { resolve as resolvePath, sep } from 'path';
import Excel from 'exceljs/modern.nodejs';
import naturalSort from 'javascript-natural-sort';
import { readFile, readdir } from 'fs-extra';
import { hasSan, tibStopReg, isFolder, getVolText, getPbTexts, getSanText } from './src';

const workbook = new Excel.Workbook();

// const dbNames = [ 'jiangkangyur', 'degekangyur', 'lhasakangyur', 'degetengyur', 'gampopa', '8thkarmapa', 'mipam', 'tsongkhapa', 'gorampa', 'taranatha', 'bonpokangyur'];
const dbNames = [ 'gampopa' ];

getStacks();

async function getStacks() {
  let sanMap = {};
  let result = [];
  let tempSans = [];
  let posStore = {};
  let lnStore = [];

  for (const dbName of dbNames) {
    const dbPath = resolvePath(__dirname, `..${sep}..${sep}${dbName}`);
    const flist = (await readdir(dbPath))
    const volPaths = await flist.reduce(isFolder.bind(null, dbName, dbPath), Promise.resolve([]));

    for (const volPath of volPaths) {
      const volText = await getVolText(volPath);

      if(! hasSan(volText)) {
        continue;
      }

      const pbs = getPbTexts(volText);
      const pbsLen = pbs.length;

      for (const pbIdx = 0; pbIdx < pbsLen; pbIdx++) {
        const { pbId, pbText, lns } = pbs[pbIdx];

        if (! hasSan(pbText)) {
          continue;
        }

        const lnsLen = lns.length;

        for (const lnIdx = 0; lnIdx < lnsLen; lnIdx++) {
          const ln = lns[lnIdx].trim();

          if (! hasSan(ln)) {
            continue;
          }

          const sentences = ln.split(tibStopReg);
          const sentencesLength = sentences.length;

          for (const j = 0; j < sentencesLength; j++) {
            const sentence = sentences[j].trim();

            if (! hasSan(sentence)) {
              continue;
            }

            const syls = sentence.split('\u0f0b');
            const sylsLength = syls.length;

            for (const k = 0; k < sylsLength; k++) {
              const syl = syls[k];

              // syl is not sans
              if (! hasSan(syl)) {

                if (tempSans.length > 0) {
                  const sanWord = tempSans.join('\u0f0b');

                  if (! sanMap[sanWord]) {
                    const pos = `${dbName} ${Object.keys(posStore).join(', ')}`;

                    result.push({
                      sanWord,
                      sanSyls: tempSans,
                      texts: [{ pos, text }]
                    }):
                  }
                }

                continue;
              }

              // syl is sans
              tempSans.push(syl);

              let sylPos = `${pbId}_ln${lnIdx + 1}`, sylLastPos = '', sylNextPos = '', lastLn;

              lastLn = lns[lnIdx - 1];
              lastPb = pbs[pbIdx -1];
              nextLn = lns[lnIdx + 1];
              nextPb = pbs[pbIdx + 1];

              if(lastLn) {
                sylLastPos = `${pbId}_ln${lnIdx}`;
              }
              else if (lastPb) {
                const { pbId: lastPbId, lns: lastLns } = lastPb;
                const lastLnsLen = lastLns.length;
                sylLastPos = `${lastPbid}_ln${lastLnslen}`;
                lastLn = lns[lastLnsLen - 1];
              }

              if (! posStore[sylPrePos]) {
                posStore[sylPrePos] = true;
                lnStore.push(lastLn);
              }

              if (! posStore[sylPos]) {
                posStore[sylPos] = true;
                lnStore.push(ln);
              }
            }
          }
        }
      }
    }
  }
}

