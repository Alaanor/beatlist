<template>
  <ListViewer :items="playlists" :filter="Filter">
    <template #item-block="{item}">
      <v-hover>
        <v-card slot-scope="{hover}" :class="`elevation-${hover ? 12 : 2}`" width="305px"
                style="cursor: pointer" @click.stop="action && action(item)">
          <v-layout justify-space-between row align-center>
            <v-flex xs4>
              <PlaylistCover :playlist="item" class="mx-2"></PlaylistCover>
            </v-flex>
            <v-flex xs5>
              <div>
                <v-container pa-0>
                  <div class="body-1">
                    {{item.playlistTitle}}<span class="grey--text"> ({{item.songs.length}})</span>
                  </div>
                  <div class="caption">{{item.playlistAuthor}}</div>
                </v-container>
              </div>
            </v-flex>
            <v-flex xs2 class="pa-0">
              <slot name="item-block-action" :item="item"></slot>
            </v-flex>
          </v-layout>
        </v-card>
      </v-hover>
    </template>

    <template #item-list="{item}">
      <v-list-item @click.stop="action && action(item)">
        <v-list-item-avatar class="my-0">
          <PlaylistCover :playlist="item"></PlaylistCover>
        </v-list-item-avatar>
        <v-list-item-content class="pa-0">
          <v-list-item-title>{{item.playlistTitle}}</v-list-item-title>
          <v-list-item-subtitle>
            {{item.playlistAuthor}} - <span class="grey--text">{{item.songs.length}} songs</span>
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action class="my-0">
          <slot name="item-list-action" :item="item"></slot>
        </v-list-item-action>
      </v-list-item>
    </template>

  </ListViewer>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {get} from 'vuex-pathify';
  import store from '@/store/store';
  import ListViewer from './ListViewer.vue';
  import PlaylistCover from './PlaylistCover.vue';
  import PlaylistLocal from '@/lib/PlaylistLocal';

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
        const playlists = items as PlaylistLocal[];

        return playlists.filter((playlist: PlaylistLocal) => {
          return search.toLowerCase().split(' ').filter((v) => v !== '').map((word) => (
            (playlist.playlistTitle && playlist.playlistTitle.toLowerCase().indexOf(word) !== -1) ||
            (playlist.playlistDescription && playlist.playlistDescription.toLowerCase().indexOf(word) !== -1) ||
            (playlist.playlistAuthor && playlist.playlistAuthor.toLowerCase().indexOf(word) !== -1) ||
            (playlist.playlistPath && playlist.playlistPath.toLowerCase().indexOf(word) !== -1)
          )).every(Boolean);
        });
      },
    },
  });
</script>

<style scoped>

</style>
