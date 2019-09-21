import IPlaylist from './data/IPlaylist';
import store from '../store/store';
import SongLoader from './SongLoader';
import BeatSaverAPI from './BeatSaverAPI';
import ISongInfo from './data/ISongInfo';
import {promisify} from 'util';
import fs from 'fs';

const readFile = promisify(fs.readFile);

export default class Playlist implements IPlaylist {

  public static async Parse(rawJson: string): Promise<Playlist | undefined> {
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

    return new Playlist(playlist);
  }

  public static async LoadCover(playlistPath: string): Promise<string> {
    const raw = await readFile(playlistPath);
    const data = JSON.parse(raw.toString());

    let src = data.image;
    if (src.substring(0, 10) !== 'data:image') {
      src = `data:image/jpeg;charset=utf-8;base64,${src}`;
    }

    return src;
  }

  public playlistTitle: string = '';
  public playlistAuthor: string = '';
  public playlistDescription: string = '';
  public songs: ISongInfo[] = [];

  constructor(playlist: IPlaylist) {
    this.playlistTitle = playlist.playlistTitle;
    this.playlistAuthor = playlist.playlistAuthor;
    this.playlistDescription = playlist.playlistDescription;
    this.songs = playlist.songs;
  }

}
