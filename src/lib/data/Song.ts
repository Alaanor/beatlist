import ISongInfo from '@/lib/data/ISongInfo';
import IMetadata from '@/lib/data/IMetadata';

export default abstract class Song implements ISongInfo {
  public hash: string;
  public key: string;
  public metadata: IMetadata;

  protected constructor(song: ISongInfo) {
    this.metadata = song.metadata;
    this.hash = song.hash;
    this.key = song.key;
  }

  public abstract async getImage(): Promise<string>;
}

