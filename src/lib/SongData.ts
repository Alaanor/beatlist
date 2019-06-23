import nodePath from 'path';
import fs from 'fs';
import {promisify} from 'util';
import DifficultyBeatMapSets from '@/lib/DifficultyBeatMapSets';
import SongHashData from './SongHashData';
import axios from 'axios';

const readFile = promisify(fs.readFile);
const apiHashUrl = 'https://beatsaver.com/api/maps/by-hash/';

export default class SongData {

  public static GetSongFromKey(key: string, songs: SongData[]): SongData | undefined {
    return songs.find((s) => s.songKey === key);
  }

  public static GetSongFromHash(hash: string, songs: SongData[]): SongData | undefined {
    return songs.find((s) => s.songHash === hash);
  }

  public static GetSongFromDirId(dirId: string, songs: SongData[]): SongData | undefined {
    return songs.find((s) => s.folderId === dirId);
  }

  public static async LoadCover(songPath: string, coverImagePath: string): Promise<string> {
    const filePath = nodePath.join(songPath, coverImagePath || '');
    const imgData = await readFile(filePath);
    return 'data:image/jpg;base64,' + imgData.toString('base64');
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
    const regex = /\\([0-9]*-*[0-9]*)[^\\]+$/;
    const m = regex.exec(songPath);

    if (m !== null && m[1] !== undefined) {
      return m[1] || undefined;
    }

    return undefined;
  }

  public songHash: string | undefined;
  public songKey: string | undefined;
  public songName: string | undefined;
  public songSubName: string | undefined;
  public songAuthorName: string | undefined;
  public levelAuthorName: string | undefined;
  public beatsPerMinute: number | undefined;
  public coverImagePath: string | undefined;
  public songFilename: string | undefined;
  public difficultyLevels: DifficultyBeatMapSets[] | undefined;
  public folderId: string | undefined;

  public valid: boolean = false;

  private readonly songPath: string;

  constructor(path: string) {
    this.songPath = path;
  }

  public async LoadInfo() {
    try {
      const path = nodePath.join(this.songPath, 'info.dat');
      const raw = await readFile(path, 'utf8');
      const data = JSON.parse(raw);

      this.songName = data._songName;
      this.songSubName = data._songSubName;
      this.songAuthorName = data._songAuthorName;
      this.levelAuthorName = data._levelAuthorName;
      this.beatsPerMinute = data._beatsPerMinute;
      this.coverImagePath = data._coverImageFilename;
      this.songFilename = data._songFilename;
      this.difficultyLevels = data._difficultyBeatmapSets as DifficultyBeatMapSets[];

      this.folderId = SongData.GetFolderId(this.songPath);
      this.songHash = (await SongHashData.data())[this.songPath].songHash;
      this.songKey = (await SongData.GetKeyFromHash(this.songHash));

      this.valid = true;
    } catch (e) {
      return;
    }
  }
}
