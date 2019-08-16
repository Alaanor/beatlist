import nodePath from 'path';
import fs from 'fs';
import {promisify} from 'util';
import SongHashData from './SongHashData';
import axios from 'axios';
import store from '../store/store';
import SongLocal from '@/lib/data/SongLocal';
import Difficulties from '@/lib/data/Difficulties';
import SongInfo from '@/lib/data/SongInfo';
import Metadata from '@/lib/data/Metadata';

const readFile = promisify(fs.readFile);
const apiHashUrl = 'https://beatsaver.com/api/maps/by-hash/';

export default class SongLoader {

  public static GetSongFromKey(key: string, songs: SongLocal[]): SongLocal | undefined {
    if (key) {
      return songs.find((s) => {
        return ((s.info.key || '').toLowerCase() === key.toLowerCase()) && !!s.info.key;
      });
    }

    return undefined;
  }

  public static GetSongFromHash(hash: string, songs: SongLocal[]): SongLocal | undefined {
    return songs.find((s) => {
      return (s.info.hash || '').toLowerCase() === (hash || '').toLowerCase()
        && s.info.hash !== undefined && hash !== undefined;
    });
  }

  public static GetSongFromDirId(dirId: string, songs: SongLocal[]): SongLocal | undefined {
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

  public static DetectDuplicate(songs: SongLocal[]) {
    const newFormatSongs = songs.filter((s) => s.folderId === s.info.key).map((s) => s.info.key);
    songs.filter((s) => (
      newFormatSongs.includes(s.info.key) && s.info.key !== s.folderId
    )).forEach((s) => {
      store.commit('songs/markAsInvalid', s);
    });
  }

  public static GetDifficulties(sets: []): Difficulties {
    const diff = {} as Difficulties;

    sets.forEach((s: { _difficultyBeatmaps: [] }) => {
      s._difficultyBeatmaps.forEach((s: { _difficulty: string }) => {
        const key = s._difficulty.charAt(0).toLowerCase() + s._difficulty.slice(1);
        diff[key] = true;
      });
    });

    return diff;
  }

  public static async LoadInfo(path: string) {
    const song = {} as SongLocal;
    song.info = {} as SongInfo;
    song.info.metadata = {} as Metadata;

    try {
      const filePath = nodePath.join(path, 'info.dat');
      const raw = await readFile(filePath, 'utf8');
      const data = JSON.parse(raw);

      song.info.metadata.songName = data._songName;
      song.info.metadata.songSubName = data._songSubName;
      song.info.metadata.songAuthorName = data._songAuthorName;
      song.info.metadata.levelAuthorName = data._levelAuthorName;
      song.info.metadata.bpm = data._beatsPerMinute;

      song.path = path;
      song.coverImage = data._coverImageFilename;
      song.filename = data._songFilename;
      song.info.metadata.difficulties = SongLoader.GetDifficulties(data._difficultyBeatmapSets);

      song.folderId = SongLoader.GetFolderId(song.path);
      song.info.hash = (await SongHashData.data())[song.path.toLowerCase()].songHash;
      song.info.key = (await SongLoader.GetKeyFromHash(song.info.hash));

      song.valid = true;
    } catch (e) {
      return song;
    }

    return song;
  }

  private static async GetKeyFromHash(hash: string): Promise<string> {
    return axios({
      method: 'get',
      url: apiHashUrl + hash,
      responseType: 'json',
    }).then((response) => {
      return response.data.key;
    });
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
