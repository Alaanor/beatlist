import { PlaylistBase } from "@/libraries/playlist/PlaylistLocal";

export default abstract class PlaylistSerializer {
  protected filepath: string;

  public constructor(filepath: string) {
    this.filepath = filepath;
  }

  public abstract serialize(playlist: PlaylistBase): Promise<void>;
}
