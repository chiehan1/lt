const route = process.argv[2];
const fs = require('fs');
const path = require('path');
const json = require(route);

json.divisions.forEach(function(division) {
  division.sutras.forEach(function(sutra) {
    sutra.topic = sutra.classification;
    sutra.school = sutra.lineage;

    delete sutra.classification;
    delete sutra.lineage;
    delete sutra.lehu;
    delete sutra.sloka;
    delete sutra.transmission;
    delete sutra.scribe;
    delete sutra.since;
    delete sutra.until;
    delete sutra.hasSince;
    delete sutra.hasUntil;

    var age = sutra.age;
    if (age.match(/B\.C\./)) {
      sutra.age = '500 B.C. ~ 1 B.C.';
    }
    else if (age.match(/A\.D\./)) {
      var startYear = Number(age.match(/\d+/)[0]);

      if (startYear <= 500) {
        sutra.age = 'A.D. 1 ~ 500';
      }
      else if (startYear <= 1000) {
        sutra.age = 'A.D. 501 ~ 1000';
      }
      else if (startYear <= 1500) {
        sutra.age = 'A.D. 1001 ~ 1500';
      }
      else {
        sutra.age = 'A.D. 1501 ~ 2000';
      }
    }
    else {
      sutra.age = '';
    }
  });
});

const fileName = path.basename(route).replace('bibliography', 'biography');

fs.writeFileSync('../../karmapa-biography-json/' + fileName, JSON.stringify(json, null, '  '), 'utf8');