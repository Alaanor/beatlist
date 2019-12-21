import BeatSaber from '@/libraries/os/beatSaber/BeatSaber';
import BeatmapLibrary from './BeatmapLibrary';
import BeatmapLoader from './BeatmapLoader';
import { BeatmapLocal } from './BeatmapLocal';

export default class BeatmapScanner {
  public newBeatmaps: BeatmapLocal[] = [];

  public removedBeatmaps: number = 0;

  public keptBeatmaps: number = 0;

  public async ScanAll() {
    const diff = await BeatmapScanner.GetTheDifferenceInPath();

    this.newBeatmaps = await Promise.all(diff.toAdd.map((path: string) => {
      const loader = new BeatmapLoader();
      return loader.Load(path);
    }));

    this.removedBeatmaps = diff.toRemove.length;
    this.keptBeatmaps = diff.toKeep.length;

    const allBeatmaps = this.ReassembleAllBeatmap(diff);
    BeatmapLibrary.UpdateAllMaps(allBeatmaps);
  }

  private static async GetTheDifferenceInPath(): Promise<DifferencesInPath> {
    const difference = {} as DifferencesInPath;

    const currentPaths = (await BeatSaber.getAllSongFolderPath())
      ?.map((path: string) => path.toLowerCase());

    const oldPaths = BeatmapLibrary.GetAllMaps()
      .map((beatmap: BeatmapLocal) => beatmap.folderPath)
      .map((path: string) => path.toLowerCase());

    difference.toAdd = currentPaths?.filter((currentPath: string) => !oldPaths
      .find((oldPath: string) => oldPath === currentPath)) ?? [];

    difference.toKeep = currentPaths?.filter((currentPath: string) => oldPaths
      .find((oldPath: string) => oldPath === currentPath)) ?? [];

    difference.toRemove = oldPaths.filter((oldPath: string) => !currentPaths
      ?.find((currentPath: string) => currentPath === oldPath)) ?? [];

    return difference;
  }

  private ReassembleAllBeatmap(diff: DifferencesInPath): BeatmapLocal[] {
    const existingBeatmap = BeatmapLibrary.GetAllMaps().filter(
      (beatmap: BeatmapLocal) => diff.toKeep.find(
        (path: string) => beatmap.folderPath === path,
      ),
    );

    return this.newBeatmaps.concat(existingBeatmap);
  }
}

interface DifferencesInPath {
  toRemove: string[],
  toAdd: string[],
  toKeep: string[],
}
