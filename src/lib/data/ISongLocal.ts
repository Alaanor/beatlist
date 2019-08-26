import ISongInfo from '@/lib/data/ISongInfo';
import ISongOnline from '@/lib/data/ISongOnline';

export default interface ISongLocal extends ISongInfo {
  path: string;
  filename: string;
  coverImage: string;
  folderId: string | undefined;
  valid: boolean;
  onlineData: ISongOnline;
}
