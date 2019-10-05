import fs from 'fs';
import {promisify} from 'util';
import crypto from 'crypto';
import path from 'path';
import Playlist from './Playlist';
import IPlaylistLocal from './data/IPlaylistLocal';
import BeatSaber from '../lib/BeatSaber';
import store from '../store/store';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const renameFile = promisify(fs.rename);
const deleteFile = promisify(fs.unlink);

export default class PlaylistLocal extends Playlist implements IPlaylistLocal {

  public static async ParseFromFile(pathToJson: string): Promise<PlaylistLocal | undefined> {
    const raw = await readFile(pathToJson);
    let data;

    try {
      data = raw.toString();
    } catch (e) {
      return undefined;
    }

    const playlist = await Playlist.Parse(data) as IPlaylistLocal;
    playlist.playlistPath = pathToJson;
    playlist.playlistHash = this.getPlaylistHash(playlist.playlistPath);

    return new PlaylistLocal(playlist);
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

  constructor(playlist: IPlaylistLocal) {
    super(playlist);

    this.playlistHash = playlist.playlistHash;
    this.playlistPath = playlist.playlistPath;
  }

  public async LoadCover(): Promise<string> {
    const raw = await readFile(this.playlistPath);
    const data = JSON.parse(raw.toString());

    let src = data.image;
    if (src.substring(0, 10) !== 'data:image') {
      src = `data:image/jpeg;charset=utf-8;base64,${src}`;
    }

    return src;
  }

  public async Save(image?: string) {
    if (!image) {
      image = await this.LoadCover();
    }

    await this.EnsureJsonExtensionName();
    await writeFile(this.playlistPath, this.ExportJson(image));
    await this.UpdateFileName();
  }

  public async Delete() {
    return deleteFile(this.playlistPath);
  }

  public CalculateHash() {
    this.playlistHash = PlaylistLocal.getPlaylistHash(this.playlistPath);
  }

  private async UpdateFileName() {
    const playlistPath = BeatSaber.getPlaylistPath(store.getters['settings/installationPath']);
    const fileName = this.playlistTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const newPath = path.join(playlistPath, `${fileName}.json`);
    await renameFile(this.playlistPath, newPath);
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
        .map((s) => ({
          songName: s.metadata.songName,
          hash: s.hash,
        })),
    };

    return JSON.stringify(data);
  }
}
