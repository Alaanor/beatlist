import http from 'http';
import { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import AxiosCachedFactory from '@/libraries/net/AxiosCachedFactory';
import { BeatsaverBeatmap, BeatsaverPage, isBeatsaverBeatmap } from './BeatsaverBeatmap';

const API_BASE_URL = 'https://beatsaver.com/api';
const GET_BY_HASH = 'maps/by-hash';
const GET_BY_KEY = 'maps/detail';
const SEARCH = 'search/text';

export type BeatSaverAPIResponse<T> = BeatSaverAPIResponseBase & (
  BeatSaverAPIResponseDataFound<T> |
  BeatSaverAPIResponseDataInexistent |
  BeatSaverAPIResponseDataInvalid
);

export interface BeatSaverAPIResponseBase {
  status: BeatSaverAPIResponseStatus,
}

export interface BeatSaverAPIResponseDataFound<T> {
  status: BeatSaverAPIResponseStatus.ResourceFound;
  data: T;
}

export interface BeatSaverAPIResponseDataInvalid {
  status: BeatSaverAPIResponseStatus.ResourceFoundButInvalidData,
  rawData: any;
}

export interface BeatSaverAPIResponseDataInexistent {
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

  public async getBeatmapByHash(hash: string)
    : Promise<BeatSaverAPIResponse<BeatsaverBeatmap>> {
    return this.makeRequest<BeatsaverBeatmap>(`${GET_BY_HASH}/${hash}/`, isBeatsaverBeatmap);
  }

  public async getBeatmapByKey(key: string)
    : Promise<BeatSaverAPIResponse<BeatsaverBeatmap>> {
    return this.makeRequest<BeatsaverBeatmap>(`${GET_BY_KEY}/${key}/`, isBeatsaverBeatmap);
  }

  public async searchBeatmaps(search: string, page: number = 0)
    : Promise<BeatSaverAPIResponse<BeatsaverPage>> {
    return this.makeRequest<BeatsaverPage>(`${SEARCH}/${page}?q=${search}`);
  }

  private async makeRequest<T>(apiPath: string, validation?: (data: any) => boolean)
    : Promise<BeatSaverAPIResponse<T>> {
    return this.http.get(apiPath, {
      validateStatus: (status: number) => status === 200,
    })
      .then((answer) => BeatSaverAPI.handleResourceFoundCase<T>(validation, answer))
      .catch((error: AxiosError) => BeatSaverAPI.handleResourceNotFoundCase<T>(error));
  }

  private static handleResourceFoundCase<T>(
    validation: ((data: any) => boolean) | undefined,
    answer: AxiosResponse<T>,
  ) {
    let valid = true;
    if (validation !== undefined) {
      valid = validation(answer.data);
    }

    if (valid) {
      return {
        data: Object.freeze(answer.data as T),
        status: BeatSaverAPIResponseStatus.ResourceFound,
      } as BeatSaverAPIResponse<T>;
    }

    return {
      status: BeatSaverAPIResponseStatus.ResourceFoundButInvalidData,
      rawData: answer.data,
    } as BeatSaverAPIResponse<T>;
  }

  private static handleResourceNotFoundCase<T>(error: AxiosError) {
    return ({
      status: error.response?.status === 404
        ? BeatSaverAPIResponseStatus.ResourceNotFound
        : BeatSaverAPIResponseStatus.ServerNotAvailable,
      statusCode: error.response?.status,
      statusMessage: error.response ? http.STATUS_CODES[error.response.status] : '',
    } as BeatSaverAPIResponse<T>);
  }
}
