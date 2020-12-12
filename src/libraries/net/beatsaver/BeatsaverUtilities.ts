import url from "url";
import {
  BeatsaverBeatmap,
  BeatsaverPage,
} from "@/libraries/net/beatsaver/BeatsaverBeatmap";
import {
  BeatSaverAPIResponse,
  BeatSaverAPIResponseStatus,
} from "@/libraries/net/beatsaver/BeatsaverAPI";

const BEATSAVER_DOMAIN = "https://beatsaver.com/";

export default class BeatsaverUtilities {
  public static GetImageSrcFrom(beatmap: BeatsaverBeatmap): string {
    return url.resolve(BEATSAVER_DOMAIN, beatmap.coverURL);
  }

  public static GetDownloadUrl(beatmap: BeatsaverBeatmap): string {
    return url.resolve(BEATSAVER_DOMAIN, beatmap.downloadURL);
  }

  public static GetPageUrl(beatmap: BeatsaverBeatmap): string {
    return url.resolve(BEATSAVER_DOMAIN, `beatmap/${beatmap.key}`);
  }

  public static ErrorToMessage<T>(
    response: BeatSaverAPIResponse<T>
  ): string | undefined {
    switch (response.status) {
      case BeatSaverAPIResponseStatus.ResourceFoundButInvalidData:
        return "We got a response from the server but it's not what we expected :(";
      case BeatSaverAPIResponseStatus.ResourceNotFound:
      case BeatSaverAPIResponseStatus.ServerNotAvailable:
        return `Server is currently not available. [${response.statusCode}] ${response.statusMessage}`;
      case BeatSaverAPIResponseStatus.RateLimited:
        // eslint-disable-next-line no-case-declarations
        const rateLimitState = response.total
          ? `${response.remaining}/${response.total}`
          : "0 remaining, request skipped";
        return `We got rate-limited: ${rateLimitState} - reset at ${response.resetAt?.toLocaleString()}`;
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
