import events from 'events';
import { DownloadOperation, DownloadOperationType } from '@/libraries/net/downloader/operation/DownloadOperation';
import { BeatsaverBeatmap } from '@/libraries/net/beatsaver/BeatsaverBeatmap';

const maxOperationInParallel = 3;
const ON_QUEUE_UPDATED = 'on_queue_updated';

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

  private _eventEmitter = new events.EventEmitter();

  public static Singleton = new DownloadManager();

  public AddQueue(operation: DownloadOperation) {
    this._queuedOperation.push(operation);
    this.UpdateQueue();
  }

  public HasBeatmapScheduled(beatmap: BeatsaverBeatmap): boolean {
    return this.GetOperationFor(beatmap) !== undefined;
  }

  public GetOperationFor(beatmap: BeatsaverBeatmap): DownloadOperation | undefined {
    return this._queuedOperation.concat(this._ongoingOperation).find(
      (value: DownloadOperation) => {
        if (value.type === DownloadOperationType.Beatmap) {
          return value.beatmap.key === beatmap.key;
        }

        return false;
      },
    );
  }

  public OnQueueUpdated(callback: () => void) {
    this._eventEmitter.on(ON_QUEUE_UPDATED, () => callback());
  }

  private UpdateQueue() {
    this._completedOperation
      .push(...this._ongoingOperation
        .filter((value: DownloadOperation) => value.isCompleted));

    this._ongoingOperation = this._ongoingOperation
      .filter((value: DownloadOperation) => !value.isCompleted);

    while (
      this._ongoingOperation.length < maxOperationInParallel
      && this._queuedOperation.length !== 0
    ) {
      const operation = this._queuedOperation.pop();

      if (operation) {
        operation.OnCompleted(() => DownloadManager.Singleton.UpdateQueue());
        operation.Start().then();
        this._ongoingOperation.push(operation);
      }
    }

    this._eventEmitter.emit(ON_QUEUE_UPDATED);
  }
}
