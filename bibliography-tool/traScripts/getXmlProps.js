const inputDir = process.argv[2] || './srcXml';
const outputDir = './resultJson';
const props = ['subject', 'yana'];

import fs from 'fs';
import glob from 'glob';

getXmlProps(inputDir);

async function getXmlProps(inputDir) {
  let xmls = await getXmls(inputDir);
  let categoryNames = [];
  let jsons = xmls.map((xml) => {
    categoryNames.push(getTagValue('categoryName', xml));
    return makePartialJson(xml);
  });
  jsons.forEach((json, i) => {
    let outputRoute = outputDir + '/' + categoryNames[i] + '-biography.json';
    fs.writeFile(outputRoute, JSON.stringify(json,'', '  '), 'utf8', (err) => {
      if (err) {
        console.log(err);
      }
    });
  });
}

async function getXmls(inputDir) {
  let globPatt = inputDir + '/**/*.xml';
  let xmls = [];
  let routes = await new Promise((resolve) => {
    glob(globPatt, (err, routes) => {
      resolve(routes);
    });
  });

  for (let i = 0; i < routes.length; i++) {
    let xml = await new Promise((resolve) => {
      fs.readFile(routes[i], 'utf8', (err, data) => {
        resolve(data);
      });
    });
    xmls.push(xml);
  }
  return xmls;
}

function makePartialJson(xml) {
  let json = {};
  xml.replace(/<sutra>[\s\S]+?<\/sutra>/g, (sutraStr) => {
    let sutraid = getTagValue('sutraid', sutraStr);
//    let subject = getTagValue('subject', sutraStr);
//    let yana = getTagValue('yana', sutraStr);
//    let chakra = getTagValue('chakra', sutraStr);
    let repeat = getRepeat(sutraStr);
//    json[sutraid] = {'subject': subject, 'yana': yana, 'repeat': repeat, 'chakra': chakra};
    json[sutraid] = {'repeat': repeat};
  });
  return json;
}

function getTagValue(tagName, str) {
  let tagRegex = new RegExp('<' + tagName + '>(.*?)<\\/' + tagName + '>');
  let matchedResult = str.match(tagRegex);

  if (matchedResult) {
    let value = matchedResult[1].trim();
    let isDigitalValue = value.match(/^\d+$/);

    return isDigitalValue ? Number(value) : value;
  }
  else {
    return '';
  }
}

function getRepeat(str) {
  let regex = /<\/sutraid> *?\((.+?)\)/;
  let match = str.match(regex);
  if (match) {
    let repeats = match[1].replace(/ /g, '');
    return repeats;
  }
  else {
    return '';
  }
}