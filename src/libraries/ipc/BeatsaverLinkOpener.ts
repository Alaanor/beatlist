import { BrowserWindow } from "electron";

export const OPEN_BEATSAVER_LINK = "open_beatsaver_link";

export default class BeatsaverLinkOpener {
  public static register(): void {
    this.HandleArgv(process.argv);
  }

  public static SendArgvSecondInstance(argv: string[]) {
    this.HandleArgv(argv);
  }

  private static HandleArgv(argv: string[]) {
    const win = BrowserWindow.getFocusedWindow();

    if (!win) {
      return;
    }

    const key = this.ParseArgvToKey(argv);

    if (!key) {
      return;
    }

    win.webContents.send(OPEN_BEATSAVER_LINK, key);
  }

  private static ParseArgvToKey(argv: string[]): string | undefined {
    const win = BrowserWindow.getFocusedWindow();

    if (!win) {
      return undefined;
    }

    const potentialKey = argv.find((v) => /beatsaver:\/\/(.*)\//gm.test(v));

    if (!potentialKey) {
      return undefined;
    }

    const match = /beatsaver:\/\/(.*)\//gm.exec(potentialKey);
    if (!match || match.length < 2) {
      return undefined;
    }

    return match[1];
  }
}
