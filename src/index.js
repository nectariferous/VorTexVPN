const { app, BrowserWindow, Tray, Menu } = require('electron');
const path = require('path');
const vpnManager = require('./vpnManager');
const webFilter = require('./webFilter');
const logger = require('./logger');

let tray = null;
let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('src/ui/index.html');
}

function createTray() {
  tray = new Tray(path.join(__dirname, 'assets', 'tray-icon.png'));
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Connect', click: () => vpnManager.connect() },
    { label: 'Disconnect', click: () => vpnManager.disconnect() },
    { label: 'Quit', click: () => app.quit() }
  ]);
  tray.setToolTip('VorTex Cybersecurity');
  tray.setContextMenu(contextMenu);
}

app.whenReady().then(() => {
  createWindow();
  createTray();
  
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
