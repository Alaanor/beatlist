import { PlaylistBase } from "@/libraries/playlist/PlaylistLocal";
import Progress from "@/libraries/common/Progress";

export default abstract class PlaylistDeserializer {
  protected filepath: string;

  public constructor(filepath: string) {
    this.filepath = filepath;
  }

  public abstract deserialize(progress?: Progress): Promise<PlaylistBase>;
}
