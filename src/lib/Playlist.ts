import SongData from '@/lib/SongData';
import fs from 'fs';
import {promisify} from 'util';

const readFile = promisify(fs.readFile);

export default class Playlist {

  public static async Parse(pathToJson: string, songs: SongData[]): Promise<Playlist> {
    const raw = await readFile(pathToJson);
    const data = JSON.parse(raw.toString());

    const playlist = new Playlist();
    playlist.playlistPath = pathToJson;
    playlist.playlistTitle = data.playlistTitle;
    playlist.playlistAuthor = data.playlistAuthor;

    playlist.songs = data.songs.map((s: any) => {
      return (
        SongData.GetSongFromKey(s.key, songs) ||
        SongData.GetSongFromHash(s.hash, songs) ||
        SongData.GetSongFromDirId(s.key, songs)
      );
    }).filter((s: any) => s === undefined);

    return playlist;
  }

  public playlistPath: string = '';
  public playlistTitle: string = '';
  public playlistAuthor: string = '';
  public songs: SongData[] = [];

  public GetImage(): string {
    return '';
  }

  public ExportJson(): string {
    // @todo
    return '';
  }
}
