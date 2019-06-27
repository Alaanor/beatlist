<template>
  <p>@TODO</p>
</template>

<script>
  import Vue from 'vue';
  import {get} from 'vuex-pathify';

  export default Vue.extend({
    name: 'PlaylistEditorSongsAdder',
    props: {hash: {type: String, required: true}},
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
