import { ipcMain, ipcRenderer } from "electron";
import fs from "fs-extra";

export const ON_FILE_READ_REQUEST = "on_file_read_request";
export const ON_FILE_READ_REPLY = "on_file_read_reply";

export default class Base64FileReader {
  public static register(): void {
    ipcMain.on(ON_FILE_READ_REQUEST, async (event: any, srcPath: string) => {
      const data = await this.getFileInBase64(srcPath);
      event.reply(ON_FILE_READ_REPLY, data);
    });
  }

  private static async getFileInBase64(
    srcPath: string
  ): Promise<string | undefined> {
    try {
      return fs
        .readFile(srcPath)
        .then((value: Buffer) => value.toString("base64"));
    } catch (e) {
      return undefined;
    }
  }

  public static read(srcPath: string): Promise<string | undefined> {
    ipcRenderer.send(ON_FILE_READ_REQUEST, srcPath);

    return new Promise((resolve) => {
      ipcRenderer.on(
        ON_FILE_READ_REPLY,
        (event: any, data: string | undefined) => resolve(data)
      );
    });
  }
}
