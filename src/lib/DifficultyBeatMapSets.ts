import Difficulty from './Difficulty';

export default interface DifficultyBeatMapSets {
  _beatmapCharacteristicName: string | undefined;
  _difficultyBeatmaps: Difficulty[] | undefined;
}
