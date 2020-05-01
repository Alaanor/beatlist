import events from "events";
import { DownloadOperation } from "@/libraries/net/downloader/operation/DownloadOperation";
import DownloadLibrary from "@/libraries/net/downloader/DownloadLibrary";

const maxOperationInParallel = 3;
const ON_QUEUE_UPDATED = "on_queue_updated";

export default class DownloadManager {
  private static EventEmitter = new events.EventEmitter();

  public static Initialize() {
    this.EventEmitter.setMaxListeners(1000);
  }

  public static AddQueue(operation: DownloadOperation) {
    DownloadLibrary.queuedOperation.push(operation);
    DownloadManager.UpdateQueue();
  }

  public static OnQueueUpdated(callback: () => void) {
    DownloadManager.EventEmitter.on(ON_QUEUE_UPDATED, () => callback());
  }

  public static RemoveOnQueueUpdatedListener(callback: () => void) {
    DownloadManager.EventEmitter.removeListener(ON_QUEUE_UPDATED, callback);
  }

  private static UpdateQueue() {
    DownloadLibrary.completedOperation.push(
      ...DownloadLibrary.ongoingOperation.filter(
        (value: DownloadOperation) => value.isCompleted
      )
    );

    DownloadLibrary.ongoingOperation = DownloadLibrary.ongoingOperation.filter(
      (value: DownloadOperation) => !value.isCompleted
    );

    while (
      DownloadLibrary.ongoingOperation.length < maxOperationInParallel &&
      DownloadLibrary.queuedOperation.length !== 0
    ) {
      const operation = DownloadLibrary.queuedOperation.pop();

      if (operation) {
        operation.OnCompleted(DownloadManager.UpdateQueue);
        operation.Start().then();
        DownloadLibrary.ongoingOperation.push(operation);
      }
    }

    DownloadManager.EventEmitter.emit(ON_QUEUE_UPDATED);
  }
}
