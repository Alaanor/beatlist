import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {promisify} from 'util';

const readFile = promisify(fs.readFile);

export default class SongHashCompute {

  public static async Compute(folderPath: string): Promise<string | undefined> {
    try {
      const infoDat = SongHashCompute.readInfoDat(folderPath);
      let binary = (await readFile(path.join(folderPath, 'info.dat'))).toString();

      for (const d of infoDat._difficultyBeatmapSets._difficultyBeatmaps) {
        binary += (await readFile(path.join(folderPath, d._beatmapFilename))).toString();
      }

      return crypto
        .createHash('sha1')
        .update(binary)
        .digest('hex');
    } catch (e) {
      return undefined;
    }
  }

  private static readInfoDat(folderPath: string) {
    return JSON.parse(path.join(folderPath, 'info.dat'));
  }
}
