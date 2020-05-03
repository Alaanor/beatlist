import electron, {
  app,
  protocol,
  BrowserWindow,
} from "electron";
import {
  createProtocol,
  installVueDevtools,
} from "vue-cli-plugin-electron-builder/lib";
import path from "path";
import registerIpc from "@/libraries/ipc";

class Background {
  private win: BrowserWindow | null = null;

  private isDevelopment: boolean = process.env.NODE_ENV !== "production";

  public Initiate() {
    Background.Setup();
    this.SetUpOnReady();
    this.OnDevMode();
  }

  private static Setup(): void {
    protocol.registerSchemesAsPrivileged([
      { scheme: "app", privileges: { secure: true, standard: true } },
    ]);

    app.allowRendererProcessReuse = false;
  }

  private async InitiateWindow(): Promise<void> {
    this.win = new BrowserWindow({
      width: 1000,
      height: 750,
      minWidth: 1000,
      minHeight: 750,
      frame: false,
      webPreferences: {
        nodeIntegration: true,
      },
      icon: path.join(__dirname, "../public/icon_bold_64.png"),
      backgroundColor: "#303030",
    });

    this.win.webContents.on("new-window", (e, url) => {
      e.preventDefault();
      electron.shell.openExternal(url);
    });

    if (process.env.WEBPACK_DEV_SERVER_URL) {
      await this.win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
      if (!process.env.IS_TEST) {
        this.win.webContents.openDevTools();
      }
    } else {
      createProtocol("app");
      await this.win.loadURL("app://./index.html");
    }

    this.win.on("closed", () => {
      this.win = null;
    });
  }

  private SetUpOnReady() {
    app.on("ready", async () => {
      if (this.isDevelopment && !process.env.IS_TEST) {
        try {
          await installVueDevtools();
        } catch (e) {
          console.error("Vue Devtools failed to install:", e.toString());
        }
      }

      await this.InitiateWindow();
      Background.SetUpServices();
    });
  }

  private static SetUpServices() {
    registerIpc();

    app.setAsDefaultProtocolClient("beatsaver");
  }

  private OnDevMode() {
    if (this.isDevelopment) {
      if (process.platform === "win32") {
        process.on("message", (data) => {
          if (data === "graceful-exit") {
            app.quit();
          }
        });
      } else {
        process.on("SIGTERM", () => {
          app.quit();
        });
      }
    }
  }
}

new Background().Initiate();
