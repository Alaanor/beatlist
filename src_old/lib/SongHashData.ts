import path from 'path';
import fs from 'fs';
import fsExtra from 'fs-extra';
import {promisify} from 'util';
import { remote } from 'electron';

const readFile = promisify(fs.readFile);

interface SongHash {
  songHash: string;
}

export default class SongHashData {

  public static async forceInit() {
    await this.data();
  }

  public static async fileAvailable() {
    return await fsExtra.pathExists(this.GetHashFilePath());
  }

  public static async data(): Promise<{ [key: string]: SongHash }> {
    if (!await this.fileAvailable()) {
      return {};
    }

    if (this.Hash === undefined) {
      const songHashFile = this.GetHashFilePath();
      const rawJson = await readFile(songHashFile);
      const hashes = this.ToSongHashData(rawJson.toString());
      this.Hash = Object.assign({},
        ...Object.keys(hashes).map((key) => ({[key.toLowerCase()]: hashes[key]})),
      );
    }
    return this.Hash;
  }

  private static Hash: { [key: string]: SongHash };

  private static GetHashFilePath() {
    return path.join(remote.app.getPath('appData'), '..',
      'LocalLow\\Hyperbolic Magnetism\\Beat Saber\\SongHashData.dat');
  }

  private static ToSongHashData(json: string): { [key: string]: SongHash } {
    return JSON.parse(json);
  }

}
