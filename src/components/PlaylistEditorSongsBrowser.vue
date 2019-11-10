<!--suppress ALL -->
<template>
  <ListViewerForSongs :items="songs">
    <template #item-block-action="{item}">
      <v-spacer></v-spacer>
      <BtnToggleAddRemoveSongInPlaylist :song="item" :playlist="playlist" class="ma-2" icon small label></BtnToggleAddRemoveSongInPlaylist>
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
        console.log(this.playlists);
        console.log(`We're looking for this hash: ${this.hash}`);
        return this.playlists.find((p) => p.playlistHash === this.hash);
      },
      playlists: get('songs/playlists'),
      songs: get('songs/songs'),
    },
  });
</script>

<style scoped>

</style>
