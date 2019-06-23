import SongData from '@/lib/SongData';
import fs from 'fs';
import {promisify} from 'util';
import crypto from 'crypto';

const readFile = promisify(fs.readFile);

export default class Playlist {

  public static async Parse(pathToJson: string, songs: SongData[]): Promise<Playlist> {
    const raw = await readFile(pathToJson);
    const data = JSON.parse(raw.toString());

    const playlist = new Playlist();
    playlist.playlistPath = pathToJson;
    playlist.playlistTitle = data.playlistTitle;
    playlist.playlistAuthor = data.playlistAuthor;
    playlist.playlistDescription = data.playlistDescription;

    playlist.playlistHash = crypto
      .createHash('sha1')
      .update(playlist.playlistPath)
      .digest('hex')
      .substr(0, 5);

    playlist.songs = data.songs.map((s: any) => {
      return (
        SongData.GetSongFromKey(s.key, songs) ||
        SongData.GetSongFromHash(s.hash, songs) ||
        SongData.GetSongFromDirId(s.key, songs)
      );
    }).filter((s: any) => s !== undefined && s.valid);

    return playlist;
  }

  public static async LoadCover(playlistPath: string): Promise<string> {
    const raw = await readFile(playlistPath);
    const data = JSON.parse(raw.toString());
    return data.image;
  }

  public playlistHash: string = '';
  public playlistPath: string = '';
  public playlistTitle: string = '';
  public playlistAuthor: string = '';
  public playlistDescription: string = '';

  public songs: SongData[] = [];

  public GetImage(): string {
    return '';
  }

  public ExportJson(): string {
    // @todo
    return '';
  }
}
