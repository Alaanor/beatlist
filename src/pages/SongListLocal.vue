<!--suppress ALL -->
<template>
  <v-container>
    <h1>Local songs</h1>
    <ListViewerForSongs>
      <template #item-block-action="{item}">
        <BtnAddSongToPlaylists :song="item" value="Add to playlist"></BtnAddSongToPlaylists>
      </template>
      <template #item-list-action="{item}">
        <BtnAddSongToPlaylists :song="item" icon></BtnAddSongToPlaylists>
      </template>
    </ListViewerForSongs>
  </v-container>
</template>

<script lang="ts">
  import Vue from 'vue';
  import ListViewerForSongs from '@/components/ListViewerForSongs.vue';
  import BtnAddSongToPlaylists from '@/components/BtnToggleAddRemoveSongInPlaylists.vue';

  export default Vue.extend({
    name: 'SongListLocal',
    components: { ListViewerForSongs, BtnAddSongToPlaylists },
  });
</script>
