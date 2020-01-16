import url from 'url';
import { BeatsaverBeatmap } from '@/libraries/net/beatsaver/BeatsaverBeatmap';

const BEATSAVER_DOMAIN = 'https://beatsaver.com/';

export default class BeatsaverUtilities {
  public static GetImageSrcFrom(beatmap: BeatsaverBeatmap) {
    return url.resolve(BEATSAVER_DOMAIN, beatmap.coverURL);
  }
}
