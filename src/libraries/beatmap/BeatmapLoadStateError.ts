enum BeatmapLoadStateError{
  BeatmapNotOnBeatsaver = 0,
  FailedToComputeHash = 1,
  NoInfoDatFileFound = 2,
  NoCoverImageFound = 3,
  NoSoundFileFound = 4,
}

export default BeatmapLoadStateError;
