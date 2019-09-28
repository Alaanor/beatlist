<template>
  <v-img v-if="imageData.length > 0" :src="imageData" aspect-ratio="1" contain>
    <template v-slot:placeholder>
      <v-row class="fill-height ma-0" align="center" justify="center">
        <v-icon large color="grey">mdi-cancel</v-icon>
      </v-row>
    </template>
  </v-img>
  <v-progress-circular v-else indeterminate></v-progress-circular>
</template>

<script>
  import Vue from 'vue';

  export default Vue.extend({
    name: 'SongCover',
    props: {song: {type: Object, required: true}},
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

          const promise = this.song.getImage().then((src) => {
            if (!hasCanceled) {
              this.imageData = src;
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
      song() {
        this.imageData = '';
        this.LoadImage();
      },
    },
  });
</script>

<style scoped>

</style>
