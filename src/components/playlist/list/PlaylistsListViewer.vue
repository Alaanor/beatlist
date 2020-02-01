<template>
  <v-list
    dense
    rounded
  >
    <v-list-item
      v-for="playlist in playlists"
      :key="playlist.hash"
      @click="openPlaylist(playlist)"
    >
      <v-list-item-avatar>
        <PlaylistCover :playlist="playlist"/>
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title>
          <span>{{ playlist.title }}</span>
          <span class="grey--text ml-1">{{ playlist.author ? ` - ${playlist.author}` : '' }}</span>
        </v-list-item-title>
        <v-list-item-subtitle class="text-no-wrap">
          {{ playlist.description }}
        </v-list-item-subtitle>
      </v-list-item-content>

      <v-list-item-action>
        <slot name="actions"/>
      </v-list-item-action>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { PlaylistLocal } from '@/libraries/playlist/PlaylistLocal';
import PlaylistCover from '@/components/playlist/cover/PlaylistCover.vue';

export default Vue.extend({
  name: 'PlaylistsListViewer',
  components: { PlaylistCover },
  props: {
    playlists: { type: Array as PropType<PlaylistLocal[]>, required: true },
    action: { type: Function as PropType<(playlist: PlaylistLocal) => void>, default: undefined },
  },
  methods: {
    openPlaylist(playlist: PlaylistLocal): void {
      if (this.action) {
        this.action(playlist);
      }
    },
  },
});
</script>

<style scoped>

</style>
