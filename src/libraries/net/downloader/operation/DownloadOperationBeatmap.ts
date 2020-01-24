import fs from 'fs-extra';
import path from 'path';
import AdmZip from 'adm-zip';
import events from 'events';
import {DownloadOperation, DownloadOperationType} from '@/libraries/net/downloader/operation/DownloadOperation';
import DownloadUnit, {DownloadUnitProgress} from '@/libraries/net/downloader/DownloadUnit';
import {BeatsaverBeatmap} from '@/libraries/net/beatsaver/BeatsaverBeatmap';
import BeatsaverUtilities from '@/libraries/net/beatsaver/BeatsaverUtilities';
import BeatSaber from '@/libraries/os/beatSaber/BeatSaber';

const ON_COMPLETED: string = 'completed';

export enum DownloadOperationBeatmapResultStatus {
  Init = 0,
  Downloading = 1,
  Extracting = 2,
  Success = 3,
  DownloadError = 4,
  ExtractionError = 5,
}

export type DownloadOperationBeatmapResult = DownloadOperationBeatmapResultBase & (
    DownloadOperationBeatmapResultInProgress
  | DownloadOperationBeatmapResultDone
  | DownloadOperationBeatmapResultError
)

export interface DownloadOperationBeatmapResultBase {
  beatmap: BeatsaverBeatmap;
  status: DownloadOperationBeatmapResultStatus;
}

export interface DownloadOperationBeatmapResultInProgress {
  status: (
      DownloadOperationBeatmapResultStatus.Init
    | DownloadOperationBeatmapResultStatus.Downloading
    | DownloadOperationBeatmapResultStatus.Extracting
  );
}

export interface DownloadOperationBeatmapResultDone {
  status: DownloadOperationBeatmapResultStatus.Success;
}

export interface DownloadOperationBeatmapResultError {
  status: (
      DownloadOperationBeatmapResultStatus.ExtractionError
    | DownloadOperationBeatmapResultStatus.DownloadError
  );
  errorWritten: string,
}

export default class DownloadOperationBeatmap implements DownloadOperation {
  public type: DownloadOperationType = DownloadOperationType.Beatmap;

  public download: DownloadUnit | undefined;

  public result: DownloadOperationBeatmapResult = {} as DownloadOperationBeatmapResult;

  public isCompleted: boolean = false;

  public get progress(): DownloadUnitProgress | undefined {
    return this.download?.progress;
  }

  private tempFolder: string | undefined;

  private readonly beatmap: BeatsaverBeatmap;

  private _eventEmitter: events.EventEmitter = new events.EventEmitter();

  constructor(beatmap: BeatsaverBeatmap) {
    this.beatmap = beatmap;

    this.result = {
      beatmap: this.beatmap,
      status: DownloadOperationBeatmapResultStatus.Init,
    };

    this._eventEmitter.on(ON_COMPLETED, this.CleanUp);
  }

  public async Start(): Promise<void> {
    this.tempFolder = await fs.mkdtemp('beatlist-');

    const url = BeatsaverUtilities.GetDownloadUrl(this.beatmap);
    const zipPath = path.join(this.tempFolder, `${this.beatmap.key}.zip`);
    const stream = fs.createWriteStream(zipPath);

    try {
      this.result = { ...this.result, status: DownloadOperationBeatmapResultStatus.Downloading };
      this.download = new DownloadUnit(url, stream);
      this.download.onError(this.onDownloadError);
      this.download.onCompleted(() => {
        try {
          this.handleExtraction(zipPath);
          this.onSuccess();
          this._eventEmitter.emit(ON_COMPLETED);
        } catch (e) {
          this.onExtractError(e);
        }
      });
    } catch (e) {
      this.onDownloadError(e);
    }
  }

  private async CleanUp(): Promise<void> {
    if (this.tempFolder) {
      await fs.unlink(this.tempFolder);
    }
  }

  private onDownloadError(error: Error) {
    this.result = {
      ...this.result,
      status: DownloadOperationBeatmapResultStatus.DownloadError,
      errorWritten: `Couldn't download beatmap. [${error.name}]: ${error.message}`,
    };

    this._eventEmitter.emit(ON_COMPLETED);
  }

  private onExtractError(error: Error) {
    this.result = {
      ...this.result,
      status: DownloadOperationBeatmapResultStatus.ExtractionError,
      errorWritten: `Couldn't extract beatmap. [${error.name}]: ${error.message}`,
    };

    this._eventEmitter.emit(ON_COMPLETED);
  }

  private handleExtraction(zipPath: string) {
    this.result = {
      ...this.result,
      status: DownloadOperationBeatmapResultStatus.Extracting,
    };

    const zip = new AdmZip(zipPath);
    const extractPath = BeatSaber.GetFolderPathFor(this.beatmap);

    zip.extractAllTo(extractPath, true);
  }

  OnCompleted(callback: (result: DownloadOperationBeatmapResult) => void): void {
    this.isCompleted = true;
    this._eventEmitter.on(ON_COMPLETED, () => callback(this.result));
  }

  private onSuccess() {
    this.result = {
      ...this.result,
      status: DownloadOperationBeatmapResultStatus.Success,
    };
  }
}
