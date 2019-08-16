import {make} from 'vuex-pathify';
import SongLoader from '../lib/SongLoader';
import BeatSaber from '../lib/BeatSaber';
import Playlist from '../lib/Playlist';

const state = {
  lastScan: undefined,
  songs: undefined,
  playlists: [],
};

const mutations = {
  ...make.mutations(state),
  addSongToPlaylist(context: any, {playlist, song}: { playlist: Playlist, song: SongLoader }) {
    const pl = context.playlists
      .find((p: Playlist) => p.playlistHash === playlist.playlistHash);

    pl.songs.push(song);
    pl.Save();
  },
  removeSongFromPlaylist(context: any, {playlist, song}: { playlist: Playlist, song: SongLoader }) {
    const pl = context.playlists
      .find((p: Playlist) => p.playlistHash === playlist.playlistHash);
    pl.songs = pl.songs.filter((s: SongLoader) => s.songHash !== song.songHash);
    pl.Save();
  },
  markAsInvalid(context: any, song: SongLoader) {
    context.songs.find((s: SongLoader) => s === song).valid = false;
  },
};

// noinspection JSUnusedGlobalSymbols
const actions = {
  async loadPlaylists(context: any) {
    const instPath = context.rootState.settings.installationPath as string;
    const songs = context.state.songs as SongLoader[];
    const beatSaber = new BeatSaber(instPath);
    context.commit('SET_PLAYLISTS', await beatSaber.getPlaylists(songs));
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
