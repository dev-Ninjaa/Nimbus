const {app, BrowserWindow} = require('electron');
const path = require('path');

console.log('Starting test app...');
console.log('__dirname:', __dirname);
console.log('app.getAppPath():', app.getAppPath());

app.whenReady().then(() => {
  console.log('App ready!');
  
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  
  const htmlPath = path.join(__dirname, 'app', 'index.html');
  console.log('Loading:', htmlPath);
  
  win.webContents.openDevTools();
  
  win.loadFile(htmlPath).then(() => {
    console.log('HTML loaded successfully!');
  }).catch(err => {
    console.error('Failed to load HTML:', err);
  });
  
  win.webContents.on('did-finish-load', () => {
    console.log('did-finish-load event fired');
  });
  
  win.webContents.on('console-message', (event, level, message, line, sourceId) => {
    console.log(`RENDERER [${level}]: ${message}`);
  });
});
