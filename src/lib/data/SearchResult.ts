import {SongInfo} from '@/lib/data/SongInfo';

export default interface SearchResult {
  docs: SongInfo[];
  totalDocs: number;
  lastPage: number;
  prevPage: null;
  nextPage: number;
}
