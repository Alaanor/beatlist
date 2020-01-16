import fs from 'fs-extra';
import path from 'path';
import BeatsaverAPI, { BeatSaverAPIResponseStatus } from '@/libraries/net/beatsaver/BeatsaverAPI';
import { BeatmapLocal } from './BeatmapLocal';
import BeatmapLoadStateError from './BeatmapLoadStateError';
import { BeatmapLoadState } from './BeatmapLoadState';
import BeatmapHashComputer from './BeatmapHashComputer';

export default class BeatmapLoader {
  private readonly beatmap: BeatmapLocal;

  private beatmapFolder: string = '';

  private hash: string | undefined;

  public static async Load(beatmapFolder: string): Promise<BeatmapLocal> {
    return new BeatmapLoader().Load(beatmapFolder);
  }

  public static async LoadCover(beatmap: BeatmapLocal): Promise<string | undefined> {
    if (!await fs.pathExists(beatmap.coverPath)) {
      return undefined;
    }

    const rawImage = await fs.readFile(beatmap.coverPath);
    return `data:image/jpg;base64,${rawImage.toString('base64')}`;
  }

  private constructor() {
    this.beatmap = {} as BeatmapLocal;
    this.beatmap.loadState = { valid: false } as BeatmapLoadState;
  }

  private async Load(beatmapFolder: string): Promise<BeatmapLocal> {
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
      const response = await BeatsaverAPI.Singleton.getBeatmapByHash(this.hash);

      switch (response.status) {
        case BeatSaverAPIResponseStatus.ResourceFound:
          this.beatmap.onlineData = response.data;
          break;

        case BeatSaverAPIResponseStatus.ResourceNotFound:
          this.beatmap.loadState.errorType = BeatmapLoadStateError.BeatmapNotOnBeatsaver;
          this.beatmap.loadState.errorMessage = `${response.statusCode}: ${response.statusMessage}`;
          break;

        case BeatSaverAPIResponseStatus.ResourceFoundButInvalidData:
          this.beatmap.loadState.errorType = BeatmapLoadStateError.InvalidDataReceivedFromBeatsaver;
          this.beatmap.loadState.errorMessage = `Failed to parse as a BeatsaverBeatmap: ${response.rawData?.toString()}`;
          break;

        case BeatSaverAPIResponseStatus.RateLimited:
          this.beatmap.loadState.errorType = BeatmapLoadStateError.BeatsaverRateLimited;
          this.beatmap.loadState.errorMessage = `We got rate limited: (${response.remaining}/${response.total}) reset at: ${response.resetAt?.toLocaleString()}`;
          break;

        case BeatSaverAPIResponseStatus.ServerNotAvailable:
          this.beatmap.loadState.errorType = BeatmapLoadStateError.BeatsaverServerNotAvailable;
          this.beatmap.loadState.errorMessage = `${response.statusCode}: ${response.statusMessage}`;
          break;

        default:
          this.beatmap.loadState.errorType = BeatmapLoadStateError.Unknown;
      }
    }
  }
}
