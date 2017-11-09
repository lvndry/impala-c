require('../config.js');

function createMakeFile(){
	shell.exec("printf 'CC=gcc\nCFLAGS= -O3 -Wall\n' > makefile");
	return;
}