<!--suppress XmlUnboundNsPrefix -->
<template>
  <v-container>
    <v-container>
      <v-layout align-start justify-space-between>
        <v-flex>
          <h1>Song list</h1>
        </v-flex>
        <v-flex>
          <v-text-field v-model="search" label="search" solo append-icon="search"></v-text-field>
        </v-flex>
      </v-layout>
    </v-container>
    <v-container fluid grid-list-lg v-if="songs !== undefined">
      <v-data-iterator
              :items="songs.filter((s) => s.valid)"
              :rows-per-page-items="rowsPerPageItems"
              :pagination.sync="pagination"
              :custom-filter="Filter"
              content-tag="v-layout" row wrap
              @update:pagination="LoadImages"
              :search="search">
        <template v-slot:item="props">
          <v-flex>
            <Song :data="props.item"></Song>
          </v-flex>
        </template>
      </v-data-iterator>
    </v-container>
    <v-alert :value="true" type="error" v-if="songs === undefined">
      <v-container class="ma-0 pa-0">
        <v-layout align-center justify-space-between row fill-height>
          <span>Couldn't find any song, you probably haven't specified the right folder in <strong>Settings</strong>.</span>
          <v-btn icon to="settings" class="pa-0 ma-0">
            <v-icon>launch</v-icon>
          </v-btn>
        </v-layout>
      </v-container>
    </v-alert>
  </v-container>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {get} from 'vuex-pathify';
  import Song from '@/components/Song.vue';
  import SongData from '@/lib/SongData';

  interface SongList {
    list: string[];
    err: Error | undefined;
  }

  export default Vue.extend({
    name: 'SongList',
    components: {Song},
    data: () => ({
      search: '',
      rowsPerPageItems: [6, 12, 24, 48],
      pagination: {
        rowsPerPage: 6,
      },
    }),
    computed: {
      songs: get('songs/songs'),
    },
    methods: {
      LoadImages() {
        this.$emit('loadImage');
      },
      Filter(items: object[], search: string) {
        const songs = items as SongData[];

        if (search === '') {
          return songs.filter((s: SongData) => s.valid);
        }

        return songs.filter( (song: SongData) => {
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
