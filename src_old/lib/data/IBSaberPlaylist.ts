import IPlaylistOnline from '@/lib/data/IPlaylistOnline';

export default interface IBSaberPlaylist extends IPlaylistOnline {
  playlistTitle: string;
  playlistDescription: string;
  playlistAuthor: string;
  playlistSongCount: number;
  playlistDate: Date;
  playlistCategory: string;
  playlistURL: string;
  image: string;
}
