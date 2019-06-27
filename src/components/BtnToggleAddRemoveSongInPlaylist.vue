<template>
  <v-btn :icon="icon && !label" @click="onButtonClicked()" flat :small="small" :color="!isInPlaylist?'success':'error'">
    <v-icon v-if="icon">{{!isInPlaylist?'add':'delete'}}</v-icon>
    <span v-if="!!label">{{!isInPlaylist?'Add':'Delete'}}</span>
  </v-btn>
</template>

<script>
  import Vue from 'vue';
  import store from '@/store/store';

  export default Vue.extend({
    name: 'BtnToggleAddRemoveSongInPlaylist',
    props: {
      song: {type: Object, required: true},
      playlist: {type: Object, required: true},
      label: {type: Boolean, default: undefined},
      icon: {type: Boolean, default: false},
      small: {type: Boolean, default: false},
    },
    computed: {
      isInPlaylist() {
        return !!this.playlist.songs.find((s) => s.songHash === this.song.songHash);
      },
    },
    methods: {
      onButtonClicked() {
        if (!this.isInPlaylist) {
          this.Add();
        } else {
          this.Remove();
        }
      },
      Add() {
        store.commit('songs/addSongToPlaylist', {playlist: this.playlist, song: this.song});
      },
      Remove() {
        store.commit('songs/removeSongFromPlaylist', {playlist: this.playlist, song: this.song});
      },
    }
  });
</script>

<style scoped>

</style>
