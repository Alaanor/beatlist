import Song from '@/lib/data/Song';
import ISongOnline from '@/lib/data/ISongOnline';
import IStats from '@/lib/data/IStats';
import BeatSaverAPI from '@/lib/BeatSaverAPI';

export default class SongOnline extends Song implements ISongOnline {
  public coverURL: string;
  public description: string;
  public downloadURL: string;
  public stats: IStats;
  public uploaded: Date;

  constructor(song: ISongOnline) {
    super(song);
    this.coverURL = song.coverURL;
    this.description = song.description;
    this.downloadURL = song.downloadURL;
    this.stats = song.stats;
    this.uploaded = song.uploaded;
  }
  public async getImage(): Promise<string> {
    return BeatSaverAPI.FullCoverUrl(this.coverURL);
  }

}
