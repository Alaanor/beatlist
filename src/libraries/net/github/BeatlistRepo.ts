import { AxiosInstance } from 'axios';
import AxiosCachedFactory from '@/libraries/net/AxiosCachedFactory';

export default class BeatlistRepo {
  private static readonly baseUri: string = 'https://raw.githubusercontent.com/Alaanor/beatlist';

  private static readonly changelogUri: string = '/master/CHANGELOG.md';

  private readonly rawGithubHttp: AxiosInstance;

  constructor() {
    this.rawGithubHttp = AxiosCachedFactory.getAxios(BeatlistRepo.baseUri);
  }

  public GetChangelogContent(): Promise<string | undefined> {
    return this.rawGithubHttp.get(BeatlistRepo.changelogUri)
      .then((response) => response.data)
      .catch(() => undefined);
  }
}
