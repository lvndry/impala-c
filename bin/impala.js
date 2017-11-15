#!/usr/bin/env node
var main = path.join(__dirname, '../main.js');
var shell = require('shelljs')

shell.exec('electron ' + main);