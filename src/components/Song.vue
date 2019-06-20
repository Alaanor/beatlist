<template>
  <v-card v-if="data !== undefined" width="305px" height="185px">
    <v-layout justify-space-between row>
      <v-flex xs5>
        <v-img :src="data.imgData" height="125px" contain class="mx-2"></v-img>
      </v-flex>
      <v-flex xs7>
        <v-card-title primary-title>
          <v-container grid-list ma-0 pa-0 height="100px">
            <div class="subheading">{{data.songName}}</div>
            <div class="caption">{{data.songSubName}}</div>
            <div class="caption text-truncate">{{data.songAuthorName}}</div>
            <div class="caption">{{data.levelAuthorName}}</div>
          </v-container>
        </v-card-title>
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
    props: {songPath: {type: String, required: true}},
    data: () => ({
      data: undefined,
    }),
    async mounted() {
      if (this.songPath === undefined) {
        return;
      }

      const song = new SongData(this.songPath);
      await song.LoadInfo();
      this.data = song;
    },
    filters: {
      forceInt(value) {
        return Number.parseInt(value, 10).toString();
      },
    },
  });
</script>

<style scoped>

</style>
