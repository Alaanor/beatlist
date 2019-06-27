<!--suppress ALL -->
<template>
  <v-container>
    <h1>Song list</h1>
    <ListViewerForSongs>
      <template #item-block-action="{item}">
        <AddToPlaylistBtn :song="item" label="Add to playlist"></AddToPlaylistBtn>
      </template>
      <template #item-list-action="{item}">
        <AddToPlaylistBtn :song="item" icon></AddToPlaylistBtn>
      </template>
    </ListViewerForSongs>
  </v-container>
</template>

<script lang="ts">
  import Vue from 'vue';
  import ListViewerForSongs from '@/components/ListViewerForSongs.vue';
  import AddToPlaylistBtn from '@/components/AddToPlaylistBtn.vue';

  export default Vue.extend({
    name: 'SongList',
    components: { ListViewerForSongs, AddToPlaylistBtn }
  });
</script>
