import SongLocal from '@/lib/data/SongLocal';
import SongOnline from '@/lib/data/SongOnline';

export default class SongHelper {

  public static async getSong(key: string) {
    const song = SongLocal.get(key);
    return song ? song : await SongOnline.get(key);
  }

}
