import Song from '@/lib/data/Song';
import ISongLocal from '@/lib/data/ISongLocal';
import SongLoader from '@/lib/SongLoader';

export default class SongLocal extends Song implements ISongLocal {

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
