import IStats from '@/lib/data/IStats';
import ISongInfo from '@/lib/data/ISongInfo';

export default interface ISongOnline extends ISongInfo {
  stats: IStats;
  description: string;
  uploaded: Date;
  downloadURL: string;
  directDownload: string;
  coverURL: string;
}
