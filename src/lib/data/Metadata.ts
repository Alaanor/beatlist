import Difficulties from '@/lib/data/Difficulties';

export default interface Metadata {
  difficulties: Difficulties;
  characteristics: string[];
  songName: string;
  songSubName: string;
  songAuthorName: string;
  levelAuthorName: string;
  bpm: number;
}
