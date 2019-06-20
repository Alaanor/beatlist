import nodePath from 'path';
import fs from 'fs';
import {promisify} from 'util';
import DifficultyBeatMapSets from '@/lib/DifficultyBeatMapSets';

const readFile = promisify(fs.readFile);

export default class SongData {

  public songName: string | undefined;
  public songSubName: string | undefined;
  public songAuthorName: string | undefined;
  public levelAuthorName: string | undefined;
  public beatsPerMinute: number | undefined;
  public coverImagePath: string | undefined;
  public songFilename: string | undefined;
  public difficultyLevels: DifficultyBeatMapSets[] | undefined;
  public imgData: string | undefined;

  private readonly songPath: string;
  private valid: boolean = false;

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
      this.difficultyLevels = data.difficultyLevels as DifficultyBeatMapSets[];

      this.valid = true;

      this.imgData = await this.GetCoverSrc();

    } catch (e) {
      return;
    }
  }

  private async GetCoverSrc(): Promise<string> {
    if (this.valid) {
      const filePath = nodePath.join(this.songPath, this.coverImagePath || '');
      const imgData = await readFile(filePath);
      return 'data:image/jpg;base64,' + imgData.toString('base64');
    }
    return '';
  }

}
