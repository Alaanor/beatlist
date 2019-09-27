import Playlist from './Playlist';
import BeatSaber from './BeatSaber';
import store from '../store/store';
import PlaylistLocal from '@/lib/PlaylistLocal';
import IPlaylistOnline from '@/lib/data/IPlaylistOnline';

export default class PlaylistOnline extends Playlist implements IPlaylistOnline {

  public static async Parse(rawJson: string): Promise<PlaylistOnline | undefined> {
    const pl = (await super.Parse(rawJson)) as IPlaylistOnline;
    pl.coverImage = JSON.parse(rawJson).image;
    return new PlaylistOnline(pl);
  }

  public coverImage: string;

  public constructor(playlist: IPlaylistOnline) {
    super(playlist);
    this.coverImage = playlist.coverImage;
  }

  public async InstallIt() {
    const bs = new BeatSaber(store.getters['settings/installationPath']);
    const pl = await bs.CreateNewPlaylistFile();

    pl.playlistTitle = this.playlistTitle;
    pl.playlistAuthor = this.playlistAuthor;
    pl.playlistDescription = this.playlistDescription;
    pl.songs = this.songs;

    await pl.Save(this.coverImage);
    await store.dispatch('songs/loadPlaylists');
  }

  public IsDownloaded(): boolean {
    const pls = store.getters['songs/playlists'] as PlaylistLocal[];
    return pls.some((pl: PlaylistLocal) =>
      pl.playlistTitle === this.playlistTitle &&
      pl.playlistAuthor === this.playlistAuthor &&
      pl.playlistDescription === this.playlistDescription);
  }

}
