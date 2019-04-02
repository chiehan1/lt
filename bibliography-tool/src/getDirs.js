const dirs = getDirs();
const srcJsonDir = dirs[0] || './srcJson';
const srcXmlDir = dirs[0] || './srcXml';
const resultJsonDir = dirs[1] || './resultJson';
const resultXmlDir = dirs[1] || './resultXml';

function getDirs() {
  return process.argv.filter(function(argv) {
    return ! /^-/.test(argv);
  })
  .slice(2);
}

export {srcJsonDir, srcXmlDir, resultJsonDir, resultXmlDir};