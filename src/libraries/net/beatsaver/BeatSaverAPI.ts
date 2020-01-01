import { AxiosError, AxiosInstance } from 'axios';
import AxiosCachedFactory from '@/libraries/net/AxiosCachedFactory';
import { BeatsaverBeatmap, BeatsaverBeatmapValidation } from './BeatsaverBeatmap';

const API_BASE_URL = 'https://beatsaver.com/api';
const GET_BY_HASH = 'maps/by-hash/';
const GET_BY_KEY = 'maps/detail/';

export type BeatSaverAPIResponse<T> = BeatSaverAPIResponseBase & (
  BeatSaverAPIResponseDataFound<T> |
  BeatSaverAPIResponseDataInexistent |
  BeatSaverAPIResponseDataInvalid
);

interface BeatSaverAPIResponseBase {
  status: BeatSaverAPIResponseStatus,
}

interface BeatSaverAPIResponseDataFound<T> {
  status: BeatSaverAPIResponseStatus.ResourceFound;
  data: T;
}

interface BeatSaverAPIResponseDataInvalid {
  status: BeatSaverAPIResponseStatus.ResourceFoundButInvalidData,
  rawData: string;
}

interface BeatSaverAPIResponseDataInexistent {
  status: (
    BeatSaverAPIResponseStatus.ResourceNotFound |
    BeatSaverAPIResponseStatus.ServerNotAvailable
  );
  statusCode: number;
  statusMessage: string;
}

export enum BeatSaverAPIResponseStatus {
  ResourceFound = 0, // 200
  ResourceNotFound = 1, // 404
  ResourceFoundButInvalidData = 3, // 200 but data is not what we expected
  ServerNotAvailable = 2, // the rest
}

export default class BeatSaverAPI {
  public static Singleton: BeatSaverAPI = new BeatSaverAPI();

  public http: AxiosInstance;

  public constructor() {
    this.http = AxiosCachedFactory.getAxios(API_BASE_URL);
  }

  public async getBeatmapByHash(hash: string): Promise<BeatSaverAPIResponse<BeatsaverBeatmap>> {
    return this.makeRequest<BeatsaverBeatmap>(`${GET_BY_HASH + hash}/`);
  }

  public async getBeatmapByKey(key: string): Promise<BeatSaverAPIResponse<BeatsaverBeatmap>> {
    return this.makeRequest<BeatsaverBeatmap>(`${GET_BY_KEY + key}/`);
  }

  private async makeRequest<T>(apiPath: string): Promise<BeatSaverAPIResponse<T>> {
    return this.http.get(apiPath, {
      validateStatus: (status: number) => status === 200,
    })
      .then((answer) => {
        const valid = BeatsaverBeatmapValidation(answer.data);

        if (valid) {
          return {
            data: answer.data as T,
            status: BeatSaverAPIResponseStatus.ResourceFound,
          } as BeatSaverAPIResponse<T>;
        }

        return {
          status: BeatSaverAPIResponseStatus.ResourceFoundButInvalidData,
          rawData: answer.data.toString(),
        } as BeatSaverAPIResponse<T>;
      })
      .catch((error: AxiosError) => ({
        status: error.response?.status === 404
          ? BeatSaverAPIResponseStatus.ResourceNotFound
          : BeatSaverAPIResponseStatus.ServerNotAvailable,
        statusCode: error.response?.status,
        statusMessage: error.response?.statusText,
      } as BeatSaverAPIResponse<T>));
  }
}
