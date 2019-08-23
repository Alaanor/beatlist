import Song from './Song';
import ISongLocal from './ISongLocal';
import SongLoader from '../SongLoader';

export default class SongLocal extends Song implements ISongLocal {

  public static isSongLocal(object: any): object is SongLocal {
    return 'folderId' in object;
  }

  public static isSongsLocal(objects: any[]): objects is SongLocal[] {
    return objects.map((o: any) => this.isSongLocal(o)).every((b: boolean) => b);
  }

  public coverImage: string;
  public filename: string;
  public folderId: string | undefined;
  public path: string;
  public valid: boolean;

  constructor(song: ISongLocal) {
    super(song);
    this.coverImage = song.coverImage;
    this.filename = song.filename;
    this.folderId = song.folderId;
    this.path = song.path;
    this.valid = song.valid;
  }

  public getImage(): Promise<string> {
    return SongLoader
      .LoadCover(this.path, this.coverImage);
  }
}
