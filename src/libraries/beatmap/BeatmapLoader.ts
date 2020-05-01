import fs from 'fs-extra';
import path from 'path';
import Base64SrcLoader from '@/libraries/os/utils/Base64SrcLoader';
import { BeatsaverKeyType } from '@/libraries/beatmap/repo/BeatsaverKeyType';
import BeatsaverCacheManager from '@/libraries/beatmap/repo/BeatsaverCacheManager';
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

    return Base64SrcLoader.FromFile(beatmap.coverPath);
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
    await this.CacheBeatsaverMap();

    this.beatmap.loadState.valid = this.beatmap.loadState.errorType === undefined;

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
    } else {
      this.beatmap.hash = this.hash;
    }
  }

  private async CacheBeatsaverMap() {
    if (this.hash) {
      await BeatsaverCacheManager.cacheBeatmap({ type: BeatsaverKeyType.Hash, value: this.hash });
    }
  }
}
