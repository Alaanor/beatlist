import Metadata from '@/lib/data/Metadata';
import Stats from '@/lib/data/Stats';

export default interface SongInfo {
  metadata: Metadata;
  stats: Stats;
  description: string;
  key: string;
  uploaded: Date;
  hash: string;
  downloadURL: string;
  coverURL: string;
}
