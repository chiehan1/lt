var glob = require('glob');
var fs = require('fs');
var naturalSort = require('javascript-natural-sort');
var pages = {};

glob.sync('./degetengyur/degetengyur*/*.xml')
  .sort(naturalSort)
  .forEach(function(route) {
    var text = fs.readFileSync(route, 'utf8');
    pbs = text.replace(/<pb id/g, '~!@#$<pb id').split('~!@#$');
    pbs.forEach(function(pb) {
      var hasPb = /<pb id="(.+?)-(\d+?)-(.+?)"/.test(pb);
      if ()
      lines = pb.split('\n');
      lines.forEach(function(line) {

      });
    });
  });

var json = fs.readFileSync('./degetengyur-biography.json');

