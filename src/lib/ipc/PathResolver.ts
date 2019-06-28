import { ipcMain } from 'electron';
import BeatSaber from '../BeatSaber';

export const RESOLVE_INST_PATH_MSG = 'resolve_inst_path_msg';
export const RESOLVE_INST_PATH_REPLY = 'resolve_inst_path_reply';

export default class PathResolver {
  public static register(): void {
    ipcMain.on(RESOLVE_INST_PATH_MSG, async (event: any, arg: any) => {
      const installationPath = await BeatSaber.solveInstallationPath();
      event.reply(RESOLVE_INST_PATH_REPLY, installationPath);
    });
  }
}
