import Song from './Song';
import ISongLocal from './ISongLocal';
import SongLoader from '../SongLoader';
import ISongOnline from './ISongOnline';
import store from '../../store/store';
import path from 'path';
import fsExtra from 'fs-extra';
import SongScanner from '../SongScanner';
import SongOnline from './SongOnline';

export default class SongLocal extends Song implements ISongLocal {

  public static isSongLocal(object: any): object is ISongLocal {
    try {
      return 'folderId' in object;
    } catch (e) {
      return false;
    }
  }

  public static isSongsLocal(objects: any[]): objects is ISongLocal[] {
    return objects.map((o: any) => this.isSongLocal(o)).every((b: boolean) => b);
  }

  public static isInLibrary(song: ISongOnline | string) {
    return !!this.get(song);
  }

  public static get(song: ISongOnline | string): SongLocal | undefined {
    return store.getters['songs/songs'].filter((local: SongLocal) => {
      return local.key === (SongOnline.isSongOnline(song) ? song.key : song);
    })[0];
  }

  private static isFolderLegit(songPath: string) {
    const instPath = store.getters['settings/installationPath'];
    const relative = path.relative(instPath, songPath);
    return relative && !relative.startsWith('..') && !path.isAbsolute(relative);
  }

  public coverImage: string;
  public filename: string;
  public folderId: string | undefined;
  public path: string;
  public valid: boolean;
  public onlineData: ISongOnline;

  constructor(song: ISongLocal) {
    super(song);
    this.coverImage = song.coverImage;
    this.filename = song.filename;
    this.folderId = song.folderId;
    this.path = song.path;
    this.valid = song.valid;
    this.onlineData = song.onlineData;
  }

  public getImage(): Promise<string> {
    return SongLoader
      .LoadCover(this.path, this.coverImage);
  }

  public async deleteIt() {
    if (!SongLocal.isFolderLegit(this.path)) {
      return;
    }

    await fsExtra.remove(this.path);
    await new SongScanner().Scan();
  }
}
