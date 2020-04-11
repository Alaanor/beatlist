import { BeatmapLocal } from '@/libraries/beatmap/BeatmapLocal';
import Base64FileReader from '@/libraries/ipc/Base64FileReader';

export default class BeatmapLocalUtilities {
  public static async GetAudioSrcBase64(beatmap: BeatmapLocal): Promise<string> {
    const base64src = await Base64FileReader.read(beatmap.songPath);
    return `data:audio/wav;base64,${base64src}`;
  }
}
