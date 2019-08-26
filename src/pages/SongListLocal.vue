<!--suppress ALL -->
<template>
  <v-container>
    <h1>Local songs</h1>
    <ListViewerForSongs :items="songs" :filter="Filter">
      <template #item-block-action="{item}">
        <div class="pa-2">
          <BtnAddSongToPlaylists :song="item" value="Add to playlist"></BtnAddSongToPlaylists>
        </div>
      </template>
      <template #item-list-action="{item}">
        <BtnAddSongToPlaylists :song="item" icon></BtnAddSongToPlaylists>
      </template>
    </ListViewerForSongs>
  </v-container>
</template>

<script lang="ts">
  import Vue from 'vue';
  import ListViewerForSongs from '@/components/ListViewerForSongs.vue';
  import BtnAddSongToPlaylists from '@/components/BtnToggleAddRemoveSongInPlaylists.vue';
  import ISongLocal from '@/lib/data/ISongLocal';
  import { get } from 'vuex-pathify';

  export default Vue.extend({
    name: 'SongListLocal',
    components: { ListViewerForSongs, BtnAddSongToPlaylists },
    computed: {
      songs: get('songs/songs'),
    },
    methods: {
      Filter(songs: ISongLocal[], search: string) {
        if (search === '') {
          return songs.filter((s: ISongLocal) => s.valid);
        }

        return songs.filter((song) => {
          return search.toLowerCase().split(' ').filter((v) => v !== '').map((word) => (
            (song.metadata.songName && song.metadata.songName.toLowerCase().indexOf(word) !== -1) ||
            (song.metadata.songSubName && song.metadata.songSubName.toLowerCase().indexOf(word) !== -1) ||
            (song.metadata.songAuthorName && song.metadata.songAuthorName.toLowerCase().indexOf(word) !== -1) ||
            (song.metadata.levelAuthorName && song.metadata.levelAuthorName.toLowerCase().indexOf(word) !== -1)
          )).every(Boolean);
        });
      },
    },
  });
</script>
