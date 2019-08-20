<template>
  <v-img v-if="imageData.length > 0" :src="imageData" aspect-ratio="1" contain></v-img>
  <v-progress-circular v-else indeterminate></v-progress-circular>
</template>

<script>
  import Vue from 'vue';
  import SongLoader from '../lib/SongLoader';
  import BeatSaverAPI from '../lib/BeatSaverAPI';

  export default Vue.extend({
    name: 'SongCover',
    props: {song: {type: Object, required: true}},
    data: () => ({
      imageData: '',
    }),
    methods: {
      LoadImage() {
        if ('coverImage' in this.song) {
          SongLoader
            .LoadCover(this.song.path, this.song.coverImage)
            .then((data) => this.imageData = data);
        } else if ('coverURL' in this.song) {
          this.imageData = BeatSaverAPI.FullCoverUrl(this.song.coverURL);
        }
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
