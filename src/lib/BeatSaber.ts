import fs from 'fs';
import path from 'path';
import {promisify} from 'util';
import Playlist from '@/lib/Playlist';
import SongData from '@/lib/SongData';

const readdir = promisify(fs.readdir);

export default class BeatSaber {

  public static isPathLegit(installationPath: string | undefined): boolean {
    if (installationPath === undefined) {
      return false;
    }

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

  public async getPlaylists(songs: SongData[]): Promise<Playlist[]> {
    const pathSongList = path.join(this.installationPath, 'Playlists');
    const directoryList = await readdir(pathSongList);
    return await Promise.all(directoryList.map(async (file) => {
      const playlistPath = path.join(pathSongList, file);
      return await Playlist.Parse(playlistPath, songs);
    }));
  }
}
