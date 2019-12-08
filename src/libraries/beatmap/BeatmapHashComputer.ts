import fs from 'fs-extra';
import path from 'path';
import crypto from 'crypto';

export default class BeatmapHashComputer {
  public static async Compute(folderPath: string): Promise<string | undefined> {
    try {
      const infoDatPath = path.join(folderPath, 'info.dat');
      const infoDatStr = (await fs.readFile(infoDatPath)).toString();
      const infoDat = JSON.parse(infoDatStr);

      let binary = infoDatStr;

      for (const diffSet of infoDat._difficultyBeatmapSets) {
        for (const d of diffSet._difficultyBeatmaps) {
          binary += fs.readFileSync(path.join(folderPath, d._beatmapFilename)).toString();
        }
      }

      return crypto
        .createHash('sha1')
        .update(binary)
        .digest('hex')
        .toUpperCase();
    } catch (e) {
      return undefined;
    }
  }
}
