var fileName = process.argv[2];
var fs = require('fs');
var json = require('./' + fileName);

json.divisions.forEach(function(division) {
  division.sutras.forEach(function(sutra) {
    var since = sutra.since.trim();
    var until = sutra.until.trim();
    sutra.hasSince = 0;
    sutra.hasUntil = 0;

    if ('' === since) {
      sutra.since = 0;
    }
    else if (/B\.C\./.test(since)) {
      sutra.since = - Number(/\d+/.exec(since)[0]);
      sutra.hasSince = 1;
    }
    else if (/A\.D\./.test(since)) {
      sutra.since = Number(/\d+/.exec(since)[0]);
      sutra.hasSince = 1;
    }
    else {
      console.log(sutra.sutraid);
    }

    if ('' === until) {
      sutra.until = 0;
    }
    else if (/B\.C\./.test(until)) {
      sutra.until = - Number(/\d+/.exec(until)[0]);
      sutra.hasUntil = 1;
    }
    else if (/A\.D\./.test(until)) {
      sutra.until = Number(/\d+/.exec(until)[0]);
      sutra.hasUntil = 1;
    }
    else {
      console.log(sutra.sutraid);
    }
  });
});

fs.writeFile('./new-' + fileName, JSON.stringify(json, null, '  '), 'utf8');