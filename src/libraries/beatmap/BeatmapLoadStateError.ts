enum BeatmapLoadStateError{
  FailedToComputeHash = 0,
  NoInfoDatFileFound = 1,
  NoCoverImageFound = 2,
  NoSoundFileFound = 3,
  Unknown = 4,
}

export default BeatmapLoadStateError;
