import fs from 'fs-extra';
import path from 'path';
import { resolveInstallPath } from '../pathResolver/Resolve';
import store from '../../../plugins/store';

const BEAT_SABER_EXE = 'Beat Saber.exe';
const BEAT_SABER_PLAYLIST = 'Playlists';
const BEAT_SABER_CUSTOM_LEVEL = 'Beat Saber_Data\\CustomLevels';

export default class BeatSaber {
  public static validateInstallationPathSync(folderPath: string): boolean {
    const exePath = path.join(folderPath, BEAT_SABER_EXE);
    return fs.pathExistsSync(exePath);
  }

  public static async solveInstallationPath(): Promise<string | undefined> {
    return resolveInstallPath();
  }

  public static getPlaylistPath() {
    const installationPath = store.getters['settings/installationPath'];
    return path.join(installationPath, BEAT_SABER_PLAYLIST);
  }

  public static async getAllSongFolderPath(): Promise<string[] | undefined> {
    const installationPath = store.getters['settings/installationPath'];
    const pathSongList = path.join(installationPath, BEAT_SABER_CUSTOM_LEVEL);
    const directoryList = await fs.readdir(pathSongList);
    return directoryList.map((directory) => path.join(pathSongList, directory));
  }
}
