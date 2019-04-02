import {getAction, getProps} from './processArgv.js';
import {srcJsonDir, srcXmlDir, resultJsonDir, resultXmlDir} from './getDirs.js';
import {getData, makeFile} from './processFiles.js';
import {json2xml, checkXmlTag, xml2json, addCid2json} from './main.js';

switch (getAction()) {
  case 'json2xml':
    getData(srcJsonDir, 'json').map(json2xml)
      .forEach(makeFile.bind(null, resultXmlDir, 'xml'));
    break;
  case 'checkxml':
    getData(srcXmlDir, 'xml').forEach(checkXmlTag);
    break;
  case 'xml2json':
    getData(srcXmlDir, 'xml').map(xml2json)
      .forEach(makeFile.bind(null, resultJsonDir, 'json'));
    break;
  case 'addcid2json':
    getData(srcJsonDir, 'json').map(addCid2json)
      .forEach(makeFile.bind(null, resultJsonDir, 'json'));
    break;
  default:
    throw 'node index.js -[json2xml, xml2json, addcid, checkxml, renewprop --[props]]';
}