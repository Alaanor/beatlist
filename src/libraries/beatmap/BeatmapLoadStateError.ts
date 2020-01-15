enum BeatmapLoadStateError{
  BeatmapNotOnBeatsaver = 0,
  FailedToComputeHash = 1,
  NoInfoDatFileFound = 2,
  NoCoverImageFound = 3,
  NoSoundFileFound = 4,
  BeatsaverServerNotAvailable = 6,
  InvalidDataReceivedFromBeatsaver = 7,
  BeatsaverRateLimited = 8,
  Unknown = 9,
}

export default BeatmapLoadStateError;
