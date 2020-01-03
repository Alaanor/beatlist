import request from 'request';
import throttle from 'throttleit';

export interface DownloadUnitProgress {
  bytes: {
    total: number;
    received: number;
    percent: number; // 0 to 1
    speed: number; // bytes per second
  },
  time: {
    startedAt: Date;
    remaining: number; // in seconds
  },
}

export default class DownloadUnit {
  public static TimeoutMs = 10 * 1e3;

  private _request: request.Request;

  public progress: DownloadUnitProgress | undefined;

  public constructor(url: string, writableStream: NodeJS.WritableStream) {
    this._request = request(url, {
      timeout: DownloadUnit.TimeoutMs,
    });

    this._request.pipe(writableStream);

    this._request.on('response', (response: request.Response) => {
      this.progress = DownloadUnit.InitiateProgress(response);
      response.on('data', (chunk: any) => {
        if (this.progress) {
          this.progress.bytes.received += chunk.length;
        }
      });
      response.on('data', throttle(this.UpdateProgress, 250));
    });

    this._request.on('complete', this.UpdateProgress);
  }


  public onCompleted(listener: () => void) {
    this._request.on('complete', () => {
      this.UpdateProgress();
      listener();
    });
  }

  public onError(listener: (error: Error) => void) {
    this._request.on('error', listener);
  }

  private static InitiateProgress(response: request.Response)
    : DownloadUnitProgress | undefined {
    const total = Number(response.headers['content-length']) || undefined;

    if (total === undefined) {
      return undefined;
    }

    return {
      bytes: {
        total,
        received: 0,
        percent: 0,
        speed: 0,
      },
      time: {
        startedAt: new Date(),
        remaining: 0,
      },
    } as DownloadUnitProgress;
  }

  private UpdateProgress() {
    if (!this.progress) {
      return;
    }

    if (this.progress.bytes.total !== 0) {
      this.progress.bytes.percent = this.progress.bytes.received / this.progress.bytes.total;
    }

    const elapsedTimeMs = (new Date().getTime() - this.progress.time.startedAt.getTime());
    this.progress.bytes.speed = this.progress.bytes.received / elapsedTimeMs;

    const missingBytesAmount = this.progress.bytes.total - this.progress.bytes.received;
    this.progress.time.remaining = missingBytesAmount / this.progress.bytes.speed;
  }
}
