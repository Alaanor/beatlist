import {make} from 'vuex-pathify';
import SongLoader from '../lib/SongLoader';
import BeatSaber from '../lib/BeatSaber';
import Playlist from '../lib/Playlist';
import Song from '@/lib/data/Song';
import SongLocal from '@/lib/data/SongLocal';
import ISongLocal from '@/lib/data/ISongLocal';

const state = {
  lastScan: undefined,
  songs: undefined,
  playlists: [],
};

const getters = {
  songs: ({songs}: {songs: ISongLocal[]}) => {
    return songs.map((song: ISongLocal) => new SongLocal(song));
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
  getters,
  actions,
  mutations,
};
