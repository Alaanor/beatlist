<!--suppress ALL -->
<template>
  <v-container>
    <h1>Local songs</h1>
    <ListViewerForSongs>
      <template #item-block-action="{item}">
        <BtnAddSongToPlaylist :song="item" value="Add to playlist"></BtnAddSongToPlaylist>
      </template>
      <template #item-list-action="{item}">
        <BtnAddSongToPlaylist :song="item" icon></BtnAddSongToPlaylist>
      </template>
    </ListViewerForSongs>
  </v-container>
</template>

<script lang="ts">
  import Vue from 'vue';
  import ListViewerForSongs from '@/components/ListViewerForSongs.vue';
  import BtnAddSongToPlaylist from '@/components/BtnToggleAddRemoveSongInPlaylists.vue';

  export default Vue.extend({
    name: 'SongListLocal',
    components: { ListViewerForSongs, BtnAddSongToPlaylist },
  });
</script>
