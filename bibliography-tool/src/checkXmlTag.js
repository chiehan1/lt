import sutraProps from './sutraProps.js';
const notCheckedTags = [];
let errValue;

export default function checkXmlTag(xml) {
  let categoryName = getTagValueAndCheckOnly('categoryName', xml);
  showErr(categoryName);

  checkNonClosingTag(xml, categoryName);
  checkUnPairedTag('sutra', xml, categoryName);
  checkWrongPairedTag(xml);

  let noSutraPropXml = checkSutraProp(xml, categoryName)
    .replace(/(\r?\n){2,}/g, '\n')
    .replace(/(\s*(<sutra><\/sutra>)){2,}/g, '\n$2');

  checkDivision(noSutraPropXml, categoryName);

  if (errValue) {
    throw new Error('Xml Tag Error');
  }
}

function checkNonClosingTag(str, strName) {
  const nonClosingTag = /((<[^>]*?(<|$))|(^|>)[^<]*?>)/mg;
  let matches = str.match(nonClosingTag);
  if (matches) {
    showErr('Err tag format.', strName, matches.join('\r\n'));
  }
}

function getTagValueAndCheckOnly(tagName, str, tagRegex) {
  if (! tagRegex) {
    tagRegex = new RegExp('<' + tagName + '>.*?<\\/' + tagName + '>', 'g');
  }
  let valueRegex = new RegExp('<' + tagName + '>(.*?)<\\/' + tagName + '>');
  let matches = str.match(tagRegex) || [];
  let matchesN = matches.length;

  if (1 !== matchesN) {
    let errMessage;
    if (0 === matchesN) {
      errMessage = 'Err No ' + tagName + ' tag.';
    }
    else {
      errMessage = 'Err Many ' + tagName + ' tag.';
    }
    return errMessage;
  }
  else {
    return str.match(valueRegex)[1];
  }
}

function showErr(str) {
  if (-1 !== str.indexOf('Err')) {
    console.log.apply(null, arguments);
    errValue = true;
  }
}

function checkUnPairedTag(tagName, str, strName) {
  let nonEndingTag = new RegExp('<' + tagName + '>(?!<\\/' + tagName + '>)([\\s\\S](?!<\\/' + tagName + '>))*?(<' + tagName + '>|$)', 'g');
  let nonStartingTag = new RegExp('(<\\/' + tagName + '>|^)(?!<' + tagName + '>)([\\s\\S](?!<' + tagName + '>))*?<\\/' + tagName + '>', 'g');
  let unPairedTag = (str.match(nonEndingTag) || []).concat(str.match(nonStartingTag) || []);
  unPairedTag.forEach((str) => {
    showErr('Err UnPairedTag:', str);
  });
}

function checkWrongPairedTag(str) {
  const wrongPairedRegex = str.match(/<([^\n>]+?)>.+?<\/(?!\1)[^\n>]+?>/g) || [];
  wrongPairedRegex.forEach(str => showErr('Err WrongPairedTag:', str));
}

function checkSutraProp(str, categoryName) {
  let tagsInSutra = sutraProps.slice(0);
  let sutraRegex = /<sutra>[\s\S]*?<\/sutra>/g
  let sutraIdRegex = /<sutraid>([^<>]+?)<\/sutraid>/g;
  let lastSutraId = 'firstSutra';

  notCheckedTags.forEach((tag) => {
    tagsInSutra = deleteArrItem(tagsInSutra, tag);
  });

  let noSutraPropXml = str.replace(sutraRegex, (sutraStr) => {
    let sutraId = getTagValueAndCheckOnly('sutraid' ,sutraStr, sutraIdRegex);
    showErr(sutraId, categoryName, 'lastSutraId', lastSutraId);

    tagsInSutra.forEach((tag) => {
      let tagValue = getTagValueAndCheckOnly(tag, sutraStr);
      showErr(tagValue, categoryName, sutraId);
    });

    lastSutraId = sutraId;
    return '<sutra></sutra>';
  });

  return noSutraPropXml;
}

function deleteArrItem(arr, item) {
  let index = arr.indexOf(item);
  return arr.slice(0, index).concat(arr.slice(index + 1));
}

function checkDivision(str, strName) {
  checkUnPairedTag('divisionName', str, strName);
  let divisionRegex = /<divisionName>(.*?)<\/divisionName>/;
  let delim = '~!@#$%';
  let divisionStrs = str.replace(/(<divisionName>)/g, delim + '$1')
    .split(delim)
    .slice(1);

  if (0 === divisionStrs.length) {
    showErr('Err No divisionName tag.', strName);
  }

  divisionStrs.forEach((divisionStr) => {
    let divisionMatch = divisionStr.match(divisionRegex);
    let sutra = getTagValueAndCheckOnly('sutra', divisionStr);
    showErr(sutra, strName, 'divisionName', divisionMatch[1] || divisionMatch[0]);
  });
}