const glob = require('glob');
const path = require('path');
const fs = require('fs');

export function getData(dir, fileType) {
  var routes = glob.sync(dir + '/**/*.*(json|xml)');
  checkFileType(routes, fileType, dir);
  return routes.map(getFile.bind(null, fileType));
}

export function makeFile(dir, fileType, data) {
  let route, output;
  if ('json' === fileType) {
    route = dir + '/' + data.categoryName + '-bibliography.json';
    output = JSON.stringify(data, '', '  ');
  }
  else {
    route = dir + '/' + data.categoryName + '-bibliography.xml';
    output = data.xml;
  }
  fs.writeFileSync(route, output, 'utf8');
}

function checkFileType(routes, fileType, dir) {
  routes.forEach(function(route) {
    var ext = path.extname(route).slice(1);
    if (ext !== fileType) {
      throw 'Only ' + fileType + ' file can be put in ' + dir;
    }
  });
}

function getFile(fileType, route) {
  if ('json' === fileType) {
    return require(path.resolve(route));
  }
  else {
    return fs.readFileSync(route, 'utf8');
  }
}