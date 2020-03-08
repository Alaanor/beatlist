<template>
  <v-dialog
    v-model="open"
    max-width="80%"
    @click:outside="closeDialog"
  >
    <v-card>
      <v-card-title>
        Invalid beatmaps in playlists
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="invalidPlaylistsMaps"
          item-key="key"
          group-by="filename"
          show-expand
          show-group-by
          single-expand
          dense
        >
          <template #item.error="{item}">
            <span class="error--text">
              {{ item.error | errorTranslated }}
            </span>
          </template>

          <template #expanded-item="{ item, headers }">
            <td :colspan="headers.length">
              {{ item.path }}
            </td>
          </template>
        </v-data-table>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn
          text
          @click="closeDialog"
        >
          Ok
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import path from 'path';
import PlaylistMapsLibrary from '@/libraries/playlist/PlaylistMapsLibrary';
import { PlaylistMapImportError } from '@/libraries/playlist/PlaylistLocal';

export default Vue.extend({
  name: 'InvalidPlaylistsMapsDialog',
  filters: {
    errorTranslated: (error: PlaylistMapImportError): string => {
      switch (error) {
        case PlaylistMapImportError.BeatmapTypeZipNotSupported:
          return 'Beatmap type zip is currently not supported';
        case PlaylistMapImportError.BeatmapTypeLevelIdNotSupported:
          return 'Beatmap type level id is currently not supported';
        case PlaylistMapImportError.BeatmapTypeUnknown:
          return 'Unknown type of beatmap found';
        case PlaylistMapImportError.BeatsaverInexistent:
          return 'The beatmap was not found on beatsaver.';
        case PlaylistMapImportError.BeatsaverRequestError:
          return 'Request error while retreiving data on beatsaver';
        default:
          return 'Unknown error';
      }
    },
  },
  props: {
    open: { type: Boolean, required: true },
  },
  data: () => ({
    headers: [
      { text: 'Filename', value: 'filename' },
      { text: 'Error', value: 'error' },
      { text: 'Details', value: 'errorInfo' },
      { text: '', value: 'data-table-expand' },
    ],
  }),
  computed: {
    invalidPlaylistsMaps: () => PlaylistMapsLibrary.GetAllInvalidMapFlatten()
      .map((entry) => ({
        key: entry.playlist.path + entry.map.errorInfo,
        path: entry.playlist.path,
        filename: path.basename(entry.playlist.path ?? ''),
        error: entry.map.error,
        errorInfo: entry.map.errorInfo,
      })),
  },
  methods: {
    closeDialog() {
      this.$emit('update:open', false);
    },
  },
});
</script>

<style scoped>

</style>
