var fs = require('fs');
var json = require('../degetengyur-biography.json');

var vol = '';

json.divisions.forEach(function(div) {
  var divisionName = div.divisionName;
  div.sutras.forEach(function(sutra) {
    sutra.classification = divisionName;
    if (sutra.vol) {
      vol = sutra.vol;
    }
    sutra.vol = vol;
  });
});

fs.writeFileSync('../new-degetengyur-biography.json', JSON.stringify(json, null, '  '), 'utf8');