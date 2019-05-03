import fs from 'fs';
import glob from 'glob';
import { toCSV as json2csv } from 'csvjson';
import naturalSort from 'javascript-natural-sort';

const dbNames = ['jiangkangyur', 'degekangyur', 'degetengyur', 'gampopa', '8thkarmapa', 'mipam', 'tsongkhapa', 'gorampa', 'taranatha', 'bonpokangyur'];

const hasStack = (str) => {
  return /[\u0f71\u0f84\u0f8d-\u0f92\u0f94-\u0f9c\u0f9e-\u0fa1\u0fa3-\u0fa6\u0fa8-\u0fab\u0fae-\u0fb0\u0fb3-\u0fb8\u0fba-\u0fbc]{2,}/.test(str.normalize('NFKD'));
};

const getStacks = () => {
  let sylMap = {};
  let result = [''];

  dbNames.forEach(dbName => {
    const fileRoutes = glob.sync(`../../${dbName}/${dbName}*/${dbName}*.xml`)
      .sort(naturalSort);

    fileRoutes.forEach(route => {
      const xml = fs.readFileSync(route, 'utf8');
      
      if (hasStack(xml)) {
        xml.replace(/<pb/g, '!@#$%<pb').split('!@#$%')
          .filter(pb => hasStack(pb))
          .forEach(pb => {
            const pbId = /<pb id="(.+?)"/.exec(pb)[1];
            const pbText = pb.replace(/<[^>]*?>/g, '').trim();

            pbText.split(/[\r\n]+?/)
              .foreach(line, lineN => {
                const lines = line.split(/[\u0f00\u0f15-\u0f39\u0f3e-\u0fd2\u0fd5-\u0fd8]+/g);

                lines.filter(line => hasStack(line))
                  .forEach(syl => {
                    if (hasStack(syl)) {
                      const resultIndex = sylMap[syl];

                      if (resultIndex) {
                        result[resultIndex].positions += `\n${kdbName} ${pbId} line${lineN}`);
                        return;
                      }

                      const newResultIndex = result.length;
                      result[newResultIndex].push({
                        syl
                        positions: `${kdbName} ${pbId} line${lineN}`
                      });
                      sylMap[syl] = newResultIndex;
                    }
                  });
              });
          });
      }
    });
  });

  const resultCsv = json2csv(result);

  fs.writeFileSync('./result.csv', resultCsv, 'utf8');
};

getStacks();
