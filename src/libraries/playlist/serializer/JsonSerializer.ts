import fs from 'fs-extra';
import { IPlaylistSerializer } from '@/libraries/playlist/serializer/IPlaylistSerializer';
import { PlaylistBase, PlaylistMap } from '@/libraries/playlist/PlaylistLocal';
import Base64SrcLoader from '@/libraries/os/utils/Base64SrcLoader';

export default class JsonSerializer implements IPlaylistSerializer {
  // eslint-disable-next-line class-methods-use-this
  async serialize(playlist: PlaylistBase, filepath: string): Promise<void> {
    const data = JsonSerializer.format(playlist);
    await fs.writeFile(filepath, JSON.stringify(data));
  }

  private static format(playlist: PlaylistBase) {
    return {
      playlistTitle: playlist.title,
      playlistAuthor: playlist.author,
      playlistDescription: playlist.description,
      image: playlist.cover ? Base64SrcLoader.FromBuffer(playlist.cover, 'png') : '',
      songs: playlist.maps.map((beatmap: PlaylistMap) => ({
        songName: beatmap.online?.metadata.songName,
        hash: beatmap.online?.hash,
      })),
    };
  }
}
