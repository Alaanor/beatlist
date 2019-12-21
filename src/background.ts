import electron, { app, protocol, BrowserWindow } from 'electron';
import { createProtocol, installVueDevtools } from 'vue-cli-plugin-electron-builder/lib';
import path from 'path';
import registerIpc from '@/libraries/ipc';
import DiscordRichPresence from '@/libraries/ipc/DiscordRichPresence';

class Background {
  private static RegisterProtocol() {
    protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }]);
  }

  private win: BrowserWindow | null = null;

  private isDevelopment: boolean = process.env.NODE_ENV !== 'production';

  public Initiate() {
    Background.RegisterProtocol();
    this.SetUpOnReady();
    this.OnDevMode();
  }

  private InitiateWindow(): void {
    this.win = new BrowserWindow({
      width: 1000,
      height: 750,
      minWidth: 1000,
      minHeight: 750,
      frame: false,
      webPreferences: {
        nodeIntegration: true,
      },
      icon: path.join(__dirname, '../public/icon_bold_64.png'),
    });

    this.win.webContents.on('new-window', (e, url) => {
      e.preventDefault();
      electron.shell.openExternal(url);
    });

    if (process.env.WEBPACK_DEV_SERVER_URL) {
      this.win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
      if (!process.env.IS_TEST) {
        this.win.webContents.openDevTools();
      }
    } else {
      createProtocol('app');
      this.win.loadURL('app://./index.html');
    }

    this.win.on('closed', () => {
      this.win = null;
    });
  }

  private SetUpOnReady() {
    app.on('ready', async () => {
      if (this.isDevelopment && !process.env.IS_TEST) {
        try {
          await installVueDevtools();
        } catch (e) {
          console.error('Vue Devtools failed to install:', e.toString());
        }
      }
      this.InitiateWindow();
      Background.SetUpServices();
    });
  }

  private static SetUpServices() {
    registerIpc();

    app.setAsDefaultProtocolClient('beatsaver');

    const richPresence = new DiscordRichPresence();
    richPresence.Initiate();
  }

  private OnDevMode() {
    if (this.isDevelopment) {
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
  }
}

new Background().Initiate();
