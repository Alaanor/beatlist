import fs from 'fs-extra';
import PlaylistSerializer from '@/libraries/playlist/loader/serializer/PlaylistSerializer';
import { PlaylistBase, PlaylistMap } from '@/libraries/playlist/PlaylistLocal';
import Base64SrcLoader from '@/libraries/os/utils/Base64SrcLoader';

export default class JsonSerializer extends PlaylistSerializer {
  // eslint-disable-next-line class-methods-use-this
  public async serialize(playlist: PlaylistBase): Promise<void> {
    const data = JsonSerializer.format(playlist);
    await fs.writeFile(this.filepath, JSON.stringify(data));
  }

  private static format(playlist: PlaylistBase) {
    return {
      playlistTitle: playlist.title,
      playlistAuthor: playlist.author,
      playlistDescription: playlist.description,
      image: playlist.cover ? Base64SrcLoader.FromBuffer(playlist.cover, 'png') : '',
      songs: playlist.maps.map((beatmap: PlaylistMap) => ({
        hash: beatmap.hash,
      })),
    };
  }
}
