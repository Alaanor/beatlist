<!--suppress ALL -->
<template>
  <div>
    <ListViewer :items="validSongs" :filter="Filter">

      <template #item-block="{item}">
        <v-hover>
          <v-card width="305px" height="160px"
                  slot-scope="{ hover }" @click.stop="showInfo(item)"
                  :class="`elevation-${hover ? 12 : 2}`" style="cursor: pointer">
            <v-layout justify-space-between row>
              <v-flex xs5>
                <SongCover :song="item" class="mx-2" height="100px"></SongCover>
              </v-flex>
              <v-flex xs7 pa-3>
                <v-container pa-0>
                  <div class="subheading text-truncate ma-1">{{item.songName}}</div>
                  <div class="caption text-truncate ma-1">{{item.songAuthorName}}</div>
                  <div class="caption text-truncate ma-1">{{item.levelAuthorName}}</div>
                </v-container>
              </v-flex>
            </v-layout>
            <v-divider light></v-divider>
            <v-card-actions class="pa-2">
              <slot name="item-block-action" :item="item"></slot>
            </v-card-actions>
          </v-card>
        </v-hover>
      </template>

      <template #item-list="{item}">
        <v-list-tile @click.stop="showInfo(item)">
          <v-list-tile-avatar>
            <SongCover :song="item"></SongCover>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{item.songName}}</v-list-tile-title>
            <v-list-tile-sub-title>
              <span class="text--primary">{{item.songAuthorName}}</span> -
              {{item.levelAuthorName}}
            </v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <slot name="item-list-action" :item="item"></slot>
          </v-list-tile-action>
        </v-list-tile>
      </template>

    </ListViewer>

    <v-dialog v-model="dialog" width="400">
      <v-card v-if="song">
        <v-card-title>
          <div class="title">Song info</div>
        </v-card-title>
        <v-card-text>
          <table>
            <tr>
              <td class="body-2 pr-2">Name</td>
              <td class="body-1 pl-2">{{song.songName}}</td>
            </tr>
            <tr>
              <td class="body-2 pr-2">Author</td>
              <td class="body-1 pl-2">{{song.songAuthorName}}</td>
            </tr>
            <tr>
              <td class="body-2 pr-2">Mapper</td>
              <td class="body-1 pl-2">{{song.levelAuthorName}}</td>
            </tr>
            <tr>
              <td class="body-2 pr-2">BPM</td>
              <td class="body-1 pl-2">{{song.beatsPerMinute}}</td>
            </tr>
            <tr>
              <td class="body-2 pr-2">Difficulties</td>
              <td>
                <DifficultiesBadge :song="song"></DifficultiesBadge>
              </td>
            </tr>
          </table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import Vue from 'vue';
  import {get} from 'vuex-pathify';
  import SongData from '@/lib/SongData';
  import SongCover from '@/components/SongCover.vue';
  import ListViewer from '@/components/ListViewer.vue';
  import DifficultiesBadge from '@/components/DifficultiesBadge.vue';

  export default Vue.extend({
    name: 'ListViewerForSongs',
    components: {ListViewer, SongCover, DifficultiesBadge},
    data: () => ({
      dialog: false,
      song: undefined,
    }),
    computed: {
      songs: get('songs/songs'),
      validSongs() {
        return this.songs.filter((s) => s.valid);
      },
    },
    methods: {
      Filter(songs, search) {
        if (search === '') {
          return songs.filter((s) => s.valid);
        }

        return songs.filter((song) => {
          return search.toLowerCase().split(' ').filter((v) => v !== '').map((word) => (
            (song.songName && song.songName.toLowerCase().indexOf(word) !== -1) ||
            (song.songSubName && song.songSubName.toLowerCase().indexOf(word) !== -1) ||
            (song.songAuthorName && song.songAuthorName.toLowerCase().indexOf(word) !== -1) ||
            (song.levelAuthorName && song.levelAuthorName.toLowerCase().indexOf(word) !== -1)
          )).every(Boolean);
        });
      },
      showInfo(song) {
        this.dialog = true;
        this.song = song;
      },
    },
  });
</script>

<style scoped>

</style>
