import { BeatsaverBeatmap } from '@/libraries/net/beatsaver/BeatsaverBeatmap';
import BeatmapLibrary from '@/libraries/beatmap/BeatmapLibrary';
import BeatsaverAPI, { BeatSaverAPIResponseStatus } from '@/libraries/net/beatsaver/BeatsaverAPI';
import BeatsaverUtilities from '@/libraries/net/beatsaver/BeatsaverUtilities';
import { BeatmapLocal } from '@/libraries/beatmap/BeatmapLocal';
import Base64FileReader from '@/libraries/ipc/Base64FileReader';

export default class BeatmapLocalUtilities {
  public static async UpdateOnlineDataFor(beatmap: BeatsaverBeatmap): Promise<{ error?: string }> {
    const response = await BeatsaverAPI.Singleton.getBeatmapByKey(beatmap.key);

    if (response.status === BeatSaverAPIResponseStatus.ResourceFound) {
      BeatmapLibrary.UpdateMapOnlineData(response.data);
      return {};
    }

    return { error: BeatsaverUtilities.ErrorToMessage(response) };
  }

  public static async GetAudioSrcBase64(beatmap: BeatmapLocal): Promise<string> {
    const base64src = await Base64FileReader.read(beatmap.songPath);
    return `data:audio/wav;base64,${base64src}`;
  }
}
