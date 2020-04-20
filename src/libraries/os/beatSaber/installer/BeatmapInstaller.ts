import fs from 'fs-extra';
import { BeatsaverBeatmap } from '@/libraries/net/beatsaver/BeatsaverBeatmap';
import DownloadOperationBeatmap from '@/libraries/net/downloader/operation/beatmap/DownloadOperationBeatmap';
import DownloadManager from '@/libraries/net/downloader/DownloadManager';
import { BeatmapLocal } from '@/libraries/beatmap/BeatmapLocal';

export default class BeatmapInstaller {
  public static Install(
    beatmap: BeatsaverBeatmap,
    onCompleted?: (operation: DownloadOperationBeatmap) => void,
  ): void {
    const operation = new DownloadOperationBeatmap(beatmap);

    operation.OnCompleted(async () => {
      if (onCompleted) {
        onCompleted(operation);
      }
    });

    DownloadManager.AddQueue(operation);
  }

  public static async Uninstall(beatmap: BeatmapLocal): Promise<void> {
    await fs.remove(beatmap.folderPath);
  }
}
