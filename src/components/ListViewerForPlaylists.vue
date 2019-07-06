<!--suppress ALL -->
<template>
  <ListViewer :items="playlists" :filter="Filter">
    <template #item-block="{item}">
      <v-hover>
        <v-card slot-scope="{hover}" :class="`elevation-${hover ? 12 : 2}`" width="305px"
                style="cursor: pointer" @click.stop="action && action(item)">
          <v-layout justify-space-between row align-center>
            <v-flex xs5>
              <PlaylistCover :playlist="item" class="mx-2"></PlaylistCover>
            </v-flex>
            <v-flex xs7 pa-1>
              <div>
                <v-container pa-0>
                  <div class="subheading">
                    {{item.playlistTitle}}<span class="grey--text"> ({{item.songs.length}})</span>
                  </div>
                  <div class="caption">{{item.playlistAuthor}}</div>
                </v-container>
              </div>
            </v-flex>
            <v-flex>
              <slot name="item-block-action" :item="item"></slot>
            </v-flex>
          </v-layout>
        </v-card>
      </v-hover>
    </template>

    <template #item-list="{item}">
      <v-list-tile @click.stop="action && action(item)">
        <v-list-tile-avatar>
          <PlaylistCover :playlist="item"></PlaylistCover>
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title>{{item.playlistTitle}}</v-list-tile-title>
          <v-list-tile-sub-title>
            <span class="text--primary">{{item.playlistAuthor}}</span> -
            {{item.songs.length}} songs
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
  import store from '@/store/store';
  import ListViewer from './ListViewer.vue';
  import PlaylistCover from './PlaylistCover.vue';
  import Playlist from '@/lib/Playlist';

  export default Vue.extend({
    name: 'ListViewerForPlaylists',
    components: {ListViewer, PlaylistCover},
    props: {
      action: {type: Function},
    },
    computed: {
      playlists: get('songs/playlists'),
    },
    methods: {
      Filter(items: object[], search: string) {
        const playlists = items as Playlist[];

        return playlists.filter((playlist: Playlist) => {
          return search.toLowerCase().split(' ').filter((v) => v !== '').map((word) => (
            (playlist.playlistTitle && playlist.playlistTitle.toLowerCase().indexOf(word) !== -1) ||
            (playlist.playlistDescription && playlist.playlistDescription.toLowerCase().indexOf(word) !== -1) ||
            (playlist.playlistAuthor && playlist.playlistAuthor.toLowerCase().indexOf(word) !== -1) ||
            (playlist.playlistPath && playlist.playlistPath.toLowerCase().indexOf(word) !== -1)
          )).every(Boolean);
        });
      },
    },
    async mounted() {
      await store.dispatch('songs/loadPlaylists');
    },
  });
</script>

<style scoped>

</style>
