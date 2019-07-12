<!--suppress ALL -->
<template>
  <div>
    <ListViewer :items="getSongs" :filter="Filter" :total="total">

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
                  <div class="subheading text-truncate ma-1">{{item.metadata.songName}}</div>
                  <div class="caption text-truncate ma-1">{{item.metadata.songAuthorName}}</div>
                  <div class="caption text-truncate ma-1">{{item.metadata.levelAuthorName}}</div>
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
            <v-list-tile-title>{{item.metadata.songName}}</v-list-tile-title>
            <v-list-tile-sub-title>
              <span class="text--primary">{{item.metadata.songAuthorName}}</span> -
              {{item.metadata.levelAuthorName}}
            </v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <slot name="item-list-action" :item="item"></slot>
          </v-list-tile-action>
        </v-list-tile>
      </template>

    </ListViewer>

    <v-dialog v-model="dialog" width="600">
      <v-card>
        <v-card-title>
          <div class="title">Song info</div>
        </v-card-title>
        <v-card-text>
          <BeatSaverSongInfo v-if="!!song" :hash="song.songHash || song.hash"></BeatSaverSongInfo>
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
  import BeatSaverSongInfo from '@/components/BeatSaverSongInfo.vue';

  export default Vue.extend({
    name: 'ListViewerForSongs',
    components: {ListViewer, SongCover, BeatSaverSongInfo},
    props: {
      items: {Type: Array, default: undefined},
      total: {type: Number, default: 0},
    },
    data: () => ({
      dialog: false,
      song: undefined,
    }),
    computed: {
      songs: get('songs/songs'),
      validSongs() {
        return this.songs.filter((s) => s.valid);
      },
      getSongs() {
        if (this.items === undefined) {
          return this.validSongs;
        } else {
          return this.items;
        }
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
