import { BeatsaverBeatmap } from '@/libraries/net/beatsaver/BeatsaverBeatmap';
import BeatmapLibrary from '@/libraries/beatmap/BeatmapLibrary';
import BeatsaverAPI, { BeatSaverAPIResponseStatus } from '@/libraries/net/beatsaver/BeatsaverAPI';
import BeatsaverUtilities from '@/libraries/net/beatsaver/BeatsaverUtilities';

export default class BeatmapLocalUtilities {
  public static async UpdateOnlineDataFor(beatmap: BeatsaverBeatmap): Promise<{ error?: string }> {
    const response = await BeatsaverAPI.Singleton.getBeatmapByKey(beatmap.key);

    if (response.status === BeatSaverAPIResponseStatus.ResourceFound) {
      BeatmapLibrary.UpdateMapOnlineData(response.data);
      return {};
    }

    return { error: BeatsaverUtilities.ErrorToMessage(response) };
  }
}
