<!--suppress XmlUnboundNsPrefix -->
<template>
  <v-container>
    <v-alert :value="!configValid" type="warning" class="mb-3">
      Please set the <strong>installation path</strong> and <strong>scan the library</strong>.
    </v-alert>
    <h1>Settings</h1><br>
    <h2>Installation path</h2><br>
    <v-form v-model="installationPathValid">
      <v-text-field
              v-model="installationPath"
              label="Installation path"
              append-icon="folder"
              :prepend-icon="installationPathValid ? 'done' : 'warning'"
              :rules="rules.validInstallationPath"
              @click:append="openFileExplorer"
              hint="The folder where Beat Saber is installed, must have a 'Beat Saber.exe' file there"
              solo>
      </v-text-field>
    </v-form>
    <h2>Song library</h2>
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
    <h2>Preferences</h2>
    <v-switch v-model="darkTheme" label="Dark theme"></v-switch>
    <v-switch v-model="miniVariant" label="Mini sidebar"></v-switch>
    <v-switch v-model="permanent" label="Permanent sidebar"></v-switch>
  </v-container>
</template>

<script>
  import {remote} from 'electron';
  import BeatSaber from '@/lib/BeatSaber';
  import Vue from 'vue';
  import {sync, get} from 'vuex-pathify';
  import BtnScan from '@/components/BtnScan.vue';

  export default Vue.extend({
    name: 'Settings',
    components: {BtnScan},
    data: () => ({
      rules: {
        validInstallationPath: [(v) => BeatSaber.isPathLegit(v) || 'Installation path is not valid'],
      },
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
      installationPathValid() { this.validateConfig(); },
      songs() { this.validateConfig(); },
    },
    methods: {
      openFileExplorer() {
        const folder = remote.dialog.showOpenDialog({properties: ['openDirectory']});
        if (folder !== undefined) {
          this.installationPath = folder[0];
        }
      },
      validate() {
        const form = this.$refs.form as HTMLFormElement;
        form.validate();
      },
      getLastScan() {
        const lastScan = this.lastScan as Date;

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
        this.configValid = this.installationPathValid && this.songs.length > 0;
      },
    },
  });
</script>
