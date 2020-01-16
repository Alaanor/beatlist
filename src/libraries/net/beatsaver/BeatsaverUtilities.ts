import url from 'url';
import { BeatsaverBeatmap, BeatsaverPage } from '@/libraries/net/beatsaver/BeatsaverBeatmap';
import { BeatSaverAPIResponse, BeatSaverAPIResponseStatus } from '@/libraries/net/beatsaver/BeatsaverAPI';

const BEATSAVER_DOMAIN = 'https://beatsaver.com/';

export default class BeatsaverUtilities {
  public static GetImageSrcFrom(beatmap: BeatsaverBeatmap) {
    return url.resolve(BEATSAVER_DOMAIN, beatmap.coverURL);
  }

  public static ErrorToMessage<T>(response: BeatSaverAPIResponse<T>): string | undefined {
    switch (response.status) {
      case BeatSaverAPIResponseStatus.ResourceFoundButInvalidData:
        return "We got a response from the server but it's not what we expected :(";
      case BeatSaverAPIResponseStatus.ResourceNotFound:
      case BeatSaverAPIResponseStatus.ServerNotAvailable:
        return `Server is currently not available. [${response.statusCode}] ${response.statusMessage}`;
      case BeatSaverAPIResponseStatus.RateLimited:
        return `We got rate-limited: ${response.remaining}/${response.total} - reset at ${response.resetAt?.toLocaleString()}`;
      case BeatSaverAPIResponseStatus.ResourceFound:
      default:
        return undefined;
    }
  }

  public static WrapInPage(beatmap: BeatsaverBeatmap): BeatsaverPage {
    return {
      docs: [beatmap],
      totalDocs: 1,
      prevPage: null,
      nextPage: null,
      lastPage: 1,
    } as BeatsaverPage;
  }

  public static GetEmptyPage(): BeatsaverPage {
    return {
      docs: [],
      totalDocs: 0,
      prevPage: null,
      nextPage: null,
      lastPage: 0,
    } as BeatsaverPage;
  }
}
