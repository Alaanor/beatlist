<template>
  <v-card v-if="data !== undefined" width="305px" height="160px">
    <v-layout justify-space-between row>
      <v-flex xs5>
        <v-img :src="imageData" height="100px" contain class="mx-2"></v-img>
      </v-flex>
      <v-flex xs7>
        <div>
          <v-container pa-0>
            <div class="subheading">{{data.songName}}</div>
            <div class="caption">{{data.songSubName}}</div>
            <div class="caption text-truncate">{{data.songAuthorName}}</div>
            <div class="caption">{{data.levelAuthorName}}</div>
          </v-container>
        </div>
      </v-flex>
    </v-layout>
    <v-divider light></v-divider>
    <v-card-actions class="pa-2">
      <v-btn flat small pa-0>Add to playlist</v-btn>
      <v-spacer></v-spacer>
      <span><v-icon small>fa-heartbeat</v-icon> {{data.beatsPerMinute | forceInt}}</span>
    </v-card-actions>
  </v-card>
</template>

<script>
  import Vue from 'vue';
  import SongData from '../lib/SongData';

  export default Vue.extend({
    name: 'Song',
    data: () => ({
      imageData: '',
    }),
    props: {data: {type: Object, required: true}},
    filters: {
      forceInt(value) {
        return Number.parseInt(value, 10).toString();
      },
    },
    methods: {
      LoadImage() {
        const song = this.$props.data;
        if (song.valid) {
          SongData
            .LoadCover(song.songPath, song.coverImagePath)
            .then((data) => this.imageData = data);
        }
      },
    },
    mounted() {
      this.$nextTick(async function() {
        this.LoadImage();
      });
    },
    watch: {
      data() {
        this.imageData = '';
        this.LoadImage();
      },
    },
  });
</script>

<style scoped>

</style>
