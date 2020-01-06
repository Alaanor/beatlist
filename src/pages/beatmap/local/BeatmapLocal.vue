<template>
  <v-container>
    <p class="display-2">
      Beatmap Local
    </p>
    <v-data-table
      :headers="headers"
      :items="beatmaps"
      dense
    >
      <template #item.cover="{ item }">
        <BeatmapCover
          :beatmap="item.cover"
          :avatar-size="24"
          :icon-expand-size="16"
        />
      </template>
    </v-data-table>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import BeatmapLibrary from '@/libraries/beatmap/BeatmapLibrary';
import BeatmapCover from '@/components/beatmap/BeatmapCover.vue';

export default Vue.extend({
  name: 'BeatmapLocal',
  components: { BeatmapCover },
  data: () => ({
    headers: [
      {
        text: 'cover',
        value: 'cover',
        align: 'left',
        sortable: false,
        width: 48,
      },
      {
        text: 'song name',
        value: 'name',
        align: 'left',
        sortable: true,
      },
      {
        text: 'artist',
        value: 'artist',
        align: 'left',
        sortable: true,
      },
      {
        text: 'mapper',
        value: 'mapper',
        align: 'left',
        sortable: true,
      },
    ],
  }),
  computed: {
    beatmaps: () => BeatmapLibrary.GetAllValidMap().map((item) => ({
      cover: item,
      name: item.onlineData.metadata.songName,
      artist: item.onlineData.metadata.songAuthorName,
      mapper: item.onlineData.metadata.levelAuthorName,
    })),
  },
});
</script>

<style scoped>

</style>
