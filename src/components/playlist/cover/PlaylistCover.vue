<template>
  <v-img
    v-if="playlist.cover"
    :src="coverSrc"
  />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { PlaylistLocal } from '@/libraries/playlist/PlaylistLocal';

export default Vue.extend({
  name: 'PlaylistCover',
  props: {
    playlist: { type: Object as PropType<PlaylistLocal>, required: true },
  },
  computed: {
    coverSrc(): string {
      if (this.playlist.cover) {
        const base64 = Buffer.from(this.playlist.cover).toString('base64');
        return `data:image/jpg;base64,${base64}`;
      }

      return '';
    },
  },
});
</script>

<style scoped>

</style>
