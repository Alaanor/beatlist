import axios, {AxiosAdapter, AxiosInstance} from 'axios';
import {cacheAdapterEnhancer, throttleAdapterEnhancer} from 'axios-extensions';
import path from 'path';
import ISearchResult from '../lib/data/ISearchResult';
import SongOnline from '../lib/data/SongOnline';
import ISongOnline from '../lib/data/ISongOnline';

const WEBSITE_BASE_URL = 'https://beatsaver.com';
const API_BASE_URL = 'https://beatsaver.com/api';
const GET_BY_HASH = 'maps/by-hash/';
const GET_BY_KEY = 'maps/detail/';
const GET_BY_HOT = 'maps/hot/';
const GET_BY_LATEST = 'maps/latest/';
const GET_BY_PLAYS = 'maps/plays/';
const GET_BY_DOWNLOADS = 'maps/downloads/';
const GET_BY_RATING = 'maps/rating/';
const SEARCH_TEXT = 'search/text/';

export default class BeatSaverAPI {
  public static Singleton: BeatSaverAPI = new BeatSaverAPI();

  public static FullCoverUrl(coverUrl: string) {
    return path.join(WEBSITE_BASE_URL + coverUrl);
  }

  public static getDownloadUrlFor(beatmap: ISongOnline) {
    return WEBSITE_BASE_URL + beatmap.downloadURL;
  }

  public http: AxiosInstance;

  public constructor() {
    this.http = axios.create({
      baseURL: API_BASE_URL,
      adapter: throttleAdapterEnhancer(cacheAdapterEnhancer(axios.defaults.adapter as AxiosAdapter)),
    });
  }

  public getSongByHash(hash: string, asObject = false): Promise<ISongOnline | undefined> {
    return this.http.get(GET_BY_HASH + hash + '/')
      .then((answer) => answer.data as ISongOnline)
      .then((beatmap) => asObject ? new SongOnline(beatmap) : beatmap)
      .catch((err) => undefined);
  }

  public getSongByKey(key: string, asObject = false): Promise<ISongOnline | undefined> {
    return this.http.get(GET_BY_KEY + key)
      .then((answer) => answer.data as ISongOnline)
      .then((beatmap) => asObject ? new SongOnline(beatmap) : beatmap)
      .catch((err) => undefined);
  }

  public search(text: string, page = 0): Promise<ISearchResult | undefined> {
    const result = this.http.get(SEARCH_TEXT + page + '?q=' + text)
      .then((answer) => answer.data as ISearchResult);
    return this.toSongOnlineObject(result);
  }

  public getHot(page = 0): Promise<ISearchResult | undefined> {
    const result = this.http.get(GET_BY_HOT + page)
      .then((answer) => answer.data as ISearchResult);
    return this.toSongOnlineObject(result);
  }

  public getLatest(page = 0): Promise<ISearchResult | undefined> {
    const result = this.http.get(GET_BY_LATEST + page)
      .then((answer) => answer.data as ISearchResult);
    return this.toSongOnlineObject(result);
  }

  public getPlays(page = 0): Promise<ISearchResult | undefined> {
    const result = this.http.get(GET_BY_PLAYS + page)
      .then((answer) => answer.data as ISearchResult);
    return this.toSongOnlineObject(result);
  }

  public getDownloads(page = 0): Promise<ISearchResult | undefined> {
    const result = this.http.get(GET_BY_DOWNLOADS + page)
      .then((answer) => answer.data as ISearchResult);
    return this.toSongOnlineObject(result);
  }

  public getRating(page = 0): Promise<ISearchResult | undefined> {
    const result = this.http.get(GET_BY_RATING + page)
      .then((answer) => answer.data as ISearchResult);
    return this.toSongOnlineObject(result);
  }

  private toSongOnlineObject(result: Promise<ISearchResult>): Promise<ISearchResult | undefined> {
    return result.then((answer: ISearchResult) => {
      answer.docs = answer.docs.map((s: ISongOnline) => new SongOnline(s));
      return answer;
    });
  }
}
