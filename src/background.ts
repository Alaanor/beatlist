'use strict';

import {app, protocol, BrowserWindow} from 'electron';
import ipcEventRegister from './lib/ipc';
import {
  createProtocol,
  installVueDevtools,
} from 'vue-cli-plugin-electron-builder/lib';
import path from 'path';
import DiscordRichPresence from './lib/ipc/DiscordRichPresence';
import BeatsaverLinkOpener from './lib/ipc/BeatsaverLinkOpener';

const isDevelopment = process.env.NODE_ENV !== 'production';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: BrowserWindow | null;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{scheme: 'app', privileges: {secure: true, standard: true}}]);

// force single instance
const primaryInstance = app.requestSingleInstanceLock();

if (!primaryInstance) {
  app.quit();
} else {
  app.on('second-instance', (event, commmandLine, workingDirectory) => {
    if (win) {
      if (win.isMinimized()) {
        win.restore();
      }

      win.focus();
      BeatsaverLinkOpener.SendArgvSecondInstance(commmandLine);
    }
  });
}

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1000, height: 750,
    minWidth: 1000, minHeight: 750,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
    },
    icon: path.join(__dirname, '../public/icon_bold_64.png'),
  });

  // Open target="__blank" link to the browser instead of this app
  win.webContents.on('new-window', (e, url) => {
    e.preventDefault();
    require('electron').shell.openExternal(url);
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
    if (!process.env.IS_TEST) {
      win.webContents.openDevTools();
    }
  } else {
    createProtocol('app');
    // Load the index.html when not in development
    win.loadURL('app://./index.html');
  }

  win.on('closed', () => {
    win = null;
  });
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installVueDevtools();
    } catch (e) {
      // tslint:disable-next-line:no-console
      console.error('Vue Devtools failed to install:', e.toString());
    }
  }
  createWindow();
  ipcEventRegister();
  app.setAsDefaultProtocolClient('beatsaver');
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }
}

// Initiate the discord rich presence service
const richPresence = new DiscordRichPresence();
richPresence.Initiate();
