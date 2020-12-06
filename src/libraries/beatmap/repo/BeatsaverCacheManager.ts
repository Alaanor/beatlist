import {
  BeatsaverKey,
  BeatsaverKeyType,
} from "@/libraries/beatmap/repo/BeatsaverKeyType";
import {
  BeatsaverItem,
  BeatsaverItemLoadError,
} from "@/libraries/beatmap/repo/BeatsaverItem";
import BeatsaverAPI, {
  BeatSaverAPIResponse,
  BeatSaverAPIResponseStatus,
} from "@/libraries/net/beatsaver/BeatsaverAPI";
import { BeatsaverBeatmap } from "@/libraries/net/beatsaver/BeatsaverBeatmap";
import BeatsaverCachedLibrary from "@/libraries/beatmap/repo/BeatsaverCachedLibrary";

export default class BeatsaverCacheManager {
  public static async forceGetCacheBeatmap(
    key: BeatsaverKey
  ): Promise<BeatsaverItem> {
    const existingBeatmap = BeatsaverCachedLibrary.Get(key);

    if (existingBeatmap !== undefined) {
      if (existingBeatmap.beatmap) {
        return existingBeatmap;
      }

      const OneDayInMs = 1000 * 60 * 60 * 24;
      const diffInMs = new Date().getTime() - existingBeatmap.date.getTime();
      const isOlderThan10Day = diffInMs / OneDayInMs > 10;

      const isRateLimited =
        existingBeatmap.loadState.errorType ===
        BeatsaverItemLoadError.BeatsaverRateLimited;
      const isTimeout =
        existingBeatmap.loadState.errorType ===
        BeatsaverItemLoadError.RequestTimeout;

      if (!isOlderThan10Day && !isRateLimited && !isTimeout) {
        return existingBeatmap;
      }

      if (isRateLimited || isTimeout) {
        BeatsaverCachedLibrary.RemoveInvalid(
          existingBeatmap.loadState.attemptedSource
        );
      }
    }

    const beatsaverItem = await BeatsaverCacheManager.getOnlineData(key);

    if (beatsaverItem.beatmap) {
      BeatsaverCachedLibrary.Add(beatsaverItem.beatmap.hash, beatsaverItem);
    } else {
      BeatsaverCachedLibrary.AddInvalid(key, beatsaverItem);
    }

    return beatsaverItem;
  }

  public static async updateOne(
    hash: string
  ): Promise<{ success: boolean; errMsg?: string }> {
    const key: BeatsaverKey = { type: BeatsaverKeyType.Hash, value: hash };
    const item = await BeatsaverCacheManager.getOnlineData(key);

    BeatsaverCachedLibrary.UpdateOne(item);

    return {
      success: item.loadState.valid,
      errMsg: item.loadState.errorMessage,
    };
  }

  private static async getOnlineData(
    key: BeatsaverKey
  ): Promise<BeatsaverItem> {
    let response: BeatSaverAPIResponse<BeatsaverBeatmap>;
    const item = {
      beatmap: undefined,
      loadState: {
        valid: false,
        attemptedSource: key,
      },
      date: new Date(),
    } as BeatsaverItem;

    switch (key.type) {
      case BeatsaverKeyType.Hash:
        response = await BeatsaverAPI.Singleton.getBeatmapByHash(key.value);
        break;
      case BeatsaverKeyType.Key:
        response = await BeatsaverAPI.Singleton.getBeatmapByKey(key.value);
        break;
      default:
        throw new Error("Unexpected key type");
    }

    switch (response.status) {
      case BeatSaverAPIResponseStatus.ResourceFound:
        item.beatmap = response.data;
        item.loadState.valid = true;
        break;

      case BeatSaverAPIResponseStatus.ResourceNotFound:
        item.loadState.errorType = BeatsaverItemLoadError.BeatmapNotOnBeatsaver;
        item.loadState.errorMessage = `${response.statusCode}: ${response.statusMessage}`;
        break;

      case BeatSaverAPIResponseStatus.ResourceFoundButInvalidData:
        item.loadState.errorType =
          BeatsaverItemLoadError.InvalidDataReceivedFromBeatsaver;
        item.loadState.errorMessage = `Failed to parse as a BeatsaverBeatmap: ${response.rawData?.toString()}`;
        break;

      case BeatSaverAPIResponseStatus.RateLimited:
        item.loadState.errorType = BeatsaverItemLoadError.BeatsaverRateLimited;
        item.loadState.errorMessage = `We got rate limited: (${
          response.remaining
        }/${response.total}) reset at: ${response.resetAt?.toLocaleString()}`;
        break;

      case BeatSaverAPIResponseStatus.ServerNotAvailable:
        item.loadState.errorType =
          BeatsaverItemLoadError.BeatsaverServerNotAvailable;
        item.loadState.errorMessage = `${response.statusCode}: ${response.statusMessage}`;
        break;

      case BeatSaverAPIResponseStatus.Timeout:
        item.loadState.errorType = BeatsaverItemLoadError.RequestTimeout;
        item.loadState.errorMessage = `Request timeout`;
        break;

      default:
        item.loadState.errorType = BeatsaverItemLoadError.Unknown;
    }

    return item;
  }
}
