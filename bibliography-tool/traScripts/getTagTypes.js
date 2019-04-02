let route = process.argv[2];
let tagRegex = /<([a-zA-Z]+?)>/g;

import fs from 'fs';

let xml = fs.readFileSync(route, 'utf8');

let tagTypes = {};

xml.replace(tagRegex, (m, m1) => {
  if (! tagTypes[m1]) {
    tagTypes[m1] = true;
  }
});

console.log(tagTypes);