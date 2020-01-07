<template>
  <v-container>
    <p class="display-2">
      Beatmap Local
    </p>
    <v-data-table
      :headers="headers"
      :items="beatmaps"
      fixed-header
      dense
    >
      <template #item.cover="{ item }">
        <BeatmapCover
          :beatmap="item.beatmap"
          :avatar-size="24"
          :icon-expand-size="16"
        />
      </template>

      <template #item.difficulties="{ item }">
        <DifficultiesChips
          :diff="item.difficulties"
          small
          short
        />
      </template>

      <template #item.name="{ item }">
        <Tooltip :text="item.name">
          <span>
            {{ item.name }}
          </span>
        </Tooltip>
      </template>

      <template #item.artist ="{ item }">
        <Tooltip :text="item.artist">
          <span>
            {{ item.artist }}
          </span>
        </Tooltip>
      </template>

      <template #item.mapper="{ item }">
        <Tooltip :text="item.mapper">
          <span>
            {{ item.mapper }}
          </span>
        </Tooltip>
      </template>
    </v-data-table>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import BeatmapLibrary from '@/libraries/beatmap/BeatmapLibrary';
import BeatmapCover from '@/components/beatmap/BeatmapCover.vue';
import DifficultiesChips from '@/components/beatmap/DifficultiesChips.vue';
import Tooltip from '@/components/helper/Tooltip.vue';

export default Vue.extend({
  name: 'BeatmapLocal',
  components: { BeatmapCover, DifficultiesChips, Tooltip },
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
      {
        text: 'difficulties',
        value: 'difficulties',
        align: 'left',
        sortable: true,
      },
    ],
  }),
  computed: {
    beatmaps: () => BeatmapLibrary.GetAllValidMap().map((item) => ({
      cover: undefined,
      name: item.onlineData.metadata.songName,
      artist: item.onlineData.metadata.songAuthorName,
      mapper: item.onlineData.metadata.levelAuthorName,
      difficulties: item.onlineData.metadata.difficulties,
      beatmap: item,
    })),
  },
});
</script>

<style scoped>

</style>
