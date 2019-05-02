import fs from 'fs';
import glob from 'glob';
import naturalSort from 'javascript-natural-sort';

const dbNames = ['jiangkangyur', 'degekangyur', 'degetengyur', 'gampopa', '8thkarmapa', 'mipam', 'tsongkhapa', 'gorampa', 'taranatha', 'bonpokangyur'];

const hasStack = (str) => {
  return /[\u0f71\u0f84\u0f8d-\u0f92\u0f94-\u0f9c\u0f9e-\u0fa1\u0fa3-\u0fa6\u0fa8-\u0fab\u0fae-\u0fb0\u0fb3-\u0fb8\u0fba-\u0fbc]{2,}/.test(str.normalize('NFKD'));
};

const getStacks = () => {
  const result = {};

  dbNames.forEach(dbName => {
    const fileRoutes = glob.sync(`../../${dbName}/${dbName}*/${dbName}*.xml`)
      .sort(naturalSort);

    fileRoutes.forEach(route => {
      const xml = fs.readFileSync(route, 'utf8');
      
      if (hasStack(xml)) {
        xml.replace(/<pb/g, '!@#$%<pb').split('!@#$%')
          .filter(pb => hasStack(pb))
          .map(pb => {
            const pbId = /<pb id="(.+?)"/.exec(pb)[1];
            const pbText = pb.replace(/<[^>]*?>/g, '').trim();
            const lines = pbText.split(/[\r\n]+?/)
              .map(line, i => {
                const stacks = ;
              });
          });
      }
    });
  });
};

//getStacks();
