var fileName = process.argv[2];
var fs = require('fs');
var json = require('./' + fileName);

json.divisions.forEach(function(division) {
  division.sutras.forEach(function(sutra) {
    var age = sutra.age.replace(/\(.+?\)/g, '').trim();
    var since = 0, until = 0, hasSince = 0, hasUntil = 0;

    if (/(B\.C|A\.D)/.test(age)) {
      var bcExist = /B\.C/.test(age);
      var adExist = /A\.D/.test(age);
      var ageNums = age.match(/\d+/g)
        .map(function(age) {
          if (/^0/.test(age)) {
            console.log(sutra.sutraid);
          }
          return Number(age);
        });

      if (ageNums.length !== 2 && ageNums.length !== 1) {
        console.log(sutra.sutraid);
      }

      if (bcExist && ! adExist) {
        since = - Math.max.apply(null, ageNums);
        until = - Math.min.apply(null, ageNums);
        hasSince = 1;
        hasUntil = 1;
      }
      else if (adExist && ! bcExist) {
        since = Math.min.apply(null, ageNums);
        until = Math.max.apply(null, ageNums);
        hasSince = 1;
        hasUntil = 1;
      }
      else if (adExist && bcExist) {
        since = - Number(/(\d+) B\.C\./.exec(age)[1]);
        until = Number(/A\.D\. (\d+)/.exec(age)[1]);
        hasSince = 1;
        hasUntil = 1;
      }
      else {
        console.log(sutra.sutraid);
      }
    }

    sutra.since = since;
    sutra.until = until;
    sutra.hasSince = hasSince;
    sutra.hasUntil = hasUntil;
  });
});

fs.writeFile('./new-' + fileName, JSON.stringify(json, null, '  '), 'utf8');