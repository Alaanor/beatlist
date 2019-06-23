<!--suppress XmlUnboundNsPrefix -->
<template>
  <v-container>
    <h1>Playlists</h1>
    <v-container fluid grid-list-lg v-if="playlists !== null">
      <v-data-iterator
              :items="playlists"
              :rows-per-page-items="rowsPerPageItems"
              :pagination.sync="pagination"
              content-tag="v-layout" row wrap>
        <template v-slot:item="props">
          <v-flex>
            <Playlist :data="props.item"></Playlist>
          </v-flex>
        </template>
      </v-data-iterator>
    </v-container>
  </v-container>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {get} from 'vuex-pathify';
  import store from '@/store/store';
  import Playlist from '@/components/Playlist';

  export default Vue.extend({
    name: 'Playlists',
    components: {Playlist},
    data: () => ({
      rowsPerPageItems: [6, 12, 24, 48],
      pagination: {
        rowsPerPage: 6,
      },
    }),
    computed: {
      playlists: get('songs/playlists'),
    },
    async mounted() {
      await store.dispatch('songs/loadPlaylists');
    },
  });
</script>
