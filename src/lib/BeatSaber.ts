import fs from 'fs';
import path from 'path';
import {promisify} from 'util';
import Playlist from '@/lib/Playlist';
import SongData from '@/lib/SongData';
import Utils from '@/lib/Utils';

declare var __static: string;
const defaultCoverPath = path.join(__static, 'defaultCover.png');
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

  public async CreateNewPlaylistFile(): Promise<Playlist> {
    const randNum = Math.floor(Math.random() * 1e6 - 1) + 1e5;
    const fileName = `new-playlist-${randNum}`;
    const cover = await Utils.LoadCover(defaultCoverPath);
    const playlist = new Playlist();

    playlist.playlistTitle = fileName;
    playlist.playlistPath = path.join(this.installationPath, 'Playlists', fileName + '.json');
    playlist.CalculateHash();

    await playlist.Save(cover); // @TODO default image

    return playlist;
  }
}
