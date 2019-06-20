import fs from 'fs';
import path from 'path';
import {promisify} from 'util';

const readdir = promisify(fs.readdir);

export default class BeatSaber {

  public static isPathLegit(installationPath: string): boolean {
    const pathToBeatSaberExe = path.join(installationPath, 'Beat Saber.exe');
    try {
      fs.accessSync(pathToBeatSaberExe, fs.constants.F_OK);
      return true;
    } catch (e) {
      return false;
    }
  }

  private readonly installationPath: string;

  constructor(installationPath: string) {
    this.installationPath = installationPath;
  }

  public async getSongList(): Promise<string[]> {
    const pathSongList = path.join(this.installationPath, 'Beat Saber_Data\\CustomLevels');
    const directoryList = await readdir(pathSongList);
    return directoryList.map((directory) => {
      return path.join(pathSongList, directory);
    });
  }
}
