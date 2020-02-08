import fs from 'fs-extra';
import path from 'path';
import { PlaylistBase, PlaylistLocal } from '@/libraries/playlist/PlaylistLocal';
import PlaylistLibrary from '@/libraries/playlist/PlaylistLibrary';
import PlaylistLoader, { PLAYLIST_EXTENSION_NAME } from '@/libraries/playlist/PlaylistLoader';
import BeatSaber from '@/libraries/os/beatSaber/BeatSaber';
import PlaylistScanner from '@/libraries/scanner/playlist/PlaylistScanner';

declare const __static: string;
const defaultCoverPath = path.join(__static, 'defaultCover.jpg');

export default class PlaylistInstaller {
  public static Install() {
    // TODO when online playlist
  }

  public static async InstallNewEmpty(): Promise<PlaylistLocal> {
    const randNum = Math.floor(Math.random() * 1e6 - 1) + 1e5;
    const name = `new-playlist-${randNum}`;
    const cover = Buffer.from(await fs.readFile(defaultCoverPath));
    const filepath = path.join(BeatSaber.getPlaylistFolder(), `${name}.${PLAYLIST_EXTENSION_NAME}`);

    const emptyPlaylist = {
      title: name,
      author: '',
      description: '',
      cover,
      maps: [],
    } as PlaylistBase;

    await PlaylistLoader.SaveAt(filepath, emptyPlaylist);
    return (new PlaylistScanner()).scanOne(filepath);
  }

  public static async Uninstall(playlist: PlaylistLocal): Promise<void> {
    await fs.unlink(playlist.path);
    PlaylistLibrary.RemovePlaylist(playlist);
  }
}
