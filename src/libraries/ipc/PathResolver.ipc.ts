import { ipcMain, ipcRenderer } from 'electron';
import BeatSaber from 'src/libraries/os/beatSaber/BeatSaber';

export const RESOLVE_INST_PATH_MSG = 'resolve_inst_path_msg';
export const RESOLVE_INST_PATH_REPLY = 'resolve_inst_path_reply';

export default class PathResolver {
  public static register(): void {
    ipcMain.on(RESOLVE_INST_PATH_MSG, async (event: any) => {
      const installationPath = await BeatSaber.solveInstallationPath();
      event.reply(RESOLVE_INST_PATH_REPLY, installationPath ?? '');
    });
  }

  public static async detectInstallationPath() : Promise<string> {
    ipcRenderer.send(RESOLVE_INST_PATH_MSG);

    return new Promise(((resolve) => {
      ipcRenderer.on(RESOLVE_INST_PATH_REPLY, (event: any, arg: string) => resolve(arg));
    }));
  }
}
