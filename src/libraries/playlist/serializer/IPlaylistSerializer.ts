import { PlaylistBase } from '@/libraries/playlist/PlaylistLocal';

export interface IPlaylistSerializer {
  serialize(playlist: PlaylistBase, filepath: string): Promise<void>;
}
