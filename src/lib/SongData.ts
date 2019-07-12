import nodePath from 'path';
import fs from 'fs';
import {promisify} from 'util';
import DifficultyBeatMapSets from './data/DifficultyBeatMapSets';
import SongHashData from './SongHashData';
import axios from 'axios';
import store from '../store/store';
import Difficulty from './data/Difficulty';
import Metadata from './data/Metadata';

const readFile = promisify(fs.readFile);
const apiHashUrl = 'https://beatsaver.com/api/maps/by-hash/';

export default class SongData {

  public static GetSongFromKey(key: string, songs: SongData[]): SongData | undefined {
    if (key) {
      return songs.find((s) => {
        return ((s.songKey || '').toLowerCase() === key.toLowerCase()) && !!s.songKey;
      });
    }

    return undefined;
  }

  public static GetSongFromHash(hash: string, songs: SongData[]): SongData | undefined {
    return songs.find((s) => {
      return (s.songHash || '').toLowerCase() === (hash || '').toLowerCase()
        && s.songHash !== undefined && hash !== undefined;
    });
  }

  public static GetSongFromDirId(dirId: string, songs: SongData[]): SongData | undefined {
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

  public static DetectDuplicate(songs: SongData[]) {
    const newFormatSongs = songs.filter((s) => s.folderId === s.songKey).map((s) => s.songKey);
    songs.filter((s) => (
      newFormatSongs.includes(s.songKey) && s.songKey !== s.folderId
    )).forEach((s) => {
      store.commit('songs/markAsInvalid', s);
    });
  }

  public static GetDifficulties(song: SongData): string[] | undefined {
    if (!song.difficultyLevels) {
      return undefined;
    }

    const standard = song.difficultyLevels
      .find((b: DifficultyBeatMapSets) => b._beatmapCharacteristicName === 'Standard');

    if (!standard || !standard._difficultyBeatmaps) {
      return undefined;
    }

    return standard._difficultyBeatmaps
      .map((d: Difficulty) => d._difficulty || '')
      .filter((d: string) => d !== '');
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

  public metadata: Metadata;
  public songHash: string | undefined;
  public songKey: string | undefined;
  public coverImagePath: string | undefined;
  public songFilename: string | undefined;
  public difficultyLevels: DifficultyBeatMapSets[] | undefined;
  public folderId: string | undefined;

  public valid: boolean = false;

  private readonly songPath: string;

  constructor(path: string) {
    this.songPath = path;
    this.metadata = {} as Metadata;
  }

  public async LoadInfo() {
    try {
      const path = nodePath.join(this.songPath, 'info.dat');
      const raw = await readFile(path, 'utf8');
      const data = JSON.parse(raw);

      this.metadata.songName = data._songName;
      this.metadata.songSubName = data._songSubName;
      this.metadata.songAuthorName = data._songAuthorName;
      this.metadata.levelAuthorName = data._levelAuthorName;
      this.metadata.bpm = data._beatsPerMinute;

      this.coverImagePath = data._coverImageFilename;
      this.songFilename = data._songFilename;
      this.difficultyLevels = data._difficultyBeatmapSets as DifficultyBeatMapSets[];

      this.folderId = SongData.GetFolderId(this.songPath);
      this.songHash = (await SongHashData.data())[this.songPath.toLowerCase()].songHash;
      this.songKey = (await SongData.GetKeyFromHash(this.songHash));

      this.valid = true;
    } catch (e) {
      return;
    }
  }
}
