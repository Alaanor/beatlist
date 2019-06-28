import fs from 'fs';
import path from 'path';
import {promisify} from 'util';
import Playlist from '@/lib/Playlist';
import SongData from '@/lib/SongData';
import Utils from '@/lib/Utils';
import { resolveInstallPath } from './pathResolver/resolve';

declare var __static: string;
const defaultCoverPath = path.join(__static, 'defaultCover.png');
const readdir = promisify(fs.readdir);

const BEAT_SABER_EXE = 'Beat Saber.exe';
const BEAT_SABER_PLAYLIST = 'Playlists';
const BEAT_SABER_CUSTOM_LEVEL = 'Beat Saber_Data\\CustomLevels';

export default class BeatSaber {

  public static isPathLegit(installationPath: string | undefined): boolean {
    if (installationPath === undefined) {
      return false;
    }

    const pathToBeatSaberExe = path.join(installationPath, BEAT_SABER_EXE);

    try {
      fs.accessSync(pathToBeatSaberExe, fs.constants.F_OK);
      return true;
    } catch (e) {
      return false;
    }
  }

  public static async solveInstallationPath(): Promise<string | null> {
    return resolveInstallPath();
  }

  private readonly installationPath: string;

  constructor(installationPath: string) {
    this.installationPath = installationPath;
  }

  public async getSongList(): Promise<string[]> {
    const pathSongList = path.join(this.installationPath, BEAT_SABER_CUSTOM_LEVEL);
    const directoryList = await readdir(pathSongList);
    return directoryList.map((directory) => {
      return path.join(pathSongList, directory);
    });
  }

  public async getPlaylists(songs: SongData[]): Promise<Playlist[]> {
    const pathSongList = path.join(this.installationPath, BEAT_SABER_PLAYLIST);
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
    playlist.playlistPath = path.join(this.installationPath, BEAT_SABER_PLAYLIST, fileName + '.json');
    playlist.CalculateHash();

    await playlist.Save(cover);
    return playlist;
  }
}
