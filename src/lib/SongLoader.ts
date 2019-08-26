import nodePath from 'path';
import fs from 'fs';
import {promisify} from 'util';
import SongHashData from './SongHashData';
import axios from 'axios';
import store from '../store/store';
import ISongLocal from '@/lib/data/ISongLocal';
import IDifficulties from '@/lib/data/IDifficulties';
import IMetadata from '@/lib/data/IMetadata';
import SongLocal from './data/SongLocal';
import BeatSaverAPI from '@/lib/BeatSaverAPI';
import ISongOnline from '@/lib/data/ISongOnline';

const readFile = promisify(fs.readFile);
const apiHashUrl = 'https://beatsaver.com/api/maps/by-hash/';

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

  public static async LoadInfo(path: string) {
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
      song.hash = (await SongHashData.data())[song.path.toLowerCase()].songHash;
      song.onlineData = (await BeatSaverAPI.Singleton.getSongByHash(song.hash) as ISongOnline);
      song.key = song.onlineData.key;

      song.valid = true;
    } catch (e) {
      return new SongLocal(song);
    }

    return new SongLocal(song);
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
