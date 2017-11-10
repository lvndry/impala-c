require('../config.js');

function createMakeFile(compiler){
	shell.exec("printf 'CC=" + compiler + "\nCFLAGS= -O3 -Wall\n' > makefile");
	return;
}