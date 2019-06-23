<template>
  <v-container pa-0 ma-0>
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
                <v-text-field ref="title" label="Title" v-model="title" clearable></v-text-field>
                <v-text-field ref="author" label="Author" v-model="author" clearable></v-text-field>
                <v-textarea ref="description" label="Description" v-model="description"></v-textarea>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-container>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey" @click="Cancel">Cancel</v-btn>
            <v-btn color="success" @click="Save">Save</v-btn>
          </v-card-actions>
        </v-container>
      </v-form>
    </v-card>
    <v-snackbar v-model="snackbar" :color="snackbarType" timeout="3000">
      {{ snackbarText }}
      <v-btn flat @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
  import Vue from 'vue';
  import {remote} from 'electron';
  import Playlist from '../lib/Playlist';
  import Utils from '../lib/Utils';

  export default Vue.extend({
    name: 'PlaylistEditorData',
    props: {data: {type: Object, required: true}},
    data: () => ({
      valid: false,
      title: '',
      author: '',
      description: '',
      imageData: '',
      snackbar: false,
      snackbarType: '',
      snackbarText: '',
    }),
    methods: {
      LoadImage() {
        Playlist
          .LoadCover(this.data.playlistPath)
          .then((data) => this.imageData = data);
      },
      async openFileExplorer() {
        const file = remote.dialog.showOpenDialog({
          properties: ['openFile'],
          filters: [{name: 'Images', extensions: ['png', 'jpg']}]
        });
        if (file !== undefined) {
          this.imageData = await Utils.LoadCover(file[0]);
        }
      },
      Cancel() {
        this.LoadImage();
        this.title = this.data.playlistTitle;
        this.author = this.data.playlistAuthor;
        this.description = this.data.playlistDescription;
      },
      Save() {
        const playlist = new Playlist();
        playlist.playlistTitle = this.title;
        playlist.playlistAuthor = this.author;
        playlist.playlistDescription = this.description;
        playlist.playlistPath = this.data.playlistPath;
        playlist.songs = this.data.songs;
        playlist.Save(this.imageData)
          .then(() => {
            this.snackbarText = 'Successfully saved';
            this.snackbarType = 'success';
          })
          .catch(err => {
            this.snackbarText = 'Failed to save';
            this.snackbarType = 'error';
          })
          .finally(() => this.snackbar = true);
      },
    },
    mounted() {
      this.$nextTick(async function () {
        this.LoadImage();
        this.title = this.data.playlistTitle;
        this.author = this.data.playlistAuthor;
        this.description = this.data.playlistDescription;
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
