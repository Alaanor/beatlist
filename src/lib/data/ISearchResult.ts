import ISongInfo from '@/lib/data/ISongInfo';

export default interface ISearchResult {
  docs: ISongInfo[];
  totalDocs: number;
  lastPage: number;
  prevPage: null;
  nextPage: number;
}
