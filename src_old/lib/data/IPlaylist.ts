import ISongInfo from '@/lib/data/ISongInfo';

export default interface IPlaylist {
  playlistTitle: string;
  playlistAuthor: string;
  playlistDescription: string;
  songs: ISongInfo[];
}

