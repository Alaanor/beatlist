import { Beatmap } from "@/libraries/beatmap/Beatmap";
import Base64FileReader from "@/libraries/ipc/Base64FileReader";

export default class BeatmapLocalUtilities {
  public static async GetAudioSrcBase64(beatmap: Beatmap): Promise<string> {
    const base64src = await Base64FileReader.read(beatmap.songPath);
    return `data:audio/wav;base64,${base64src}`;
  }
}
