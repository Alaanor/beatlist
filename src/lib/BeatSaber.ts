import fs from 'fs';
import path from 'path';
import Utils from './Utils';
import {promisify} from 'util';
import PlaylistLocal from './PlaylistLocal';
import {resolveInstallPath} from './pathResolver/resolve';
import Playlist from './Playlist';
import ISongOnline from './data/ISongOnline';
import IPlaylistLocal from './data/IPlaylistLocal';

declare var __static: string;
const defaultCoverPath = path.join(__static, 'defaultCover.jpg');
const readdir = promisify(fs.readdir);
const mkdir = promisify(fs.mkdir);
const exists = promisify(fs.exists);

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

  public static getPlaylistPath(installationPath: string) {
    return path.join(installationPath, BEAT_SABER_PLAYLIST);
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

  public async getPlaylists(): Promise<PlaylistLocal[]> {
    const pathPlaylists = path.join(this.installationPath, BEAT_SABER_PLAYLIST);
    const directoryList = await readdir(pathPlaylists);

    const playlists = await Promise.all(directoryList.map(async (file) => {
      const playlistPath = path.join(pathPlaylists, file);
      return await PlaylistLocal.ParseFromFile(playlistPath);
    }));

    return playlists.filter((p: Playlist | undefined) => p !== undefined) as PlaylistLocal[];
  }

  public async CreateNewPlaylistFile(): Promise<PlaylistLocal> {
    const randNum = Math.floor(Math.random() * 1e6 - 1) + 1e5;
    const fileName = `new-playlist-${randNum}`;
    const cover = await Utils.LoadCover(defaultCoverPath);
    const playlist = new PlaylistLocal({} as IPlaylistLocal);

    playlist.songs = [];
    playlist.playlistTitle = fileName;
    playlist.playlistPath = path.join(this.installationPath, BEAT_SABER_PLAYLIST, fileName + '.json');
    playlist.CalculateHash();

    await playlist.Save(cover);
    return playlist;
  }

  public async CreateBeatMapFolder(beatmap: ISongOnline) {
    const songFolder = path.join(this.installationPath, BEAT_SABER_CUSTOM_LEVEL);
    const newFolderName = `${beatmap.key} (${beatmap.metadata.songName} - ${beatmap.metadata.levelAuthorName})`;
    const finalPath = path.join(songFolder, newFolderName);

    if (!(await exists(finalPath))) {
      return mkdir(finalPath)
        .then(() => {
          return finalPath;
        })
        .catch(() => {
          throw new Error('Couldn\'t create a folder for the new beatmap.');
        });
    } else {
      return finalPath;
    }
  }
}
