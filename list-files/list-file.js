var folder = process.argv[2];

var fs = require('fs');
var Path = require('path');

fs.readdir('./' + folder, function(err, files) {
  fs.writeFileSync('./list-' + folder + '.txt', files.join('\n'), 'utf8');
});