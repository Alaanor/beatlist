import ISongInfo from '@/lib/data/ISongInfo';

export default interface ISongLocal extends ISongInfo {
  path: string;
  filename: string;
  coverImage: string;
  folderId: string;
  valid: boolean;
}
