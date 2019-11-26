import IPlaylist from './IPlaylist';

export default interface IPlaylistLocal extends IPlaylist {
  playlistHash: string;
  playlistPath: string;
}
