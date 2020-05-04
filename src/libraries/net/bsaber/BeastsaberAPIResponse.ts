import BeastsaberPlaylist from "@/libraries/net/bsaber/BeastsaberPlaylist";

export type BeastsaberAPIResponse = BeastsaberAPIResponseBase &
  (BeastsaberAPIResponseSuccess | BeastsaberAPIResponseFailed);

export interface BeastsaberAPIResponseBase {
  status: BeastsaberAPIResponseStatus;
}

export interface BeastsaberAPIResponseSuccess {
  status: BeastsaberAPIResponseStatus.Success;
  data: BeastsaberPlaylist[];
}

export interface BeastsaberAPIResponseFailed {
  status: BeastsaberAPIResponseStatus.Failed;
  error: string;
}

export enum BeastsaberAPIResponseStatus {
  Success = 0,
  Failed = 1,
}
