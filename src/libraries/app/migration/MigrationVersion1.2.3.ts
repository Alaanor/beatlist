import store from "@/plugins/store";
import PlaylistLibrary from "@/libraries/playlist/PlaylistLibrary";

export default () => {
  const allPlaylist = PlaylistLibrary.GetAllPlaylists();
  const allPlaylistWithoutCover = allPlaylist.map((playlist) => {
    const copy = { ...playlist };
    copy.cover = null;
    return copy;
  });

  store.commit("playlist/SET_PLAYLISTS", allPlaylistWithoutCover);
};
