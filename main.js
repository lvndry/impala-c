const electron = require('electron');
const path = require('path');
const url = require('url');
const shell = require('shelljs');
shell.config.execPath = '/usr/bin/node'; //Node binary is needed to execute shell scripts

const app = electron.app
const BrowserWindow = electron.BrowserWindow
const ipc = electron.ipcMain;

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({width: 800, height: 600})

  mainWindow.loadURL(`file://${__dirname}/index.html`)

  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function() {
    mainWindow = null
  })
}

//Load the page depending on what language is chosen
ipc.on('compile:language', function(state, lang){
  let renderer = 'templates/' + lang + '.html';

  mainWindow.loadURL(url.format({
    pathname : path.join(__dirname, renderer),
    protocol: 'file:',
    slashes: true
  }));
});

app.on('ready', createWindow)

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function() {
  if (mainWindow === null) {
    createWindow()
  }
})

//shell.exec('gcc test/test.c');
//shell.exec('./a.out');
