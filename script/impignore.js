let fs = require('fs');

function readImpignore(){
	var efiles = fs.readFileSync('.impignore','utf8');
		efiles = efiles.split('\n');
	return efiles;
}

module.exports.readImpignore = readImpignore;