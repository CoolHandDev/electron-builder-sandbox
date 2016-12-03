const {ipcRenderer} = require('electron');

//handle messages from main process
ipcRenderer.on('channel1', function(event, arg) {
    console.log(arg);
})

//send a command to back end
ipcRenderer.send('channel1', '/tasks');

//function we can call on devtool to send command to back end
var sendCommand = function(cmd) {
    ipcRenderer.send('channel1', cmd);
}