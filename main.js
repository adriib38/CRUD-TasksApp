const { app, BrowserWindow } = require("electron");

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 950,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
  });
  // remove default chromium menu
  mainWindow.setMenu(null);

  mainWindow.loadFile("./index.html");
  // Open the DevTools.
  mainWindow.webContents.openDevTools ()
}

app.on("ready", createWindow);

//app.whenReady().then(createWindow);
