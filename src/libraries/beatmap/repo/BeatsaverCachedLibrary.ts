import { BeatsaverKey, BeatsaverKeyType } from '@/libraries/beatmap/repo/BeatsaverKeyType';
import { BeatsaverItem } from '@/libraries/beatmap/repo/BeatsaverItem';
import store from '@/plugins/store';

export default class BeatsaverCachedLibrary {
  public static Add(key: BeatsaverKey, item: BeatsaverItem) {
    store.commit('beatmap/addBeatsaberCached', { key, item });
  }

  public static exist(key: BeatsaverKey) {
    return this.get(key) !== undefined;
  }

  public static getByKey(key: string): BeatsaverItem | undefined {
    return this.getAll().find((item) => item.beatmap?.key === key);
  }

  public static getByHash(hash: string): BeatsaverItem | undefined {
    return store.getters[`beatmap/beatsaverCached@${hash}`];
  }

  public static getAll(): BeatsaverItem[] {
    return store.getters['beatmap/beatsaverCached'];
  }

  public static updateOne(item: BeatsaverItem) {
    store.commit('beatmap/updateBeatsaberCached', item);
  }

  public static getAllInvalid() {
    return this.getAll().filter((beatmap) => !beatmap.loadState.valid);
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
