<!--suppress ALL -->
<template>
  <v-container>
    <p class="display-2">Local songs</p>
    <ListViewerForSongs :items="songs" :filter="Filter" allow-filter>
      <template #item-block-action="{item}">
        <div class="pa-2">
          <BtnAddSongToPlaylists :song="item" value="Add to playlist"></BtnAddSongToPlaylists>
        </div>
      </template>
      <template #item-list-action="{item}">
        <BtnAddSongToPlaylists :song="item" icon></BtnAddSongToPlaylists>
      </template>

      <template #filter>
        <span class="subheading">Difficulties <span class="caption">(at least one of)</span></span>
        <ComboBoxDifficulties v-model="filterDiff"></ComboBoxDifficulties>
        <br>
        <span class="subheading">BPM</span><br>
        <v-range-slider :min="bpmRange.min" :max="bpmRange.max" thumb-label="always"
                        v-model="bpmRange.value" class="mt-10 align-center" step="10">
        </v-range-slider>
      </template>
    </ListViewerForSongs>
  </v-container>
</template>

<script lang="ts">
  import Vue from 'vue';
  import ListViewerForSongs from '@/components/ListViewerForSongs.vue';
  import BtnAddSongToPlaylists from '@/components/BtnToggleAddRemoveSongInPlaylists.vue';
  import ComboBoxDifficulties from '@/components/ComboBoxDifficulties.vue';
  import ISongLocal from '@/lib/data/ISongLocal';
  import IDifficulties from '@/lib/data/IDifficulties';
  import {get} from 'vuex-pathify';
  import SongLocal from '@/lib/data/SongLocal';

  export default Vue.extend({
    name: 'SongListLocal',
    components: {ListViewerForSongs, BtnAddSongToPlaylists, ComboBoxDifficulties},
    computed: {
      songs: get('songs/songs'),
    },
    data: () => ({
      filterDiff: {
        easy: true,
        normal: true,
        hard: true,
        expert: true,
        expertPlus: true,
      } as IDifficulties,
      bpmRange: {
        value: [10, 500],
        min: 10,
        max: 500,
      }
    }),
    methods: {
      Filter(songs: ISongLocal[], search: string) {
        let filtered = songs.filter((song) => {
          return Object
            .keys(song.metadata.difficulties)
            .some((diffName) => this.filterDiff[diffName] === true);
        });

        filtered = filtered.filter((song) => {
          return song.metadata.bpm >= this.bpmRange.value[0] &&
            song.metadata.bpm <= this.bpmRange.value[1];
        });

        console.log(filtered)

        if (search === '') {
          return filtered;
        }

        return filtered.filter((song) => {
          return search.toLowerCase().split(' ').filter((v) => v !== '').map((word) => (
            (song.metadata.songName && song.metadata.songName.toLowerCase().indexOf(word) !== -1) ||
            (song.metadata.songSubName && song.metadata.songSubName.toLowerCase().indexOf(word) !== -1) ||
            (song.metadata.songAuthorName && song.metadata.songAuthorName.toLowerCase().indexOf(word) !== -1) ||
            (song.metadata.levelAuthorName && song.metadata.levelAuthorName.toLowerCase().indexOf(word) !== -1) ||
            (song.key && song.key.toLowerCase().indexOf(word) !== -1)
          )).every(Boolean);
        });
      },
    },
  });
</script>
