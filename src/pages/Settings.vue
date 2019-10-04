<template>
  <v-container>
    <v-alert :value="!configValid" type="warning" class="mb-3">
      Please set the <strong>installation path</strong> and <strong>scan the library</strong>.
    </v-alert>
    <p class="display-2">Settings</p>
    <p class="display-1">Installation path</p>
    <v-form v-model="installationPathValid">
      <v-text-field
              v-model="installationPath"
              label="Installation path"
              append-icon="folder"
              :color="installationPathValid ? '' : 'red'"
              :prepend-icon="installationPathValid ? 'done' : 'warning'"
              :rules="rules.validInstallationPath"
              @click:append="openFileExplorer"
              hint="The folder where Beat Saber is installed, must have a 'Beat Saber.exe' file there"
              solo>
      </v-text-field>
      <v-btn text color="success" class="mb-4"
             :disabled="installationPathValid"
             @click="detectPath()"
             :loading="resolveBtnLoading">
        <v-icon class="pr-3">fa-magic</v-icon>
        Detect installation path
      </v-btn>
    </v-form>
    <p class="display-1">Song library</p>
    <v-container>
      <v-layout>
        <v-flex>
          <div class="subheading">Number of songs detected: {{getNumberOfSongs()}}</div>
          <div>Last scan: {{getLastScan()}}</div>
          <v-tooltip left>
            <template v-slot:activator="{ on }">
              <div class="caption" v-if="getNumberOfInvalidSongs() > 0" v-on="on">
                {{getNumberOfInvalidSongs()}} song(s) couldn't've been imported.
              </div>
            </template>
            <span>
              For example old song/version of song<br>
              that aren't on beatSaver anymore.<br>
              Or custom map not published yet.
            </span>
          </v-tooltip>
        </v-flex>
        <v-flex>
          <BtnScan></BtnScan>
        </v-flex>
      </v-layout>
    </v-container>
    <p class="display-1">Preferences</p>
    <v-switch v-model="darkTheme" color="primary" label="Dark theme"></v-switch>
    <v-switch v-model="miniVariant" color="primary" label="Mini sidebar"></v-switch>
    <v-switch v-model="permanent" color="primary" label="Permanent sidebar"></v-switch>
    <v-snackbar v-model="snackbar" :color="snackbarType" :timeout="3000">
      {{ snackbarText }}
      <v-btn text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
  import {remote} from 'electron';
  import BeatSaber from '@/lib/BeatSaber';
  import Vue from 'vue';
  import {sync, get} from 'vuex-pathify';
  import BtnScan from '@/components/BtnScan.vue';
  import {ipcRenderer} from 'electron';
  import {
    RESOLVE_INST_PATH_MSG,
    RESOLVE_INST_PATH_REPLY,
  } from '../lib/ipc/PathResolver';

  export default Vue.extend({
    name: 'Settings',
    components: {BtnScan},
    data: () => ({
      rules: {
        validInstallationPath: [(v) => BeatSaber.isPathLegit(v) || 'Installation path is not valid'],
      },
      snackbar: false,
      snackbarType: '',
      snackbarText: '',
      resolveBtnLoading: false,
    }),
    computed: {
      installationPath: sync('settings/installationPath'),
      installationPathValid: sync('settings/installationPathValid'),
      configValid: sync('settings/configValid'),
      darkTheme: sync('settings/darkTheme'),
      miniVariant: sync('settings/miniVariant'),
      permanent: sync('settings/permanent'),
      lastScan: get('songs/lastScan'),
      songs: get('songs/songs'),
    },
    watch: {
      installationPathValid() {
        this.validateConfig();
      },
      songs() {
        this.validateConfig();
      },
    },
    methods: {
      openFileExplorer() {
        const folder = remote.dialog.showOpenDialog({properties: ['openDirectory']});
        if (folder !== undefined) {
          this.installationPath = folder[0];
        }
      },
      validate() {
        const form = this.$refs.form;
        form.validate();
      },
      getLastScan() {
        const lastScan = this.lastScan;

        if (lastScan === undefined) {
          return 'Never';
        }

        return lastScan.toLocaleString();
      },
      getNumberOfSongs() {
        return this.songs !== undefined ? this.songs.filter((s) => s.valid).length : 0;
      },
      getNumberOfInvalidSongs() {
        return this.songs !== undefined ? this.songs.filter((s) => !s.valid).length : 0;
      },
      validateConfig() {
        this.configValid = this.installationPathValid && this.songs;
      },
      async detectPath() {
        this.resolveBtnLoading = true;

        ipcRenderer.send(RESOLVE_INST_PATH_MSG);
        ipcRenderer.on(RESOLVE_INST_PATH_REPLY, (event, arg) => {
          const instPath = arg;
          if (!instPath) {
            this.snackbarType = 'error';
            this.snackbarText = 'Couldn\'t detect installation path :(';
          } else {
            this.installationPath = instPath;
            this.snackbarType = 'success';
            this.snackbarText = 'Installation path found :)';
          }

          this.resolveBtnLoading = false;
          this.snackbar = true;
        });
      },
    },
  });
</script>
