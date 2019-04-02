const taishoInfos = require('./taishoInfos.json');

export default function addCid2json(json) {
  let taishoIdByName = getTaiShoIdByName(taishoInfos);

  json.divisions.forEach((division) => {
    division.sutras.forEach((sutraObj) => {
      var cids = [];
      var cnameStr = sutraObj.cname;

      if (cnameStr !== '') {
        cnameStr.replace(/《(.+?)》/g, (m, cname) => {
          if (taishoIdByName[cname]) {
            cids.push(taishoIdByName[cname]);
          }
          else {
            console.log('no ', cname, 'in Taisho');
          }
        });
      }
      sutraObj.cid = cids.join(',');
    });
  });
  return json;
}

function getTaiShoIdByName(taishoInfos) {
  let result = {};
  taishoInfos.forEach((obj) => {
    var taishoName = obj.taishoName.replace(/\(.*?\)/g, '').replace(/\[卄\/幹\]/g, '𦼮');
    var taishoId = obj.taishoId;
    result[taishoName] = taishoId;
  });
  return result;
}