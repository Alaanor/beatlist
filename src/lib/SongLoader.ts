import nodePath from 'path';
import fs from 'fs';
import {promisify} from 'util';
import SongHashData from './SongHashData';
import store from '../store/store';
import ISongLocal from '../lib/data/ISongLocal';
import IDifficulties from '../lib/data/IDifficulties';
import IMetadata from '../lib/data/IMetadata';
import SongLocal from './data/SongLocal';
import BeatSaverAPI from '../lib/BeatSaverAPI';
import ISongOnline from '../lib/data/ISongOnline';
import BeatSaber from '../lib/BeatSaber';

const readFile = promisify(fs.readFile);

export default class SongLoader {

  public static GetSongFromKey(key: string, songs: ISongLocal[]): ISongLocal | undefined {
    if (key) {
      return songs.find((s) => {
        return ((s.key || '').toLowerCase() === key.toLowerCase()) && !!s.key;
      });
    }

    return undefined;
  }

  public static GetSongFromHash(hash: string, songs: ISongLocal[]): ISongLocal | undefined {
    return songs.find((s) => {
      return (s.hash || '').toLowerCase() === (hash || '').toLowerCase()
        && s.hash !== undefined && hash !== undefined;
    });
  }

  public static GetSongFromDirId(dirId: string, songs: ISongLocal[]): ISongLocal | undefined {
    return songs.find((s) => {
      return (s.folderId || '').toLowerCase() === (dirId || '').toLowerCase()
        && s.folderId !== undefined && dirId !== undefined;
    });
  }

  public static async LoadCover(songPath: string, coverImagePath: string): Promise<string> {
    const filePath = nodePath.join(songPath, coverImagePath || '');
    const imgData = await readFile(filePath);
    return 'data:image/jpg;base64,' + imgData.toString('base64');
  }

  public static DetectDuplicate(songs: ISongLocal[]) {
    const newFormatSongs = songs.filter((s) => s.folderId === s.key).map((s) => s.key);
    songs.filter((s) => (
      newFormatSongs.includes(s.key) && s.key !== s.folderId
    )).forEach((s) => {
      store.commit('songs/markAsInvalid', s);
    });
  }

  public static GetDifficulties(sets: []): IDifficulties {
    const diff = {} as IDifficulties;

    sets.forEach((set: { _difficultyBeatmaps: [] }) => {
      set._difficultyBeatmaps.forEach((s: { _difficulty: string }) => {
        const key = s._difficulty.charAt(0).toLowerCase() + s._difficulty.slice(1);
        diff[key] = true;
      });
    });

    return diff;
  }

  public static async LoadInfo(path: string, showLog: boolean = false) {
    const song = {} as ISongLocal;
    song.metadata = {} as IMetadata;

    try {
      const filePath = nodePath.join(path, 'info.dat');
      const raw = await readFile(filePath, 'utf8');
      const data = JSON.parse(raw);

      song.metadata.songName = data._songName;
      song.metadata.songSubName = data._songSubName;
      song.metadata.songAuthorName = data._songAuthorName;
      song.metadata.levelAuthorName = data._levelAuthorName;
      song.metadata.bpm = data._beatsPerMinute;

      song.path = path;
      song.coverImage = data._coverImageFilename;
      song.filename = data._songFilename;
      song.metadata.difficulties = SongLoader.GetDifficulties(data._difficultyBeatmapSets);

      song.folderId = SongLoader.GetFolderId(song.path);
      song.hash = await this.GetHash(song.path, song.folderId);
      song.onlineData = (await BeatSaverAPI.Singleton.getSongByHash(song.hash) as ISongOnline);
      song.key = song.onlineData.key;

      song.valid = true;
    } catch (e) {
      if (showLog) {
        // tslint:disable-next-line:no-console
        console.warn('A song couldn\'t have been imported: ', song, e);
      }
      return new SongLocal(song);
    }

    return new SongLocal(song);
  }

  public static async NewSongAvailable(): Promise<boolean> {
    const installationPath = store.getters['settings/installationPath'];

    if (!installationPath) {
      return false;
    }

    const availableSongs = await new BeatSaber(installationPath).getSongList();
    const noFilterSongs = store.getters['songs/noFilterSongs'];

    return noFilterSongs.length !== availableSongs.length;
  }

  public static async UpdateOnlineDataFor(song: ISongOnline) {
    const localSong = SongLocal.get(song);

    if (!localSong) {
      return;
    }

    const onlineData = await BeatSaverAPI.Singleton.getSongByKey(localSong.key);

    if (onlineData) {
      localSong.onlineData = onlineData;
      store.commit('songs/updateSongData', localSong);
    }
  }

  private static async GetHash(path: string, folderId: string | undefined) {
    let hash = '';

    try {
      hash = (await SongHashData.data())[path.toLowerCase()].songHash;
    } catch (e) {
      if (!hash && !!folderId && folderId.length > 0) {
        hash = await BeatSaverAPI.Singleton.getSongByKey(folderId).then((s) => {
          if (!s) {
            throw new Error('Unable to find the hash');
          }

          return s.hash;
        });
      }
    }

    return hash;
  }

  private static GetFolderId(songPath: string): string | undefined {
    const regex = /\\([0-9a-f]*-*[0-9a-f]*)[^\\]+$/;
    const m = regex.exec(songPath);

    if (m !== null && m[1] !== undefined) {
      return m[1] || undefined;
    }

    return undefined;
  }
}
