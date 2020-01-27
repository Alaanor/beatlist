import request from 'request';

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

export function DownloadUnitProgressFactory(): DownloadUnitProgress {
  return {
    bytes: {
      total: 0,
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

export default class DownloadUnit {
  public static TimeoutMs = 10 * 1e3;

  private _request: request.Request;

  private readonly progress: DownloadUnitProgress;

  public constructor(
    url: string,
    writableStream: NodeJS.WritableStream,
    progress?: DownloadUnitProgress,
  ) {
    this.progress = progress ?? DownloadUnitProgressFactory();
    this._request = request(url, {
      timeout: DownloadUnit.TimeoutMs,
    });

    this._request.pipe(writableStream);

    this._request.on('response', (response: request.Response) => {
      this.SetProgressTotalHeader(response);
      response.on('data', (chunk: any) => {
        if (this.progress) {
          this.progress.bytes.received += chunk.length;
          this.UpdateProgress();
        }
      });
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

  private SetProgressTotalHeader(response: request.Response) {
    const total = Number(response.headers['content-length']) || undefined;

    if (total) {
      this.progress.bytes.total = total;
    }
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
