import {
  BeatsaverKey,
  BeatsaverKeyType,
  toStrKey,
} from "@/libraries/beatmap/repo/BeatsaverKeyType";
import { BeatsaverItem } from "@/libraries/beatmap/repo/BeatsaverItem";
import store from "@/plugins/store";

export default class BeatsaverCachedLibrary {
  public static Add(key: BeatsaverKey, item: BeatsaverItem) {
    store.commit("beatmap/addBeatsaberCached", { key, item });
  }

  public static Exist(key: BeatsaverKey) {
    return BeatsaverCachedLibrary.Get(key) !== undefined;
  }

  public static GetByKey(key: string): BeatsaverItem | undefined {
    return Array.from(BeatsaverCachedLibrary.GetAll().values()).find(
      (item) => item.beatmap?.key === key
    );
  }

  public static GetByHash(hash: string): BeatsaverItem | undefined {
    const key = toStrKey({
      type: BeatsaverKeyType.Hash,
      value: hash.toUpperCase(),
    });
    return BeatsaverCachedLibrary.GetAll().get(key);
  }

  public static GetAll(): Map<string, BeatsaverItem> {
    return store.getters["beatmap/beatsaverCached"];
  }

  public static UpdateOne(item: BeatsaverItem) {
    store.commit("beatmap/updateBeatsaberCached", item);
  }

  public static GetAllInvalid() {
    return Array.from(BeatsaverCachedLibrary.GetAll().values()).filter(
      (beatmap) => !beatmap.loadState.valid
    );
  }

  public static Get(key: BeatsaverKey) {
    switch (key.type) {
      case BeatsaverKeyType.Hash:
        return BeatsaverCachedLibrary.GetByHash(key.value);
      case BeatsaverKeyType.Key:
        return BeatsaverCachedLibrary.GetByKey(key.value);
      default:
        throw new Error("Unexpected key type");
    }
  }

  public static ClearCache() {
    store.commit("beatmap/clearBeatsaverCache");
  }
}
