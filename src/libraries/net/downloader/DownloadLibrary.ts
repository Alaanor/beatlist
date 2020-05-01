import {
  DownloadOperation,
  DownloadOperationType,
} from "@/libraries/net/downloader/operation/DownloadOperation";
import { BeatsaverBeatmap } from "@/libraries/net/beatsaver/BeatsaverBeatmap";

export default class DownloadLibrary {
  public static queuedOperation: DownloadOperation[] = [];

  public static ongoingOperation: DownloadOperation[] = [];

  public static completedOperation: DownloadOperation[] = [];

  public static GetOperationFor(
    beatmap: BeatsaverBeatmap
  ): DownloadOperation | undefined {
    return DownloadLibrary.queuedOperation
      .concat(DownloadLibrary.ongoingOperation)
      .find((value: DownloadOperation) => {
        if (value.type === DownloadOperationType.Beatmap) {
          return value.beatmap.key === beatmap.key;
        }

        return false;
      });
  }

  public static HasBeatmapScheduled(beatmap: BeatsaverBeatmap): boolean {
    return this.GetOperationFor(beatmap) !== undefined;
  }
}
