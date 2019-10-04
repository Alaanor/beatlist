<template>
  <v-img v-if="imageData.length > 0" :src="imageData" aspect-ratio="1" contain></v-img>
  <v-progress-circular width="2" size="24" v-else indeterminate></v-progress-circular>
</template>

<script>
  import Vue from 'vue';
  import Playlist from '@/lib/Playlist';

  export default Vue.extend({
    name: 'PlaylistCover',
    props: {playlist: {type: Object, required: true}},
    data: () => ({
      imageData: '',
      latestFetch: undefined,
    }),
    methods: {
      LoadImage() {
        if (this.latestFetch) {
          this.latestFetch.cancel();
        }

        this.latestFetch = (() => {
          let hasCanceled = false;

          const promise = Playlist
            .LoadCover(this.playlist.playlistPath)
            .then((data) => {
              if (!hasCanceled) {
                this.imageData = data;
              }
            });

          return {
            promise,
            cancel() {
              hasCanceled = true;
            },
          };
        })();

      },
    },
    mounted() {
      this.$nextTick(() => {
        this.LoadImage();
      });
    },
    watch: {
      playlist() {
        this.imageData = '';
        this.LoadImage();
      },
    },
  });
</script>

<style scoped>

</style>
