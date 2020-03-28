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
          <template #actions>
            hi
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
import Vue from 'vue';
import PlaylistsListViewer from '@/components/playlist/list/PlaylistsListViewer.vue';
import PlaylistLibrary from '@/libraries/playlist/PlaylistLibrary';

export default Vue.extend({
  name: 'AddRemoveFromPlaylists',
  components: { PlaylistsListViewer },
  props: {
    open: { type: Boolean, required: true },
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
