import store from '../store/store';
import BeatSaber from './BeatSaber';
import SongLocal from './data/SongLocal';
import SongLoader from './SongLoader';
import SongHashData from './SongHashData';

export default class SongScanner {

  public totalSongs: number = -1;
  public songScanned: number = -1;
  public totalNewSongsToScan: number = -1;
  public totalNewSongsScanned: number = -1;

  public async Scan() {
    const installationPath = store.getters['settings/installationPath'];
    const availableSongs = await new BeatSaber(installationPath).getSongList();
    let cachedSongs = store.getters['songs/songs'] || [];

    const songsToParse = availableSongs.filter((path) =>
      !cachedSongs.some((s: SongLocal) => s.path === path),
    );

    cachedSongs = cachedSongs.filter((s: SongLocal) =>
      availableSongs.some((p: string) => p === s.path),
    );

    await SongHashData.forceInit();

    this.totalNewSongsToScan = songsToParse.length;
    this.songScanned = 0;

    const songs = await Promise.all(songsToParse.map((path: string) =>
      SongLoader
        .LoadInfo(path)
        .then((s: SongLocal) => {
          this.songScanned++;
          return s;
        }),
    ));

    songs.push(...cachedSongs);

    this.totalNewSongsScanned = songs.filter((s: SongLocal) => s.valid).length;
    this.totalSongs = cachedSongs.length + songsToParse.length;

    store.commit('songs/SET_SONGS', songs);

    SongLoader.DetectDuplicate(store.getters['songs/songs']);
  }

}
