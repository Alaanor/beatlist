import IMetadata from '@/lib/data/IMetadata';

export default interface ISongInfo {
  metadata: IMetadata;
  key: string;
  hash: string;
}
