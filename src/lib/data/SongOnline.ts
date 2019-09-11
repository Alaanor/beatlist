import Song from './Song';
import ISongOnline from './ISongOnline';
import IStats from './IStats';
import BeatSaverAPI from '../BeatSaverAPI';
import DownloadBeatMapItem from '../DownloadBeatMapItem';
import SongLocal from './SongLocal';

export default class SongOnline extends Song implements ISongOnline {

  public static isSongOnline(object: any): object is ISongOnline {
    return 'coverURL' in object;
  }
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

  public InstallIt(): DownloadBeatMapItem {
    const dl = new DownloadBeatMapItem(this);
    dl.Install();
    return dl;
  }

  public async deleteIt() {
    const localBeatMap = SongLocal.get(this);

    if (!localBeatMap) {
      return;
    }

    await localBeatMap.deleteIt();
  }

}
