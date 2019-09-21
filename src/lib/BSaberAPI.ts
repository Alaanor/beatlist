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

  public getPlaylists() {
    return this.http.get(PLAYLIST_API)
      .then((answer) => answer.data as IBSaberPlaylist);
  }

  public getPlaylist(playlist: IBSaberPlaylist): Promise<Playlist | undefined> {
    return axios.get(playlist.playlistURL)
      .then((answer) => answer.data as string)
      .then((raw) => Playlist.Parse(raw))
      .catch((err) => undefined);
  }
}
