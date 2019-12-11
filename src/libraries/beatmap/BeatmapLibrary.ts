import store from '../../plugins/store';
import { BeatmapLocal } from './BeatmapLocal';

export default class BeatmapLibrary {
  public static GetAllMaps(): BeatmapLocal[] {
    return store.getters['songs/songs'] as BeatmapLocal[];
  }
}
