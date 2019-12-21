import { AxiosInstance } from 'axios';
import AxiosCachedFactory from '@/libraries/net/AxiosCachedFactory';
import { BeatsaverBeatmap } from './BeatsaverBeatmap';

const API_BASE_URL = 'https://beatsaver.com/api';
const GET_BY_HASH = 'maps/by-hash/';

export default class BeatSaverAPI {
  public static Singleton: BeatSaverAPI = new BeatSaverAPI();

  public http: AxiosInstance;

  public constructor() {
    this.http = AxiosCachedFactory.getAxios(API_BASE_URL);
  }

  public async getBeatmapByHash(hash: string): Promise<BeatsaverBeatmap | undefined> {
    return this.http.get(`${GET_BY_HASH + hash}/`)
      .then((answer) => answer.data as BeatsaverBeatmap)
      .catch(() => undefined);
  }
}
