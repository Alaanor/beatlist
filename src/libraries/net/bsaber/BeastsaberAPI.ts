import { AxiosInstance } from "axios";
import AxiosCachedFactory from "@/libraries/net/AxiosCachedFactory";
import {
  BeastsaberAPIResponse,
  BeastsaberAPIResponseStatus,
} from "@/libraries/net/bsaber/BeastsaberAPIResponse";

const WEBSITE_BASE_URL = "https://bsaber.com";
const PLAYLIST_API_ENDPOINT = "PlaylistAPI/playlistAPI.json";

export default class BeastsaberAPI {
  public static Singleton: BeastsaberAPI = new BeastsaberAPI();

  public http: AxiosInstance;

  private constructor() {
    this.http = AxiosCachedFactory.getAxios(WEBSITE_BASE_URL);
  }

  public async GetPlaylists(): Promise<BeastsaberAPIResponse> {
    return this.http
      .get(PLAYLIST_API_ENDPOINT)
      .then((res) => {
        return {
          status: BeastsaberAPIResponseStatus.Success,
          data: res.data,
        } as BeastsaberAPIResponse;
      })
      .catch((e: Error) => {
        return {
          status: BeastsaberAPIResponseStatus.Failed,
          error: e.message,
        } as BeastsaberAPIResponse;
      });
  }
}
