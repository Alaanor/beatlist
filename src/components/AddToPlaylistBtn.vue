<!--suppress XmlUnboundNsPrefix -->
<template>
  <v-dialog v-model="dialog" scrollable max-width="450px">
    <template v-slot:activator="{ on }">
      <slot>
        <v-btn v-if="icon" v-on="on" icon>
          <v-icon>{{label || "add"}}</v-icon>
        </v-btn>
        <v-btn v-else flat small pa-0 v-on="on">
          {{label || "Add"}}
        </v-btn>
      </slot>
    </template>
    <v-card v-if="checkboxList">
      <v-card-title class="subheading">Select playlist</v-card-title>
      <v-divider></v-divider>
      <v-card-text style="max-height: 350px;">
        <v-card elevation="10">
          <v-list class="py-0">
            <template v-for="(checkbox, i) in checkboxList">
              <v-divider v-if="i !== 0"></v-divider>
              <v-list-tile>
                <v-list-tile-action>
                  <v-checkbox
                          v-model="selected"
                          :disabled="checkbox.disabled"
                          :label="checkbox.playlist.playlistTitle"
                          :value="checkbox.playlist.playlistHash"
                          class="text-truncate">
                  </v-checkbox>
                </v-list-tile-action>
                <v-spacer></v-spacer>
                <v-list-tile-avatar class="pl-3">
                  <PlaylistCover :playlist="checkbox.playlist"></PlaylistCover>
                </v-list-tile-avatar>
              </v-list-tile>
            </template>
          </v-list>
        </v-card>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" flat @click="dialog = false">Close</v-btn>
        <v-btn color="success" flat @click="SaveModification()">Add</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import Vue from 'vue';
  import {get} from 'vuex-pathify';
  import store from '@/store/store';
  import PlaylistCover from '@/components/PlaylistCover.vue';

  export default Vue.extend({
    name: 'AddToPlaylistBtn',
    props: {
      song: {type: Object, required: true},
      icon: {type: Boolean, default: false },
      label: {type: String, default: undefined}
    },
    components: {PlaylistCover},
    data: () => ({
      dialog: false,
      checkboxList: [],
      selected: [],
      selectedDefault: [],
    }),
    computed: {
      playlists: get('songs/playlists'),
    },
    async mounted() {
      await store.dispatch('songs/loadPlaylists');
    },
    watch: {
      dialog() {
        if (this.dialog) {
          this.LoadCheckbox();
        }
      },
    },
    methods: {
      LoadCheckbox() {
        this.checkboxList = this.playlists.map((playlist) => {
          const isAlreadyIn = !!playlist.songs.find((s) => {
            return s.songHash === this.song.songHash;
          });

          if (isAlreadyIn) {
            this.selected.push(playlist.playlistHash);
          }

          return {
            playlist,
            disabled: isAlreadyIn,
          };
        });

        this.selectedDefault = this.selected;
      },
      SaveModification() {
        const hashList = this.selected.filter((h) => !this.selectedDefault.includes(h));
        this.playlists
          .filter((p) => hashList.includes(p.playlistHash))
          .forEach((p) => {
            store.commit('songs/addSongToPlaylist', {playlist: p, song: this.song});
          });
        this.dialog = false;
      },
    },
  });
</script>

<style scoped>

</style>
