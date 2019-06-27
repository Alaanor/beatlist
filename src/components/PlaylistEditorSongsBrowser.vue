<!--suppress ALL -->
<template>
  <ListViewerForSongs>
    <template #item-block-action="{item}">
      <v-spacer></v-spacer>
      <BtnToggleAddRemoveSongInPlaylist :song="item" :playlist="playlist" icon small label></BtnToggleAddRemoveSongInPlaylist>
    </template>
    <template #item-list-action="{item}">
      <BtnToggleAddRemoveSongInPlaylist :song="item" :playlist="playlist" icon></BtnToggleAddRemoveSongInPlaylist>
    </template>
  </ListViewerForSongs>
</template>

<script>
  import Vue from 'vue';
  import {get} from 'vuex-pathify';
  import ListViewerForSongs from './ListViewerForSongs';
  import BtnToggleAddRemoveSongInPlaylist from './BtnToggleAddRemoveSongInPlaylist';

  export default Vue.extend({
    name: 'PlaylistEditorSongsBrowser',
    props: {hash: {type: String, required: true}},
    components: {ListViewerForSongs, BtnToggleAddRemoveSongInPlaylist},
    computed: {
      playlist() {
        return this.playlists.find((p) => p.playlistHash === this.hash);
      },
      playlists: get('songs/playlists'),
    },
  });
</script>

<style scoped>

</style>
