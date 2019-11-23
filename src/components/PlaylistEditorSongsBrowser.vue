<template>
  <ListViewerForLocalSongs>
    <template #item-block-action="{item}">
      <v-spacer></v-spacer>
      <BtnToggleAddRemoveSongInPlaylist :song="item" :playlist="playlist" class="ma-2" icon small label></BtnToggleAddRemoveSongInPlaylist>
    </template>
    <template #item-list-action="{item}">
      <BtnToggleAddRemoveSongInPlaylist :song="item" :playlist="playlist" icon></BtnToggleAddRemoveSongInPlaylist>
    </template>
  </ListViewerForLocalSongs>
</template>

<script>
  import Vue from 'vue';
  import {get} from 'vuex-pathify';
  import BtnToggleAddRemoveSongInPlaylist from './BtnToggleAddRemoveSongInPlaylist';
  import ListViewerForLocalSongs from '@/components/ListViewerForLocalSongs';

  export default Vue.extend({
    name: 'PlaylistEditorSongsBrowser',
    props: {hash: {type: String, required: true}},
    components: {ListViewerForLocalSongs, BtnToggleAddRemoveSongInPlaylist},
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
