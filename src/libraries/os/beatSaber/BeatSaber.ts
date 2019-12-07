import fs from 'fs-extra';
import path from 'path';
import { resolveInstallPath } from '../pathResolver/Resolve';

const BEAT_SABER_EXE = 'Beat Saber.exe';
const BEAT_SABER_PLAYLIST = 'Playlists';

export default class BeatSaber {
  public static validateInstallationPathSync(folderPath: string): boolean {
    const exePath = path.join(folderPath, BEAT_SABER_EXE);
    return fs.pathExistsSync(exePath);
  }

  public static validateInstallationPath(folderPath: string): Promise<boolean> {
    const exePath = path.join(folderPath, BEAT_SABER_EXE);
    return fs.pathExists(exePath);
  }

  public static async solveInstallationPath(): Promise<string | null> {
    return resolveInstallPath();
  }

  public static getPlaylistPath(installationPath: string) {
    return path.join(installationPath, BEAT_SABER_PLAYLIST);
  }
}
