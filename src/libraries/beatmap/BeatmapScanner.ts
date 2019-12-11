import BeatSaber from '../os/beatSaber/BeatSaber';
import BeatmapLibrary from './BeatmapLibrary';
import { BeatmapLocal } from './BeatmapLocal';
import BeatmapLoader from './BeatmapLoader';

export default class BeatmapScanner {
  public static async ScanAll(): Promise<BeatmapLocal[]> {
    const paths = await BeatmapScanner.GetTheNewPath();

    const promises = paths.map((path: string) => {
      const loader = new BeatmapLoader();
      return loader.Load(path);
    });

    return Promise.all(promises);
  }

  private static async GetTheNewPath(): Promise<string[]> {
    const allPaths = (await BeatSaber.getAllSongFolderPath())
      ?.map((path: string) => path.toLowerCase());

    const oldPaths = BeatmapLibrary.GetAllMaps()
      .map((beatmap: BeatmapLocal) => beatmap.folderPath)
      .map((path: string) => path.toLowerCase());

    return allPaths?.filter((path: string) => !oldPaths
      .find((oldPath: string) => oldPath === path)
    ) ?? [];
  }
}
