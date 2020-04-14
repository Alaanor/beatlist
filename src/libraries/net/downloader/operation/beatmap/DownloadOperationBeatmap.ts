import fs from 'fs-extra';
import path from 'path';
import AdmZip from 'adm-zip';
import events from 'events';
import { remote } from 'electron';
import {
  DownloadOperationBase,
  DownloadOperationType,
  DownloadOperationTypeBeatmap,
} from '@/libraries/net/downloader/operation/DownloadOperation';
import DownloadUnit from '@/libraries/net/downloader/DownloadUnit';
import { BeatsaverBeatmap } from '@/libraries/net/beatsaver/BeatsaverBeatmap';
import BeatsaverUtilities from '@/libraries/net/beatsaver/BeatsaverUtilities';
import BeatSaber from '@/libraries/os/beatSaber/BeatSaber';
import {
  DownloadOperationBeatmapResult,
  DownloadOperationBeatmapResultStatus,
} from '@/libraries/net/downloader/operation/beatmap/DownloadOperationBeatmapResult';
import { DownloadUnitProgress, DownloadUnitProgressFactory } from '@/libraries/net/downloader/DownloadUnitProgress';

const ON_COMPLETED: string = 'completed';


export default class DownloadOperationBeatmap
implements DownloadOperationBase, DownloadOperationTypeBeatmap {
  public type: DownloadOperationType.Beatmap = DownloadOperationType.Beatmap;

  public download: DownloadUnit | undefined;

  public result: DownloadOperationBeatmapResult = {} as DownloadOperationBeatmapResult;

  public isCompleted: boolean = false;

  public readonly beatmap: BeatsaverBeatmap;

  private tempFolder: string | undefined;

  private _eventEmitter: events.EventEmitter = new events.EventEmitter();

  public readonly progress: DownloadUnitProgress;

  constructor(
    beatmap: BeatsaverBeatmap,
    progress: DownloadUnitProgress = DownloadUnitProgressFactory(),
  ) {
    this.beatmap = beatmap;
    this.progress = progress;

    this.result = {
      beatmap: this.beatmap,
      status: DownloadOperationBeatmapResultStatus.Init,
    };

    this._eventEmitter.on(ON_COMPLETED, this.CleanUp);
  }

  public async Start(): Promise<void> {
    try {
      this.tempFolder = await fs.mkdtemp(path.join(remote.app.getPath('temp'), 'beatlist-'));

      const url = BeatsaverUtilities.GetDownloadUrl(this.beatmap);
      const zipPath = path.join(this.tempFolder, `${this.beatmap.key}.zip`);
      const stream = fs.createWriteStream(zipPath);

      try {
        this.result = { ...this.result, status: DownloadOperationBeatmapResultStatus.Downloading };

        this.download = new DownloadUnit(url, stream, this.progress);
        this.download.onError(this.onDownloadError);
        this.download.onCompleted(() => {
          try {
            this.handleExtraction(zipPath);
            this.onSuccess();
          } catch (e) {
            this.onExtractError(e);
          }
        });
      } catch (e) {
        this.onDownloadError(e);
      }
    } catch (e) {
      this.onIOError(e);
    }
  }

  private async CleanUp(): Promise<void> {
    if (this.tempFolder) {
      await fs.unlink(this.tempFolder);
    }
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

  private onIOError(error: Error) {
    this.result = {
      ...this.result,
      status: DownloadOperationBeatmapResultStatus.IOError,
      errorWritten: `Couldn't make the temporary folder to download. [${error.name}]: ${error.message}`,
    };

    this._eventEmitter.emit(ON_COMPLETED);
  }

  private onSuccess() {
    this.result = {
      ...this.result,
      status: DownloadOperationBeatmapResultStatus.Success,
      path: BeatSaber.GetFolderPathFor(this.beatmap),
    };

    this._eventEmitter.emit(ON_COMPLETED);
  }
}
