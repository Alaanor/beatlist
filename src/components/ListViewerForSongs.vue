<!--suppress ALL -->
<template>
  <ListViewer :items="songs" :filter="Filter">

    <template #item-block="{item}">
      <v-card width="305px" height="160px">
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
    </template>

    <template #item-list="{item}">
      <v-list-tile>
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
</template>

<script lang="ts">
  import Vue from 'vue';
  import {get} from 'vuex-pathify';
  import SongData from '@/lib/SongData';
  import SongCover from '@/components/SongCover.vue';
  import ListViewer from '@/components/ListViewer.vue';

  export default Vue.extend({
    name: 'ListViewerForSongs',
    components: {ListViewer,  SongCover},
    computed: {
      songs: get('songs/songs'),
    },
    methods: {
      Filter(items: object[], search: string) {
        const songs = items as SongData[];

        if (search === '') {
          return songs.filter((s: SongData) => s.valid);
        }

        return songs.filter((song: SongData) => {
          return search.toLowerCase().split(' ').filter((v) => v !== '').map((word) => (
            (song.songName && song.songName.toLowerCase().indexOf(word) !== -1) ||
            (song.songSubName && song.songSubName.toLowerCase().indexOf(word) !== -1) ||
            (song.songAuthorName && song.songAuthorName.toLowerCase().indexOf(word) !== -1) ||
            (song.levelAuthorName && song.levelAuthorName.toLowerCase().indexOf(word) !== -1)
          )).every(Boolean);
        });
      },
    },
  });
</script>

<style scoped>

</style>
