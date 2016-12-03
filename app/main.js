const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const url = require('url')
const spawn = require('child_process').spawn;
const readline = require('readline');
var goprog = {};

let mainWin

function launchMainWin() {
    mainWin = new BrowserWindow();
    mainWin.webContents.openDevTools()
    mainWin.maximize();

    console.log(path.normalize(__dirname + '\\bin\\'));        

    mainWin.loadURL(url.format({
       pathname: path.join(__dirname, 'index.html'),
       protocol: 'file',
       slashes: true
    }));

    startAPI();    

    //handle messages from the renderer
    ipcMain.on('channel1', function(event, arg) {
        //console.log(event, arg);
        execAPICmd(arg);
    });

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

function quit() {
    process.exit(0);
}

function execAPICmd(cmd) {
    goprog.stdin.write(cmd + "\n");    
}

function startAPI() {
    var commandPath = path.normalize(__dirname + '\\bin\\' + 'fake-backend');
    //var commandPath = path.normalize( 'C:\\Dev\\desktop\\electron-builder-sandbox\\build'+ '\\bin\\' + 'fake-backend');
    console.log(commandPath);

    if (process.platform == 'win32') {
        //goprog = spawn('cmd.exe', ['/c', 'scanf']);
        goprog = spawn('cmd.exe', ['/c', commandPath]);
    } else {
        goprog = spawn(commandPath);
    }
    
    goprog.stdin.setEncoding = 'utf-8';

    goprog.stdout.on('data', (data) => {
        console.log('\n',data.toString());            
        mainWin.webContents.send('channel1', data.toString());  //send results of backend call to the renderer       
        if (data.toString().includes('cars')) {
            console.log('tasks was passed in');
            var result = JSON.parse(data.toString().trim());
            console.log(result);
            console.log(result.cars[0].name);
        }        
    });

    goprog.stderr.on('data', (data) => {
        console.log('data error:', data.toString());
    });

    goprog.on('exit', (exitcode) => {
        console.log('exit code:', exitcode);
    });
}