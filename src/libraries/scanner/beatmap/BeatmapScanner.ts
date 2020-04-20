import * as Throttle from 'promise-parallel-throttle';
import BeatSaber from '@/libraries/os/beatSaber/BeatSaber';
import BeatmapLibrary from '../../beatmap/BeatmapLibrary';
import BeatmapLoader from '../../beatmap/BeatmapLoader';
import { BeatmapLocal } from '../../beatmap/BeatmapLocal';
import { computeDifference, Differences } from '@/libraries/common/Differences';
import Progress from '@/libraries/common/Progress';
import BeatmapScannerResult from '@/libraries/scanner/beatmap/BeatmapScannerResult';
import { ScannerInterface } from '@/libraries/scanner/ScannerInterface';
import ScannerLocker from '@/libraries/scanner/ScannerLocker';

export default class BeatmapScanner implements ScannerInterface<BeatmapLocal> {
  public result: BeatmapScannerResult = new BeatmapScannerResult();

  public async scanAll(progress: Progress = new Progress()): Promise<BeatmapScannerResult> {
    return ScannerLocker.acquire(async () => {
      const diff = await BeatmapScanner.GetTheDifferenceInPath();

      progress.setTotal(diff.added.length);

      this.result.newItems = await Throttle.all(
        diff.added.map((path: string) => () => BeatmapLoader
          .Load(path)
          .then((beatmap: BeatmapLocal) => {
            progress.plusOne();
            return beatmap;
          })),
        { maxInProgress: 25 },
      );

      this.result.removedItems = diff.removed.length;
      this.result.keptItems = diff.kept.length;

      const allBeatmaps = this.ReassembleAllBeatmap(diff);
      BeatmapLibrary.UpdateAllMaps(allBeatmaps);

      return this.result;
    });
  }

  public async scanOne(path: string): Promise<BeatmapLocal> {
    return ScannerLocker.acquire(async () => {
      const beatmap = await BeatmapLoader.Load(path);
      BeatmapLibrary.AddBeatmap(beatmap);

      this.result.newItems = [beatmap];
      return beatmap;
    });
  }

  private static async GetTheDifferenceInPath(): Promise<Differences<string>> {
    const currentPaths = (await BeatSaber.getAllSongFolderPath())
      ?.map((path: string) => path.toLowerCase());

    const oldPaths = BeatmapLibrary.GetAllMaps()
      .map((beatmap: BeatmapLocal) => beatmap.folderPath.toLowerCase());

    return computeDifference(oldPaths, currentPaths);
  }

  private ReassembleAllBeatmap(diff: Differences<string>): BeatmapLocal[] {
    const existingBeatmap = BeatmapLibrary.GetAllMaps().filter(
      (beatmap: BeatmapLocal) => diff.kept.find(
        (path: string) => beatmap.folderPath === path,
      ),
    );

    return this.result.newItems.concat(existingBeatmap);
  }
}
