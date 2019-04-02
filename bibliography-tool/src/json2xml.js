import sutraProps from './sutraProps.js';
const RN = '\r\n';

export default function json2xml(json) {
  let xml = reduceJson2Array(json).join(RN);
  return {
    'categoryName': json.categoryName,
    'xml': xml
  }
}

function reduceJson2Array(json) {
  let arr = [];
  arr.push(tagging('categoryName', json.categoryName));

  json.divisions.forEach((division) => {
    arr.push(RN + tagging('divisionName', division.divisionName));

    division.sutras.forEach(function(sutra, i) {
      arr.push(RN + '<sutra>')

      sutraProps.forEach(function(sutraProp) {
        var value = sutra[sutraProp];
        if ('number' === typeof value) {
          value = String(value);
        }
        arr.push(tagging(sutraProp, value || ''));
      });

      arr.push('</sutra>');
    });
  });
  return arr;
}

function tagging(tagName, str) {
  return '<' + tagName + '>' + str + '</' + tagName + '>';
}