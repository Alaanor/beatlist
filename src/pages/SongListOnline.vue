<template>
  <v-container>
    <h1>Online songs</h1>
    <ListViewerForSongs :items="items" :total="total">
    </ListViewerForSongs>
  </v-container>
</template>

<script>
  import Vue from 'vue';
  import ListViewerForSongs from '@/components/ListViewerForSongs.vue';
  import BeatSaverAPI from '../lib/BeatSaverAPI';

  export default Vue.extend({
    name: 'SongListOnline',
    components: {ListViewerForSongs},
    data: () => ({
      items: [],
      total: 0,
    }),
    methods: {
      updatePagination() {
        BeatSaverAPI.Singleton
          .search('test', 0)
          .then((result) => {
            this.items = result.docs;
            this.total = result.totalDocs;
          });
      },
    },
    mounted() {
      this.updatePagination();
    },
  });
</script>
