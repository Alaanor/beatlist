<template>
  <v-card v-if="data !== undefined" width="305px" height="160px">
    <v-layout justify-space-between row>
      <v-flex xs5>
        <SongCover :song="data" contain class="mx-2" height="100px"></SongCover>
      </v-flex>
      <v-flex xs7 pa-3>
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
      <AddToPlaylistBtn :song="data"></AddToPlaylistBtn>
      <v-spacer></v-spacer>
      <span><v-icon small>fa-heartbeat</v-icon> {{data.beatsPerMinute | forceInt}}</span>
    </v-card-actions>
  </v-card>
</template>

<script>
  import Vue from 'vue';
  import SongCover from './SongCover';
  import AddToPlaylistBtn from './AddToPlaylistBtn';

  export default Vue.extend({
    name: 'Song',
    props: {data: {type: Object, required: true}},
    components: { SongCover, AddToPlaylistBtn },
    filters: {
      forceInt(value) {
        return Number.parseInt(value, 10).toString();
      },
    },
  });
</script>

<style scoped>

</style>
