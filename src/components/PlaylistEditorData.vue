<template>
  <v-container pa-0 ma-0 v-if="!!playlist">
    <v-card flat>
      <v-form ref="form" v-model="valid">
        <v-card-text>
          <v-container>
            <v-layout row align-center>
              <v-hover>
                <v-sheet slot-scope="{hover}" elevation="5" height="250" width="250" class="mr-5">
                  <v-img ref="cover" v-if="imageData.length > 0" :src="imageData" aspect-ratio="1">
                    <v-expand-transition>
                      <div v-if="hover" class="d-flex transition-fast-in-fast-out black v-card--reveal">
                        <v-container>
                          <v-layout align-center justify-center>
                            <v-btn icon large @click="openFileExplorer()">
                              <v-icon large>photo</v-icon>
                            </v-btn>
                          </v-layout>
                        </v-container>
                      </div>
                    </v-expand-transition>
                  </v-img>
                </v-sheet>
              </v-hover>
              <v-flex>
                <v-text-field ref="title" label="Title" v-model="playlistTitle" clearable></v-text-field>
                <v-text-field ref="author" label="Author" v-model="playlistAuthor" clearable></v-text-field>
                <v-textarea ref="description" label="Description" v-model="playlistDescription"></v-textarea>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-container>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" @click="dialogConfirmDelete = true">Delete</v-btn>
            <v-btn color="grey" :disabled="!IsThereChange()" @click="Cancel">Cancel</v-btn>
            <v-btn color="success" :disabled="!IsThereChange()" @click="Save">Save</v-btn>
          </v-card-actions>
        </v-container>
      </v-form>
    </v-card>
    <v-snackbar v-model="snackbar" :color="snackbarType" :timeout="3000">
      {{ snackbarText }}
      <v-btn text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
    <v-dialog v-model="dialogConfirmDelete" width="350">
      <v-card>
        <v-card-title>Confirm action</v-card-title>
        <v-card-text>
          Are you sure you want to <strong class="error--text">delete</strong> this playlist ?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="grey" @click="dialogConfirmDelete = false">Cancel</v-btn>
          <v-btn text color="error" @click="Delete()">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  import Vue from 'vue';
  import {remote} from 'electron';
  import {get} from 'vuex-pathify';
  import Playlist from '../lib/Playlist';
  import Utils from '../lib/Utils';
  import store from '@/store/store';

  export default Vue.extend({
    name: 'PlaylistEditorData',
    props: {hash: {type: String, required: true}},
    data: () => ({
      valid: false,
      playlistTitle: '',
      playlistAuthor: '',
      playlistDescription: '',
      imageData: '',
      imageChanged: false,
      snackbar: false,
      snackbarType: '',
      snackbarText: '',
      dialogConfirmDelete: false,
    }),
    computed: {
      playlist() {
        return this.playlists.find((p) => p.playlistHash === this.hash);
      },
      playlists: get('songs/playlists'),
    },
    methods: {
      LoadImage() {
        Playlist
          .LoadCover(this.playlist.playlistPath)
          .then((data) => {
            this.imageChanged = false;
            return this.imageData = data;
          });
      },
      async openFileExplorer() {
        const file = remote.dialog.showOpenDialog({
          properties: ['openFile'],
          filters: [{
            name: 'Images',
            extensions: ['png', 'jpg'],
          }],
        });
        if (file !== undefined) {
          this.imageData = await Utils.LoadCover(file[0]);
          this.imageChanged = true;
        }
      },
      Cancel() {
        this.LoadImage();
        this.playlistTitle = this.playlist.playlistTitle;
        this.playlistAuthor = this.playlist.playlistAuthor;
        this.playlistDescription = this.playlist.playlistDescription;
      },
      Delete() {
        this.playlist.Delete();
        store.dispatch('songs/loadPlaylists');
        this.$router.push({name: 'playlists-local'});
      },
      /** @return {boolean} */
      IsThereChange() {
        return !(
          this.playlist.playlistTitle === this.playlistTitle &&
          this.playlist.playlistAuthor === this.playlistAuthor &&
          this.playlist.playlistDescription === this.playlistDescription &&
          !this.imageChanged
        );
      },
      Save() {
        const playlist = new Playlist();

        playlist.playlistTitle = this.playlistTitle;
        playlist.playlistAuthor = this.playlistAuthor;
        playlist.playlistDescription = this.playlistDescription;
        playlist.playlistPath = this.playlist.playlistPath;
        playlist.songs = this.playlist.songs;
        playlist.CalculateHash();

        playlist.Save(this.imageData)
          .then(() => {
            this.snackbarText = 'Successfully saved';
            this.snackbarType = 'success';
            this.imageChanged = false;
            this.$router.replace({name: 'playlist-editor', params: { hash: playlist.playlistHash }});
          })
          .catch(() => {
            this.snackbarText = 'Failed to save';
            this.snackbarType = 'error';
          })
          .finally(() => {
            store.dispatch('songs/loadPlaylists');
            return this.snackbar = true;
          });
      },
    },
    mounted() {
      this.$nextTick(async function() {
        this.LoadImage();
        this.playlistTitle = this.playlist.playlistTitle;
        this.playlistAuthor = this.playlist.playlistAuthor;
        this.playlistDescription = this.playlist.playlistDescription;
      });
    },
  });
</script>

<style scoped>
  .v-card--reveal {
    align-items: center;
    bottom: 0;
    justify-content: center;
    opacity: .5;
    position: absolute;
    width: 100%;
    height: 100%;
  }
</style>
