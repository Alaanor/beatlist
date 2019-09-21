<template>
  <v-list class="py-0">
    <template v-for="(song, i) in songs">
      <v-divider v-if="i !== 0"></v-divider>
      <v-list-item @click="onClick(song)">
        <v-list-item-avatar>
          <SongCover :song="song"></SongCover>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>{{song.metadata.songName}}</v-list-item-title>
          <v-list-item-subtitle>
            <span class="text--primary">{{song.metadata.songAuthorName}}</span> -
            {{song.metadata.levelAuthorName}}
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action class="d-flex flex-row">
          <slot name="actions" :item="song"></slot>
        </v-list-item-action>
      </v-list-item>
    </template>
  </v-list>
</template>
<script>
  import Vue from 'vue';
  import SongCover from './SongCover';

  export default Vue.extend({
    name: 'ListViewerForSongSimple',
    components: {SongCover},
    props: {
      songs: {type: Array, required: true},
    },
    methods: {
      onClick(item) {
        this.$emit('click', item);
      }
    }
  });
</script>

<style scoped>

</style>
