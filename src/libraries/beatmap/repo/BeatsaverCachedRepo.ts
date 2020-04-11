import { BeatsaverBeatmap } from '@/libraries/net/beatsaver/BeatsaverBeatmap';
import BeatsaverAPI, { BeatSaverAPIResponse, BeatSaverAPIResponseStatus } from '@/libraries/net/beatsaver/BeatsaverAPI';
import { BeatsaverKeyType } from '@/libraries/beatmap/repo/BeatsaverKeyType';
import { BeatsaverItem, BeatsaverItemLoadError } from '@/libraries/beatmap/repo/BeatsaverItem';
import BeatmapLibrary from '@/libraries/beatmap/BeatmapLibrary';

export default class BeatsaverCachedRepo {
  public static async cacheBeatmap(keyType: BeatsaverKeyType, keyValue: string)
    : Promise<BeatsaverItem> {
    const existingBeatmap = BeatsaverCachedRepo.get(keyType, keyValue);

    if (existingBeatmap !== undefined) {
      return existingBeatmap;
    }

    const beatsaverItem = await BeatsaverCachedRepo.getOnlineData(keyType, keyValue);
    BeatmapLibrary.AddBeatsaverCachedMap(beatsaverItem);
    return beatsaverItem;
  }

  private static async getOnlineData(keyType: BeatsaverKeyType, keyValue: string)
    : Promise<BeatsaverItem> {
    let response: BeatSaverAPIResponse<BeatsaverBeatmap>;
    const item = {
      beatmap: undefined,
      loadState: {
        valid: false,
      },
    } as BeatsaverItem;

    switch (keyType) {
      case BeatsaverKeyType.Hash:
        response = await BeatsaverAPI.Singleton.getBeatmapByHash(keyValue);
        break;
      case BeatsaverKeyType.Key:
        response = await BeatsaverAPI.Singleton.getBeatmapByKey(keyValue);
        break;
      default:
        throw new Error('Unexpected key type');
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
        item.loadState.errorType = BeatsaverItemLoadError.InvalidDataReceivedFromBeatsaver;
        item.loadState.errorMessage = `Failed to parse as a BeatsaverBeatmap: ${response.rawData?.toString()}`;
        break;

      case BeatSaverAPIResponseStatus.RateLimited:
        item.loadState.errorType = BeatsaverItemLoadError.BeatsaverRateLimited;
        item.loadState.errorMessage = `We got rate limited: (${response.remaining}/${response.total}) reset at: ${response.resetAt?.toLocaleString()}`;
        break;

      case BeatSaverAPIResponseStatus.ServerNotAvailable:
        item.loadState.errorType = BeatsaverItemLoadError.BeatsaverServerNotAvailable;
        item.loadState.errorMessage = `${response.statusCode}: ${response.statusMessage}`;
        break;

      default:
        item.loadState.errorType = BeatsaverItemLoadError.Unknown;
    }

    return item;
  }

  public static exist(keyType: BeatsaverKeyType, keyValue: string) {
    return BeatsaverCachedRepo.get(keyType, keyValue) !== undefined;
  }

  public static get(keyType: BeatsaverKeyType, keyValue: string) {
    switch (keyType) {
      case BeatsaverKeyType.Hash:
        return this.getByHash(keyValue);
      case BeatsaverKeyType.Key:
        return this.getByKey(keyValue);
      default:
        throw new Error('Unexpected key type');
    }
  }

  public static getByKey(key: string): BeatsaverItem | undefined {
    return this.getAll().find((item) => item.beatmap?.key === key);
  }

  public static getByHash(hash: string): BeatsaverItem | undefined {
    return this.getAll().find((item) => item.beatmap?.hash === hash);
  }

  private static getAll(): BeatsaverItem[] {
    return BeatmapLibrary.GetAllBeatsaverCached();
  }

  public static async updateOne(hash: string) {
    const item = await BeatsaverCachedRepo.getOnlineData(BeatsaverKeyType.Hash, hash);
    BeatmapLibrary.UpdateBeatsaverCachedMap(item);
  }
}
