import IPlaylist from './data/IPlaylist';
import store from '../store/store';
import SongLoader from './SongLoader';
import BeatSaverAPI from './BeatSaverAPI';
import ISongInfo from './data/ISongInfo';

export default abstract class Playlist implements IPlaylist {

  protected static async Parse(rawJson: string): Promise<IPlaylist | undefined> {
    const data = JSON.parse(rawJson);
    const songs = store.getters['songs/songs'];

    const playlist = {} as IPlaylist;
    playlist.playlistTitle = data.playlistTitle;
    playlist.playlistAuthor = data.playlistAuthor;
    playlist.playlistDescription = data.playlistDescription;

    playlist.songs = (await Promise.all(data.songs.map(async (s: any) => {
      return (
        SongLoader.GetSongFromHash(s.hash, songs) ||
        SongLoader.GetSongFromKey(s.key, songs) ||
        SongLoader.GetSongFromDirId(s.key, songs) ||
        await BeatSaverAPI.Singleton.getSongByHash(s.hash, true) ||
        await BeatSaverAPI.Singleton.getSongByKey(s.key, true)
      );
    }))).filter((s: any) => s !== undefined) as ISongInfo[];

    return playlist;
  }

  public playlistTitle: string = '';
  public playlistAuthor: string = '';
  public playlistDescription: string = '';
  public songs: ISongInfo[] = [];

  protected constructor(playlist: IPlaylist) {
    this.playlistTitle = playlist.playlistTitle;
    this.playlistAuthor = playlist.playlistAuthor;
    this.playlistDescription = playlist.playlistDescription;
    this.songs = playlist.songs;
  }

  public async abstract LoadCover(): Promise<string>;

}
