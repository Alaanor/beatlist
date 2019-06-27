<!--suppress ALL -->
<template>
  <v-container>
    <h1>Song list</h1>
    <ListViewerForSongs>
      <template #item-block-action="{item}">
        <BtnAddSongToPlaylist :song="item" label="Add to playlist"></BtnAddSongToPlaylist>
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
  import BtnAddSongToPlaylist from '@/components/BtnAddSongToPlaylist.vue';

  export default Vue.extend({
    name: 'SongList',
    components: { ListViewerForSongs, BtnAddSongToPlaylist }
  });
</script>
