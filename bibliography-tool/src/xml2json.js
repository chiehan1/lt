import sutraProps from './sutraProps.js';

export default function xml2json(xml) {
  return getObjNameAndSubObjs(xml, 'categoryName', 'divisions', getDivisions);
}

function getObjNameAndSubObjs(str, objName, subName, getSubF) {
  let result = {};
  result[objName] = getTagValue(objName, str);
  result[subName] = getSubF(str);
  return result;
}

function getTagValue(tagName, str) {
  let tagRegex = new RegExp('<' + tagName + '>(.*?)<\\/' + tagName + '>');
  let matchedResult = str.match(tagRegex);

  if (matchedResult) {
    let value = matchedResult[1].trim();
    let isDigitalValue = value.match(/^-?\d+$/);

    return isDigitalValue ? Number(value) : value;
  }
  else {
    return '';
  }
}

function getDivisions(str) {
  let divisionStrs = splitStr('<divisionName>', str);
  return divisionStrs.map((divisionStr) => {
    return getObjNameAndSubObjs(divisionStr, 'divisionName', 'sutras', getSutras);
  });
}

function splitStr(splitPoint, str) {
  let delim = '~!!@#$%';
  let splitRegex = new RegExp(splitPoint, 'g');
  return str.replace(splitRegex, delim + splitPoint)
    .split(delim)
    .slice(1);
}

function getSutras(divisionStr) {
  let sutraStrs = splitStr('<sutra>', divisionStr);
  return sutraStrs.map((sutraStr) => {
    return getSutra(sutraStr);
  });
}

function getSutra(sutraStr) {
  let sutraObj = {};
  sutraProps.forEach((tagName) => {
    sutraObj[tagName] = getTagValue(tagName, sutraStr);
  });
  return sutraObj;
}