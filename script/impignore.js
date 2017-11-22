let fs = require('fs');

function readImpignore(){
  if (fs.existsSync('.impignore')) {
    var efiles = fs.readFileSync('.impignore', 'utf8');
    efiles = efiles.split('\n');
    return efiles;
  }
  return [];
}
module.exports.readImpignore = readImpignore;
