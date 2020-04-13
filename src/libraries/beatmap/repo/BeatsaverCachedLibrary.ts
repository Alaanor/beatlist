import { BeatsaverKey, BeatsaverKeyType, toStrKey } from '@/libraries/beatmap/repo/BeatsaverKeyType';
import { BeatsaverItem } from '@/libraries/beatmap/repo/BeatsaverItem';
import store from '@/plugins/store';

export default class BeatsaverCachedLibrary {
  public static Add(key: BeatsaverKey, item: BeatsaverItem) {
    store.commit('beatmap/addBeatsaberCached', { key, item });
  }

  public static exist(key: BeatsaverKey) {
    return BeatsaverCachedLibrary.get(key) !== undefined;
  }

  public static getByKey(key: string): BeatsaverItem | undefined {
    return Array.from(BeatsaverCachedLibrary.getAll().values())
      .find((item) => item.beatmap?.key === key);
  }

  public static getByHash(hash: string): BeatsaverItem | undefined {
    const key = toStrKey({ type: BeatsaverKeyType.Hash, value: hash });
    return BeatsaverCachedLibrary.getAll().get(key);
  }

  public static getAll(): Map<string, BeatsaverItem> {
    return store.getters['beatmap/beatsaverCached'];
  }

  public static updateOne(item: BeatsaverItem) {
    store.commit('beatmap/updateBeatsaberCached', item);
  }

  public static getAllInvalid() {
    return Array.from(BeatsaverCachedLibrary.getAll().values())
      .filter((beatmap) => !beatmap.loadState.valid);
  }

  public static get(key: BeatsaverKey) {
    switch (key.type) {
      case BeatsaverKeyType.Hash:
        return BeatsaverCachedLibrary.getByHash(key.value);
      case BeatsaverKeyType.Key:
        return BeatsaverCachedLibrary.getByKey(key.value);
      default:
        throw new Error('Unexpected key type');
    }
  }
}
