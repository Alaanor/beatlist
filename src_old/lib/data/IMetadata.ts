import IDifficulties from '@/lib/data/IDifficulties';

export default interface IMetadata {
  difficulties: IDifficulties;
  characteristics: string[];
  songName: string;
  songSubName: string;
  songAuthorName: string;
  levelAuthorName: string;
  bpm: number;
}
