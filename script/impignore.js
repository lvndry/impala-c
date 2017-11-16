let fs = require('fs');

function readImpignore(){
	if(fs.existsSync(filePath + '.impignore')){
		var efiles = fs.readFileSync('.impignore','utf8');
			efiles = efiles.split('\n');
			return efiles;
		}
}
module.exports.readImpignore = readImpignore;
