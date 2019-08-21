<template>
  <v-img v-if="imageData.length > 0" :src="imageData" aspect-ratio="1" contain></v-img>
  <v-progress-circular v-else indeterminate></v-progress-circular>
</template>

<script>
  import Vue from 'vue';

  export default Vue.extend({
    name: 'SongCover',
    props: {song: {type: Object, required: true}},
    data: () => ({
      imageData: '',
    }),
    methods: {
      LoadImage() {
        this.song.getImage().then((src) => this.imageData = src);
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
