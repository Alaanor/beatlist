import ISongOnline from '@/lib/data/ISongOnline';

export default interface ISearchResult {
  docs: ISongOnline[];
  totalDocs: number;
  lastPage: number;
  prevPage: null;
  nextPage: number;
}
