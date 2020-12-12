import store from "@/plugins/store";
import PlaylistLibrary from "@/libraries/playlist/PlaylistLibrary";
import BeatsaverCachedLibrary from "@/libraries/beatmap/repo/BeatsaverCachedLibrary";
import {
  BeatsaverItemInvalid,
  BeatsaverItemLoadError,
} from "@/libraries/beatmap/repo/BeatsaverItem";

function RemoveAllCoverFromPlaylistCache() {
  const allPlaylist = PlaylistLibrary.GetAllPlaylists();
  const allPlaylistWithoutCover = allPlaylist.map((playlist) => {
    const copy = { ...playlist };
    copy.cover = null;
    return copy;
  });

  store.commit("playlist/SET_PLAYLISTS", allPlaylistWithoutCover);
}

function RemoveAllInvalidBeatmapFromInvalidCache() {
  const allInvalidBeatmap = BeatsaverCachedLibrary.GetAllInvalid();

  Array.from(allInvalidBeatmap.values()).forEach(
    (item: BeatsaverItemInvalid) => {
      if (
        item.loadState.errorType ===
        BeatsaverItemLoadError.BeatsaverServerNotAvailable
      ) {
        BeatsaverCachedLibrary.RemoveInvalid(item.loadState.attemptedSource);
      }
    }
  );
}

export default () => {
  RemoveAllCoverFromPlaylistCache();
  RemoveAllInvalidBeatmapFromInvalidCache();
};
