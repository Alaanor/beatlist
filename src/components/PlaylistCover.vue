<template>
  <v-img v-if="imageData.length > 0" :src="imageData"></v-img>
  <v-progress-circular width="2" size="24" v-else indeterminate></v-progress-circular>
</template>

<script>
  import Vue from 'vue';
  import Playlist from '../lib/Playlist';

  export default Vue.extend({
    name: 'PlaylistCover',
    props: {playlist: {type: Object, required: true}},
    data: () => ({
      imageData: '',
    }),
    methods: {
      LoadImage() {
        Playlist
          .LoadCover(this.playlist.playlistPath)
          .then((data) => this.imageData = data);
      },
    },
    mounted() {
      this.$nextTick(() => {
        this.LoadImage();
      });
    },
    watch: {
      song() {
        this.imageData = '';
        this.LoadImage();
      },
    },
  });
</script>

<style scoped>

</style>
