<template>
  <v-dialog
    v-model="open"
    width="500"
    @click:outside="$emit('update:open', false)"
  >
    <v-card>
      <v-card-title>
        Add to ...
      </v-card-title>

      <v-card-text>
        <PlaylistsListViewer :playlists="playlists">
          <template #actions="{ playlist }">
            <PlaylistButtonAddRemoveTogglePlaylist
              :playlist="playlist"
              :beatmap="beatmap"
            />
          </template>
        </PlaylistsListViewer>
      </v-card-text>

      <v-card-actions>
        <v-spacer/>
        <v-btn
          text
          @click="closeDialog"
        >
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import PlaylistsListViewer from '@/components/playlist/list/PlaylistsListViewer.vue';
import PlaylistLibrary from '@/libraries/playlist/PlaylistLibrary';
import PlaylistButtonAddRemoveTogglePlaylist
  from '@/components/playlist/button/PlaylistButtonAddRemoveTogglePlaylist.vue';
import { BeatsaverBeatmap } from '@/libraries/net/beatsaver/BeatsaverBeatmap';

export default Vue.extend({
  name: 'AddRemoveFromPlaylistsDialog',
  components: { PlaylistsListViewer, PlaylistButtonAddRemoveTogglePlaylist },
  props: {
    open: { type: Boolean, required: true },
    beatmap: { type: Object as PropType<BeatsaverBeatmap>, required: true },
  },
  computed: {
    playlists: () => PlaylistLibrary.GetAllValidPlaylists(),
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
