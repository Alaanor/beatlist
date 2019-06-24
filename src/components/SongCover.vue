<template>
  <v-img v-if="imageData.length > 0" :src="imageData"></v-img>
  <v-progress-circular v-else indeterminate></v-progress-circular>
</template>

<script>
  import SongData from '../lib/SongData';

  export default {
    name: 'SongCover',
    props: {song: {type: Object, required: true}},
    data: () => ({
      imageData: '',
    }),
    methods: {
      LoadImage() {
        SongData
          .LoadCover(this.song.songPath, this.song.coverImagePath)
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
  }
</script>

<style scoped>

</style>
