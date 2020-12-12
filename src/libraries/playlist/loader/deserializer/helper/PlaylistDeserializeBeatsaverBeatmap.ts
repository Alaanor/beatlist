import * as Throttle from "promise-parallel-throttle";
import { BeatsaverItem } from "@/libraries/beatmap/repo/BeatsaverItem";
import {
  BeatsaverKey,
  BeatsaverKeyType,
} from "@/libraries/beatmap/repo/BeatsaverKeyType";
import Progress from "@/libraries/common/Progress";
import BeatsaverCacheManager from "@/libraries/beatmap/repo/BeatsaverCacheManager";

const MAX_CONCURRENCY_ITEM = 3;

export default class PlaylistDeserializeBeatsaverBeatmap {
  public static async fromHash(hash: string): Promise<BeatsaverItem> {
    const k: BeatsaverKey = {
      type: BeatsaverKeyType.Hash,
      value: hash.toUpperCase(),
    };
    return BeatsaverCacheManager.forceGetCacheBeatmap(k);
  }

  public static async fromKey(key: string): Promise<BeatsaverItem> {
    const k: BeatsaverKey = {
      type: BeatsaverKeyType.Key,
      value: key.toUpperCase(),
    };
    return BeatsaverCacheManager.forceGetCacheBeatmap(k);
  }

  public static async convert(
    identifiers: { key?: string; hash?: string }[],
    progress: Progress
  ) {
    progress.setTotal(identifiers.length);

    return Throttle.all(
      identifiers.map((identifier) => async () =>
        this.fromAny(identifier).then((item) => {
          progress.plusOne();
          return item;
        })
      ),
      { maxInProgress: MAX_CONCURRENCY_ITEM }
    );
  }

  private static async fromAny(identifier: { key?: string; hash?: string }) {
    if (identifier.hash) {
      return this.fromHash(identifier.hash);
    }
    if (identifier.key) {
      return this.fromKey(identifier.key);
    }
    return undefined;
  }
}
