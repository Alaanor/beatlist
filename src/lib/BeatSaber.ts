import fs from 'fs';
import path from 'path';

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

  private installationPath: string;

  constructor(installationPath: string) {
    this.installationPath = installationPath;
  }

  public getSongList() {
    // @TODO
  }
}
