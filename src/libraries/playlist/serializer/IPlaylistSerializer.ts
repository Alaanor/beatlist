import { PlaylistLocal } from '@/libraries/playlist/PlaylistLocal';

export interface IPlaylistSerializer {
  serialize(playlist: PlaylistLocal, filepath: string): Promise<void>;
  deserialize(filepath: string): PlaylistLocal;
}

export enum PlaylistExportType {
  Json = 'Json',
  Blister = 'Blister',
}
