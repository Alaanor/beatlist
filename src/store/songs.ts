import {make} from 'vuex-pathify';
import BeatSaber from '../lib/BeatSaber';
import Playlist from '../lib/Playlist';
import Song from '@/lib/data/Song';
import ISongLocal from '@/lib/data/ISongLocal';
import SongLocal from '../lib/data/SongLocal';

const state = {
  lastScan: undefined,
  songs: undefined,
  playlists: [],
};

const getters = {
  ...make.getters(state),
  songs: ({songs}: { songs: ISongLocal[] }) => {
    if (songs !== undefined) {
      return songs
        .map((song: ISongLocal) => new SongLocal(song))
        .filter((s: ISongLocal) => s.valid);
    }

    return songs;
  },
  noFilterSongs: ({songs}: {songs: ISongLocal[]}) => {
    return songs;
  },
};

const mutations = {
  ...make.mutations(state),
  addSongToPlaylist(context: any, {playlist, song}: { playlist: Playlist, song: Song }) {
    const pl = context.playlists
      .find((p: Playlist) => p.playlistHash === playlist.playlistHash);

    pl.songs.push(song);
    pl.Save();
  },
  removeSongFromPlaylist(context: any, {playlist, song}: { playlist: Playlist, song: Song }) {
    const pl = context.playlists
      .find((p: Playlist) => p.playlistHash === playlist.playlistHash);
    pl.songs = pl.songs.filter((s: Song) => s.hash !== song.hash);
    pl.Save();
  },
  markAsInvalid(context: any, song: Song) {
    context.songs.find((s: Song) => s === song).valid = false;
  },
};

const actions = {
  async loadPlaylists(context: any) {
    const instPath = context.rootState.settings.installationPath as string;
    const songs = (context.state.songs as ISongLocal[])
      .map((song: ISongLocal) => new SongLocal(song)); // @todo, it can be a online song too
    const beatSaber = new BeatSaber(instPath);
    context.commit('SET_PLAYLISTS', await beatSaber.getPlaylists(songs));
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
