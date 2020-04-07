import {
  BeatmapType, IBeatmap, IPlaylist, serialize,
} from 'blister.js';
import fs from 'fs-extra';
import { IPlaylistSerializer } from '@/libraries/playlist/serializer/IPlaylistSerializer';
import {
  PlaylistBase, PlaylistLocalMap, PlaylistOnlineMap,
} from '@/libraries/playlist/PlaylistLocal';

export default class BlisterSerializer implements IPlaylistSerializer {
  // eslint-disable-next-line class-methods-use-this
  async serialize(playlist: PlaylistBase, filepath: string): Promise<void> {
    const blisterPlaylist = await BlisterSerializer.convertToPlaylistBlister(playlist);
    await BlisterSerializer.write(blisterPlaylist, filepath);
  }

  private static async write(playlist: IPlaylist, filepath: string) {
    const buffer = await serialize(playlist);
    await fs.writeFile(filepath, buffer);
  }

  private static async convertToPlaylistBlister(playlist: PlaylistBase): Promise<IPlaylist> {
    const output = {} as IPlaylist;

    output.title = playlist.title;
    output.author = playlist.author;
    output.description = playlist.description;
    output.cover = playlist.cover;

    output.maps = playlist.maps.map((map: PlaylistLocalMap | PlaylistOnlineMap) => {
      if (!map.online?.hash) {
        return undefined;
      }

      return {
        dateAdded: map.dateAdded,
        type: BeatmapType.Hash,
        hash: Buffer.from(map.online.hash.toLowerCase(), 'hex'),
      } as IBeatmap;
    }).filter((map: IBeatmap | undefined) => map !== undefined) as IBeatmap[];

    return output;
  }
}
