import axios, {AxiosAdapter, AxiosInstance} from 'axios';
import {cacheAdapterEnhancer, throttleAdapterEnhancer} from 'axios-extensions';
import IBSaberPlaylist from '@/lib/data/IBSaberPlaylist';
import Playlist from '@/lib/Playlist';

const CORS_ANYWHERE = 'https://cors-anywhere.herokuapp.com/';
const API_BASE_URL = 'https://bsaber.com/';
const PLAYLIST_API = 'PlaylistAPI/playlistAPI.json';

export default class BSaberAPI {
  public static Singleton: BSaberAPI = new BSaberAPI();

  public http: AxiosInstance;

  public constructor() {
    this.http = axios.create({
      baseURL: CORS_ANYWHERE + API_BASE_URL,
      adapter: throttleAdapterEnhancer(cacheAdapterEnhancer(axios.defaults.adapter as AxiosAdapter)),
    });
  }

  public getPlaylists(): Promise<IBSaberPlaylist[] | undefined>{
    return this.http.get(PLAYLIST_API)
      .then((answer) => answer.data as IBSaberPlaylist[])
      .catch(() => undefined);
  }

  public getPlaylist(playlist: IBSaberPlaylist): Promise<Playlist | undefined> {
    return axios.get(CORS_ANYWHERE + playlist.playlistURL)
      .then((answer) => JSON.stringify(answer.data))
      .then((raw) => Playlist.Parse(raw))
      .catch(() => undefined);
  }
}
