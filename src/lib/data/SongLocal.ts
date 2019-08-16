import SongInfo from '@/lib/data/SongInfo';

export default interface SongLocal {
  info: SongInfo;

  path: string | undefined;
  filename: string | undefined;
  coverImage: string | undefined;
  folderId: string | undefined;

  valid: boolean;
}
