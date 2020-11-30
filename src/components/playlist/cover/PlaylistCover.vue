<template>
  <v-img v-if="cover" :src="cover" :max-height="maxHeight" :contain="contain">
    <slot />
  </v-img>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { PlaylistLocal } from "@/libraries/playlist/PlaylistLocal";
import PlaylistLoader from "@/libraries/playlist/loader/PlaylistLoader";
import Base64SrcLoader from "@/libraries/os/utils/Base64SrcLoader";

export default Vue.extend({
  name: "PlaylistCover",
  props: {
    playlist: { type: Object as PropType<PlaylistLocal>, required: true },
    maxHeight: { type: Number, default: undefined },
    contain: { type: Boolean, default: undefined },
  },
  data: () => ({
    cover: "",
  }),
  watch: {
    playlist() {
      this.updateCoverSrc();
    },
  },
  mounted() {
    this.updateCoverSrc();
  },
  methods: {
    async updateCoverSrc() {
      let { cover } = this.playlist;

      if (!cover && this.playlist.path) {
        cover = await PlaylistLoader.LoadCover(this.playlist.path);
      }

      if (cover) {
        this.cover = Base64SrcLoader.FromBuffer(cover, "png");
      } else {
        this.cover = "";
      }
    },
  },
});
</script>
