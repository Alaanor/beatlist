<template>
  <v-container v-if="playlist">
    <p class="display-2">
      Playlist
    </p>
    <div class="d-flex align-center">
      <PlaylistCoverAvatar
        :playlist="playlist"
        :avatar-size="48"
        class="mr-5"
      />
      <span class="display-1">
        {{ playlist.title }}
        <span class="grey--text">- {{ playlist.author }}</span>
      </span>
    </div>
  </v-container>
  <v-container v-else>
    <v-alert
      text
      type="warning"
    >
      An error occurred. Couldn't find the playlist in the cache.
    </v-alert>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { PlaylistLocal } from '@/libraries/playlist/PlaylistLocal';
import PlaylistLibrary from '@/libraries/playlist/PlaylistLibrary';
import PlaylistCoverAvatar from '@/components/playlist/cover/PlaylistCoverAvatar.vue';

export default Vue.extend({
  name: 'PlaylistLocalUnit',
  components: { PlaylistCoverAvatar },
  data: () => ({
    playlist: undefined as PlaylistLocal | undefined,
  }),
  mounted(): void {
    this.playlist = PlaylistLibrary.GetByHash(this.$route.params.hash);
  },
});
</script>

<style scoped>

</style>
