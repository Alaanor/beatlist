enum PlaylistLoadStateError {
  PathDoesntExist = 0,
  FailedToParseOldFormat = 1,
  FailedToParseNewFormat = 2,
  Unknown = 3,
}

export default PlaylistLoadStateError;
