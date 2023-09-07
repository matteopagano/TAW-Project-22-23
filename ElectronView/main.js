const { app, BrowserWindow } = require('electron');

app.commandLine.appendSwitch('disable-web-security');
app.commandLine.appendArgument('--allow-file-access-from-files');

function createWindow() {
    const win = new BrowserWindow();
    win.setFullScreen(true);
    win.loadURL('http://localhost');
  }
  
app.whenReady().then(createWindow);
