<template>
  <div>
    <v-list class="py-0">
      <template v-for="(song, i) in songs">
        <v-divider v-if="i !== 0"></v-divider>
        <v-list-item @click.stop="showInfo(song)">
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

    <v-dialog v-model="dialog" width="700">
      <OnlineSongInfo :song="getSongOnlineItem(song)">
        <template #action>
          <v-btn text @click="dialog = false">Close</v-btn>
        </template>
      </OnlineSongInfo>
    </v-dialog>
  </div>
</template>

<script>
  import Vue from 'vue';
  import SongCover from './SongCover';
  import OnlineSongInfo from '@/components/OnlineSongInfo';

  export default Vue.extend({
    name: 'ListViewerForSongSimple',
    components: {SongCover, OnlineSongInfo},
    props: {
      songs: {type: Array, required: true},
    },
    data: () => ({
      song: undefined,
      dialog: false,
    }),
    methods: {
      showInfo(song) {
        this.dialog = true;
        this.song = song;
      },
      getSongOnlineItem(song) {
        return !!song && !!song.onlineData ? song.onlineData : song;
      },
    },
  });
</script>

<style scoped>

</style>
