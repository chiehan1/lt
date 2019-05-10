const dbName = process.argv[2];
const pbInsertPointRegex = /^@$/mg;

const fs = require('fs');
const glob = require('glob');
const naturalSort = require('javascript-natural-sort');

const unreadableRegex = /^<\?xml/;
let insertEmptyPb = false;

let preVolN;
let prePbN = 0;

glob
  .sync(`../../${dbName}/${dbName}*/${dbName}*.xml`)
  .sort(naturalSort)
  .forEach(route => {

    let fileVolN = new RegExp(`${dbName}(\\d+)`).exec(route)[1];
    fileVolN = Number(fileVolN);

    if (!preVolN) {
      preVolN = fileVolN;
    }

    if (fileVolN !== preVolN) {
      prePbN = 0;
      insertEmptyPb = false;
    }

    preVolN = fileVolN;

    let xml = fs.readFileSync(route, 'utf8')
      .replace(/^\uFEFF/, '');

    if (unreadableRegex.test(xml)) {
      insertEmptyPb = true;
      console.log(`Wrong text! ${route}`);
      return;
    }

    if (!pbInsertPointRegex.test(xml)) {
      console.log(`No pb insert point! ${route}`);
      insertEmptyPb = true;
      return;
    }

    if (insertEmptyPb) {
      xml = xml.replace(pbInsertPointRegex, '<pb id=""/>');
    }

    xml = xml.replace(pbInsertPointRegex, m => {
      return `<pb id="${fileVolN}-1-${++prePbN}"/>`;
    });

    fs.writeFileSync(route, xml, 'utf8');
    console.log(`${route} done`);
  });
