import Difficulty from '@/lib/Difficulty';

export default interface DifficultyBeatMapSets {
  _beatmapCharacteristicName: string | undefined;
  _difficultyBeatmaps: Difficulty[] | undefined;
}
