import fs from 'fs';
import glob from 'glob';
import { Parser } from 'json2csv';
import naturalSort from 'javascript-natural-sort';

const fields = [
  { label: '疊字', value: 'syl' },
  { label: '麗江甘珠爾\njiangkangyur', value: 'jiangkangyur' },
  { label: '德格甘珠爾\ndegekangyur', value: 'degekangyur' },
  { label: '拉薩甘珠爾\nlhasakangyur', value: 'lhasakangyur' },
  { label: '德格丹珠爾\ndegetengyur', value: 'degetengyur' },
  { label: '岡波巴大師全集\ngampopa', value: 'gampopa' },
  { label: '第八世法王全集\n8thkarmapa', value: '8thkarmapa' },
  { label: '局米旁大師全集\nmipam', value: 'mipam' },
  { label: '宗喀巴大師全集\ntsongkhapa', value: 'tsongkhapa' },
  { label: '果然巴大師全集\ngorampa', value: 'gorampa' },
  { label: '多羅那他大師全集\ntaranatha', value: 'taranatha' },
  { label: '苯教藏經\nbonpo', value: 'bonpokangyur' }
];

const json2csv = new Parser({ fields });

const dbNames = [ 'jiangkangyur', 'degekangyur', 'lhasakangyur', 'degetengyur', 'gampopa', '8thkarmapa', 'mipam', 'tsongkhapa', 'gorampa', 'taranatha', 'bonpokangyur'];

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
      
      if (! hasStack(xml)) {
        console.log(`${route} done`);
        return;
      }

      xml.replace(/^.+?<pb/s, '<pb')
        .replace(/<pb/g, '!@#$%<pb').split('!@#$%')
        .filter(pb => hasStack(pb))
        .forEach(pb => {

          const pbId = /<pb id="(.+?)"/.exec(pb)[1];
          const pbText = pb.replace(/<[^>]*?>/g, '').trim();

          pbText.split(/[\r\n]+/)
            .forEach((line, lineN) => {

              if (! hasStack(line)) {
                return;
              }

              const syls = line.match(/[\u0f00\u0f15-\u0f39\u0f3e-\u0fd2\u0fd5-\u0fd8]+/g);

              syls.forEach(syl => {

                if (! hasStack(syl)) {
                  return;
                }

                const resultIndex = sylMap[syl];

                if (resultIndex) {
                  const position = `${pbId} ln${lineN + 1}`;
                  const existedDbField = result[resultIndex][dbName];

                  if (! existedDbField) {
                    result[resultIndex][dbName] = position;
                    return;
                  }

                  if (! existedDbField.includes(position)) {
                    result[resultIndex][dbName] += `, ${position}`;
                  }

                  return;
                }

                result.push({
                  syl,
                  [dbName]: `${pbId} ln${lineN + 1}`
                });
                sylMap[syl] = result.length - 1;  
              });
            });
        });
      console.log(`${route} done`);
    });
  });

  result.shift();

  const resultCsv = json2csv.parse(result);

  fs.writeFileSync('./result.csv', resultCsv, 'utf8');
};

getStacks();
