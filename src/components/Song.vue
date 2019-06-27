<template>
  <div v-if="!!data">
    <v-flex v-if="displayMode === 'block'" my-3>
      <v-card width="305px" height="160px">
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
    </v-flex>
    <v-card v-if="displayMode === 'list'">
      <v-list-tile>
        <v-list-tile-avatar>
          <SongCover :song="data"></SongCover>
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title>{{data.songName}}</v-list-tile-title>
          <v-list-tile-sub-title><span class="text--primary">{{data.songAuthorName}}</span> -
            {{data.levelAuthorName}}
          </v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-card>
  </div>
</template>

<script>
  import Vue from 'vue';
  import SongCover from './SongCover';
  import AddToPlaylistBtn from './AddToPlaylistBtn';

  export default Vue.extend({
    name: 'Song',
    props: {
      data: {type: Object, required: true},
      displayMode: {type: String, default: 'block'}
    },
    components: {SongCover, AddToPlaylistBtn},
  });
</script>

<style scoped>

</style>
