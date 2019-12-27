import BeatSaber from '@/libraries/os/beatSaber/BeatSaber';
import BeatmapLibrary from './BeatmapLibrary';
import BeatmapLoader from './BeatmapLoader';
import { BeatmapLocal } from './BeatmapLocal';
import { computeDifference, Differences } from '@/libraries/common/Differences';

export default class BeatmapScanner {
  public newBeatmaps: BeatmapLocal[] = [];

  public removedBeatmaps: number = 0;

  public keptBeatmaps: number = 0;

  public async ScanAll() {
    const diff = await BeatmapScanner.GetTheDifferenceInPath();

    this.newBeatmaps = await Promise.all(
      diff.added.map((path: string) => BeatmapLoader.Load(path)),
    );

    this.removedBeatmaps = diff.removed.length;
    this.keptBeatmaps = diff.kept.length;

    const allBeatmaps = this.ReassembleAllBeatmap(diff);
    BeatmapLibrary.UpdateAllMaps(allBeatmaps);
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

    return this.newBeatmaps.concat(existingBeatmap);
  }
}
