import { DownloadOperation } from '@/libraries/net/downloader/operation/DownloadOperation';

const maxOperationInParallel = 3;

export default class DownloadManager {
  get queuedOperation(): DownloadOperation[] {
    return this._queuedOperation;
  }

  get ongoingOperation(): DownloadOperation[] {
    return this._ongoingOperation;
  }

  get completedOperation(): DownloadOperation[] {
    return this._completedOperation;
  }

  private _queuedOperation: DownloadOperation[] = [];

  private _ongoingOperation: DownloadOperation[] = [];

  private _completedOperation: DownloadOperation[] = [];

  public Singleton = new DownloadManager();

  public AddQueue(operation: DownloadOperation) {
    this._queuedOperation.push(operation);
    this.UpdateQueue();
  }

  private UpdateQueue() {
    this._completedOperation
      .push(...this._ongoingOperation
        .filter((value: DownloadOperation) => value.isCompleted));

    this._ongoingOperation = this._ongoingOperation
      .filter((value: DownloadOperation) => !value.isCompleted);

    while (
      this._ongoingOperation.length < maxOperationInParallel
      || this._queuedOperation.length === 0
    ) {
      const operation = this._queuedOperation.pop();

      if (operation) {
        operation.OnCompleted(this.UpdateQueue);
        operation.Start().then();
        this._ongoingOperation.push(operation);
      }
    }
  }
}
