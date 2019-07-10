import axios, {AxiosAdapter, AxiosInstance} from 'axios';
import {cacheAdapterEnhancer, throttleAdapterEnhancer} from 'axios-extensions';
import path from 'path';

const WEBSITE_BASE_URL = 'https://beatsaver.com/';
const API_BASE_URL = 'https://beatsaver.com/api';
const GET_BY_HASH = 'maps/by-hash/';
const GET_BY_KEY = 'maps/detail/';
const SEARCH_TEXT = 'search/text/';

export interface SearchResult {
  docs: SongInfo[];
  totalDocs: number;
  lastPage: number;
  prevPage: null;
  nextPage: number;
}

export interface SongInfo {
  metadata: Metadata;
  stats: Stats;
  description: string;
  key: string;
  uploaded: Date;
  hash: string;
  downloadURL: string;
  coverURL: string;
}

export interface Metadata {
  difficulties: Difficulties;
  characteristics: string[];
  songName: string;
  songSubName: string;
  songAuthorName: string;
  levelAuthorName: string;
  bpm: number;
}

export interface Difficulties {
  easy: boolean;
  normal: boolean;
  hard: boolean;
  expert: boolean;
  expertPlus: boolean;
}

export interface Stats {
  downloads: number;
  plays: number;
  downVotes: number;
  upVotes: number;
  heat: number;
  rating: number;
}

export default class BeatSaverAPI {
  public static Singleton: BeatSaverAPI = new BeatSaverAPI();

  public static FullCoverUrl(coverUrl: string) {
    return path.join(WEBSITE_BASE_URL + coverUrl);
  }

  public http: AxiosInstance;

  public constructor() {
    this.http = axios.create({
      baseURL: API_BASE_URL,
      adapter: throttleAdapterEnhancer(cacheAdapterEnhancer(axios.defaults.adapter as AxiosAdapter)),
    });
  }

  public getSongByHash(hash: string): Promise<SongInfo | undefined> {
    return this.http.get(GET_BY_HASH + hash + '/')
      .then((answer) => answer.data as SongInfo);
  }

  public getSongByKey(key: string): Promise<SongInfo | undefined> {
    return this.http.get(GET_BY_KEY + key)
      .then((answer) => answer.data as SongInfo);
  }

  public search(text: string, page = 0): Promise<SearchResult | undefined> {
    return this.http.get(SEARCH_TEXT + page + '?q=' + text)
      .then((answer) => answer.data as SearchResult);
  }
}
