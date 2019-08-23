import SongLoader from './SongLoader';
import fs from 'fs';
import {promisify} from 'util';
import crypto from 'crypto';
import path from 'path';
import ISongInfo from '@/lib/data/ISongInfo';
import ISongLocal from '@/lib/data/ISongLocal';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const renameFile = promisify(fs.rename);
const deleteFile = promisify(fs.unlink);

export default class Playlist {

  public static async Parse(pathToJson: string, songs: ISongLocal[]): Promise<Playlist | undefined> {
    const raw = await readFile(pathToJson);
    let data;
    try {
      data = JSON.parse(raw.toString());
    } catch (e) {
      return undefined;
    }

    const playlist = new Playlist();
    playlist.playlistPath = pathToJson;
    playlist.playlistTitle = data.playlistTitle;
    playlist.playlistAuthor = data.playlistAuthor;
    playlist.playlistDescription = data.playlistDescription;

    playlist.playlistHash = this.getPlaylistHash(playlist.playlistPath);

    playlist.songs = data.songs.map((s: any) => {
      return (
        SongLoader.GetSongFromHash(s.hash, songs) ||
        SongLoader.GetSongFromKey(s.key, songs) ||
        SongLoader.GetSongFromDirId(s.key, songs)
      );
    }).filter((s: ISongInfo | undefined) => s !== undefined);
    return playlist;
  }

  public static async LoadCover(playlistPath: string): Promise<string> {
    const raw = await readFile(playlistPath);
    const data = JSON.parse(raw.toString());
    return data.image;
  }

  private static getPlaylistHash(playlistPath: string): string {
    return crypto
      .createHash('sha1')
      .update(playlistPath)
      .digest('hex')
      .substr(0, 5);
  }

  public playlistHash: string = '';
  public playlistPath: string = '';
  public playlistTitle: string = '';
  public playlistAuthor: string = '';
  public playlistDescription: string = '';

  public songs: ISongLocal[] = [];

  public async Save(image?: string) {
    if (!image) {
      image = await Playlist.LoadCover(this.playlistPath);
    }

    await this.EnsureJsonExtensionName();
    await writeFile(this.playlistPath, this.ExportJson(image));
  }

  public async Delete() {
    return deleteFile(this.playlistPath);
  }

  public CalculateHash() {
    this.playlistHash = Playlist.getPlaylistHash(this.playlistPath);
  }

  private async EnsureJsonExtensionName() {
    if (path.extname(this.playlistPath) !== '.json') {
      const dataPath = path.parse(this.playlistPath);
      const fixedPath = path.join(dataPath.dir, dataPath.name + '.json');
      await renameFile(this.playlistPath, fixedPath);

      this.playlistPath = fixedPath;
      this.CalculateHash();
    }
  }

  private ExportJson(img: string): string {
    const data = {
      playlistTitle: this.playlistTitle,
      playlistAuthor: this.playlistAuthor,
      playlistDescription: this.playlistDescription,
      image: img,
      songs: this.songs
        .filter((s) => s.valid)
        .map((s) => ({
          songName: s.metadata.songName,
          hash: s.hash,
        })),
    };

    return JSON.stringify(data);
  }
}
