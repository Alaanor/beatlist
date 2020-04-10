import fs from 'fs-extra';
import path from 'path';
import { resolveInstallPath } from '@/libraries/os/pathResolver/Resolve';
import store from '@/plugins/store';
import { BeatsaverBeatmap } from '@/libraries/net/beatsaver/BeatsaverBeatmap';

const BEAT_SABER_EXE = 'Beat Saber.exe';
const BEAT_SABER_PLAYLIST = 'Playlists';
const BEAT_SABER_CUSTOM_LEVEL = 'Beat Saber_Data\\CustomLevels';

export default class BeatSaber {
  public static validateInstallationPathSync(folderPath: string): boolean {
    const exePath = path.join(folderPath, BEAT_SABER_EXE);
    return fs.pathExistsSync(exePath);
  }

  public static async solveInstallationPath(): Promise<string | undefined> {
    return resolveInstallPath();
  }

  public static getBeatmapFolder(): string {
    const installationPath = store.getters['settings/installationPath'];
    return path.join(installationPath, BEAT_SABER_CUSTOM_LEVEL);
  }

  public static getPlaylistFolder(): string {
    const installationPath = store.getters['settings/installationPath'];
    return path.join(installationPath, BEAT_SABER_PLAYLIST);
  }

  public static async getAllSongFolderPath(): Promise<string[]> {
    const pathSongList = this.getBeatmapFolder();
    const directoryList = await fs.readdir(pathSongList);
    return directoryList.map((directory) => path.join(pathSongList, directory));
  }

  public static async getAllPlaylistsPath(): Promise<string[] | undefined> {
    const pathPlaylists = this.getPlaylistFolder();
    const fileList = await fs.readdir(pathPlaylists);

    const allFile = await Promise.all(fileList.map(async (file: string) => {
      const filepath = path.join(pathPlaylists, file);
      if ((await fs.stat(filepath)).isFile()) {
        return filepath;
      }
      return undefined;
    }));

    const isString = (str: string | undefined): str is string => !!str;
    return allFile.filter(isString);
  }

  public static GetFolderPathFor(beatmap: BeatsaverBeatmap): string {
    const installationPath = store.getters['settings/installationPath'];
    const beatmapFolder = `${beatmap.key} (${beatmap.metadata.songName} - ${beatmap.metadata.levelAuthorName})`
      .replace(/[?|&:*;$%@"<>()+,]/g, '')
      .replace('\\', '_')
      .replace('/', '_');

    return path.join(installationPath, BEAT_SABER_CUSTOM_LEVEL, beatmapFolder);
  }
}
