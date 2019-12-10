import fs from 'fs-extra';
import path from 'path';
import { BeatmapLocal } from './BeatmapLocal';
import BeatmapLoadStateError from './BeatmapLoadStateError';
import { BeatmapLoadState } from './BeatmapLoadState';
import BeatmapHashComputer from './BeatmapHashComputer';
import BeatSaverAPI from '../net/beatsaver/BeatSaverAPI';

export default class BeatmapLoader {
  private readonly beatmap: BeatmapLocal;

  private beatmapFolder: string = '';

  private hash: string | undefined;

  constructor() {
    this.beatmap = {} as BeatmapLocal;
    this.beatmap.loadState = { valid: false } as BeatmapLoadState;
  }

  public async Load(beatmapFolder: string): Promise<BeatmapLocal> {
    this.beatmapFolder = beatmapFolder;
    this.beatmap.folderPath = beatmapFolder;

    await this.ValidateFolderContent();
    await this.FindTheHash();
    await this.GetOnlineData();

    if (this.beatmap.loadState.errorType === undefined) {
      this.beatmap.loadState.valid = true;
    }

    return this.beatmap;
  }

  private async ValidateFolderContent() {
    let coverImageFilePath: string;
    let soundFilePath: string;

    try {
      const infoDat = await fs.readFile(path.join(this.beatmapFolder, 'info.dat'));
      const beatmapDescription = JSON.parse(infoDat.toString());

      coverImageFilePath = path.join(this.beatmapFolder, beatmapDescription._coverImageFilename);
      soundFilePath = path.join(this.beatmapFolder, beatmapDescription._songFilename);
    } catch (e) {
      this.beatmap.loadState.errorType = BeatmapLoadStateError.NoInfoDatFileFound;
      return;
    }

    if (!await fs.pathExists(coverImageFilePath)) {
      this.beatmap.loadState.errorType = BeatmapLoadStateError.NoCoverImageFound;
    } else {
      this.beatmap.coverPath = coverImageFilePath;
    }

    if (!await fs.pathExists(soundFilePath)) {
      this.beatmap.loadState.errorType = BeatmapLoadStateError.NoSoundFileFound;
    } else {
      this.beatmap.songPath = soundFilePath;
    }
  }

  private async FindTheHash() {
    if (this.beatmap.loadState.errorType) {
      return;
    }

    this.hash = await BeatmapHashComputer.Compute(this.beatmapFolder);

    if (!this.hash) {
      this.beatmap.loadState.errorType = BeatmapLoadStateError.FailedToComputeHash;
    }
  }

  private async GetOnlineData() {
    if (this.beatmap.loadState.errorType) {
      return;
    }

    if (this.hash !== undefined) {
      const onlineData = await BeatSaverAPI.Singleton.getBeatmapByHash(this.hash);
      if (onlineData) {
        this.beatmap.onlineData = onlineData;
      } else {
        this.beatmap.loadState.errorType = BeatmapLoadStateError.BeatmapNotOnBeatsaver;
      }
    }
  }
}
