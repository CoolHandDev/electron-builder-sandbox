const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')

let mainWin

function launchMainWin() {
    mainWin = new BrowserWindow();
    mainWin.maximize();

    mainWin.loadURL(url.format({
       pathname: path.join(__dirname, 'index.html'),
       protocol: 'file',
       slashes: true
    }));

    mainWin.on('closed', () => {
        mainWin = null;
    });
}

app.on('ready', launchMainWin);

app.on('activate', () => {
    if (mainWin == null) {
        launchMainWin();
    }
});

app.on('window-all-closed', () => {
    if (process.platform == 'darwin') {
        app.quit();
    }
});

