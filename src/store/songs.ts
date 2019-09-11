import {make} from 'vuex-pathify';
import BeatSaber from '../lib/BeatSaber';
import Playlist from '../lib/Playlist';
import Song from '../lib/data/Song';
import ISongLocal from '../lib/data/ISongLocal';
import SongLocal from '../lib/data/SongLocal';
import ISongInfo from '../lib/data/ISongInfo';
import SongOnline from '../lib/data/SongOnline';
import store from '@/store/store';

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
  playlists: ({playlists}: {playlists: Playlist[]}) => {
    return playlists.map((p: Playlist) => {
      const playlist = Playlist.Copy(p);

      playlist.songs = p.songs.map((s: ISongInfo) => {
        if (SongLocal.isSongLocal(s)) {
          return new SongLocal(s);
        }

        if (SongOnline.isSongOnline(s)) {
          return new SongOnline(s);
        }
      }) as ISongInfo[];

      return playlist;
    });
  },
};

const mutations = {
  ...make.mutations(state),
  addSongToPlaylist(context: any, {playlist, song}: { playlist: Playlist, song: Song }) {
    const pls = store.getters['songs/playlists'] as Playlist[];
    const plObj = pls.find((p: Playlist) => p.playlistHash === playlist.playlistHash);
    const plState = context.playlists.find((p: Playlist) => p.playlistHash === playlist.playlistHash);

    if (!!plObj) {
      plState.songs.push(song);
      plObj.Save();
    }
  },
  removeSongFromPlaylist(context: any, {playlist, song}: { playlist: Playlist, song: Song }) {
    const pls = store.getters['songs/playlists'] as Playlist[];
    const plObj = pls.find((p: Playlist) => p.playlistHash === playlist.playlistHash);
    const plState = context.playlists.find((p: Playlist) => p.playlistHash === playlist.playlistHash);

    if (!!plObj) {
      plState.songs = plState.songs.filter((s: Song) => s.hash !== song.hash);
      plObj.Save();
    }
  },
  markAsInvalid(context: any, song: Song) {
    context.songs.find((s: Song) => s === song).valid = false;
  },
  updateSongData(context: any, song: ISongLocal) {
    const index = context.songs.findIndex((s: ISongLocal) => s.key === song.key);

    if (index !== -1) {
      context.songs[index] = song;
    }
  },
};

const actions = {
  async loadPlaylists(context: any) {
    const instPath = context.rootState.settings.installationPath as string;
    const beatSaber = new BeatSaber(instPath);
    context.commit('SET_PLAYLISTS', await beatSaber.getPlaylists());
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
