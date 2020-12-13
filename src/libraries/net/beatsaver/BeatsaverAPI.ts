import http from "http";
import { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import AxiosCachedFactory from "@/libraries/net/AxiosCachedFactory";
import BeatsaverRateLimitManager from "@/libraries/net/beatsaver/BeatsaverRateLimitManager";
import BeatsaverServerUrl from "@/libraries/net/beatsaver/BeatsaverServerUrl";
import {
  BeatsaverBeatmap,
  BeatsaverPage,
  isBeatsaverBeatmap,
} from "./BeatsaverBeatmap";

const GET_BY_HASH = "maps/by-hash";
const GET_BY_KEY = "maps/detail";
const SEARCH = "search/text";
const GET_BY_HOT = "maps/hot";
const GET_BY_PLAYS = "maps/plays";
const GET_BY_DOWNLOADS = "maps/downloads";
const GET_BY_LATEST = "maps/latest";
const GET_BY_RATING = "maps/rating";

export type BeatSaverAPIResponse<T> =
  | BeatSaverAPIResponseDataFound<T>
  | BeatSaverAPIResponseDataInvalid
  | BeatSaverAPIResponseDataRateLimited
  | BeatSaverAPIResponseDataInexistent
  | BeatSaverAPIResponseDataTimeout;

export interface BeatSaverAPIResponseDataFound<T> {
  status: BeatSaverAPIResponseStatus.ResourceFound;
  data: T;
}

export interface BeatSaverAPIResponseDataInvalid {
  status: BeatSaverAPIResponseStatus.ResourceFoundButInvalidData;
  rawData: any;
}

export interface BeatSaverAPIResponseDataRateLimited {
  status: BeatSaverAPIResponseStatus.RateLimited;
  remaining: number | undefined;
  resetAt: Date | undefined;
  total: number | undefined;
}

export interface BeatSaverAPIResponseDataInexistent {
  status:
    | BeatSaverAPIResponseStatus.ResourceNotFound
    | BeatSaverAPIResponseStatus.ServerNotAvailable;
  statusCode: number;
  statusMessage: string;
}

export interface BeatSaverAPIResponseDataTimeout {
  status: BeatSaverAPIResponseStatus.Timeout;
}

export enum BeatSaverAPIResponseStatus {
  ResourceFound = 0, // 200
  ResourceNotFound = 1, // 404
  ResourceFoundButInvalidData = 2, // 200 but data is not what we expected
  ServerNotAvailable = 3, // the rest
  RateLimited = 4, // rate-limit-remaining headers is at 0
  Timeout = 5, // timeout
}

export default class BeatsaverAPI {
  public static Singleton: BeatsaverAPI = new BeatsaverAPI();

  public http: AxiosInstance;

  public constructor() {
    this.http = AxiosCachedFactory.getAxios(BeatsaverServerUrl.Beatsaver);
  }

  public async getBeatmapByHash(
    hash: string
  ): Promise<BeatSaverAPIResponse<BeatsaverBeatmap>> {
    return this.makeRequest<BeatsaverBeatmap>(
      `${GET_BY_HASH}/${hash}/`,
      isBeatsaverBeatmap
    );
  }

  public async getBeatmapByKey(
    key: string
  ): Promise<BeatSaverAPIResponse<BeatsaverBeatmap>> {
    return this.makeRequest<BeatsaverBeatmap>(
      `${GET_BY_KEY}/${key}/`,
      isBeatsaverBeatmap
    );
  }

  public async searchBeatmaps(
    search: string,
    page: number = 0
  ): Promise<BeatSaverAPIResponse<BeatsaverPage>> {
    return this.makeRequest<BeatsaverPage>(`${SEARCH}/${page}?q=${search}`);
  }

  public async getByHot(
    page: number = 0
  ): Promise<BeatSaverAPIResponse<BeatsaverPage>> {
    return this.makeRequest<BeatsaverPage>(`${GET_BY_HOT}/${page}`);
  }

  public async getByPlays(
    page: number = 0
  ): Promise<BeatSaverAPIResponse<BeatsaverPage>> {
    return this.makeRequest<BeatsaverPage>(`${GET_BY_PLAYS}/${page}`);
  }

  public async getByDownloads(
    page: number = 0
  ): Promise<BeatSaverAPIResponse<BeatsaverPage>> {
    return this.makeRequest<BeatsaverPage>(`${GET_BY_DOWNLOADS}/${page}`);
  }

  public async getByLatest(
    page: number = 0
  ): Promise<BeatSaverAPIResponse<BeatsaverPage>> {
    return this.makeRequest<BeatsaverPage>(`${GET_BY_LATEST}/${page}`);
  }

  public async getByRating(
    page: number = 0
  ): Promise<BeatSaverAPIResponse<BeatsaverPage>> {
    return this.makeRequest<BeatsaverPage>(`${GET_BY_RATING}/${page}`);
  }

  public updateBaseUrl(baseUrl: BeatsaverServerUrl) {
    this.http = AxiosCachedFactory.getAxios(baseUrl);
  }

  private async makeRequest<T>(
    apiPath: string,
    validation?: (data: any) => boolean
  ): Promise<BeatSaverAPIResponse<T>> {
    if (BeatsaverRateLimitManager.HasHitRateLimit()) {
      return BeatsaverAPI.RateLimitedAnswer<T>();
    }

    return this.http
      .get(apiPath, {
        validateStatus: (status: number) => status === 200,
      })
      .then((answer) =>
        BeatsaverAPI.handleResourceFoundCase<T>(validation, answer)
      )
      .catch((error: AxiosError) =>
        BeatsaverAPI.handleResourceNotFoundCase<T>(error)
      );
  }

  private static handleResourceFoundCase<T>(
    validation: ((data: any) => boolean) | undefined,
    answer: AxiosResponse<T>
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
    if (error.response?.status === 429) {
      return BeatsaverAPI.handleRateLimitedCase<T>(error);
    }

    if (error.code === "ECONNABORTED") {
      return BeatsaverAPI.handleTimeoutCase<T>();
    }

    return {
      status:
        error.response?.status === 404
          ? BeatSaverAPIResponseStatus.ResourceNotFound
          : BeatSaverAPIResponseStatus.ServerNotAvailable,
      statusCode: error.response?.status,
      statusMessage: error.response
        ? http.STATUS_CODES[error.response.status]
        : "",
    } as BeatSaverAPIResponse<T>;
  }

  private static handleRateLimitedCase<T>(error: AxiosError) {
    const remainingHeader = error.response?.headers["rate-limit-remaining"];
    const totalHeader = error.response?.headers["rate-limit-total"];
    let resetHeader = error.response?.headers["rate-limit-reset"];

    if (resetHeader !== undefined) {
      resetHeader = new Date(resetHeader * 1000); // sec to ms
      BeatsaverRateLimitManager.NotifyRateLimit(resetHeader);
    }

    return {
      status: BeatSaverAPIResponseStatus.RateLimited,
      remaining: remainingHeader,
      resetAt: resetHeader,
      total: totalHeader,
    } as BeatSaverAPIResponse<T>;
  }

  private static handleTimeoutCase<T>() {
    return {
      status: BeatSaverAPIResponseStatus.Timeout,
    } as BeatSaverAPIResponse<T>;
  }

  private static RateLimitedAnswer<T>() {
    return {
      status: BeatSaverAPIResponseStatus.RateLimited,
      remaining: 0,
      resetAt: BeatsaverRateLimitManager.GetResetDate(),
      total: undefined,
    } as BeatSaverAPIResponse<T>;
  }
}
