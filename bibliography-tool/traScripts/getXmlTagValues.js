let route = process.argv[2];
let targetTags = process.argv.slice(3);

import fs from 'fs';

let xml = fs.readFileSync(route, 'utf8');

targetTags.forEach(getTagValueTypes.bind(null, xml));

function getTagValueTypes(xml, tagName) {
  let tagValueTypes = {};
  let tagRegex = new RegExp('<' + tagName + '>([\\s\\S]*?)<\/' + tagName + '>', 'g');

  xml.replace(tagRegex, (m, tagValue) => {
    tagValue = tagValue.trim();

    if (! tagValueTypes[tagValue]) {
      tagValueTypes[tagValue] = true;
    }
  });

  console.log({tagName: tagName, tagValueTypes: Object.keys(tagValueTypes)});
}