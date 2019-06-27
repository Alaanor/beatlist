<!--suppress XmlUnboundNsPrefix -->
<template>
  <v-container>
    <h1>Settings</h1><br>
    <h2>Required</h2><br>
    <v-form v-model="configValid">
      <v-text-field
              v-model="installationPath"
              label="Installation path"
              append-icon="folder"
              :prepend-icon="configValid ? 'done' : 'warning'"
              :rules="rules.validInstallationPath"
              @click:append="openFileExplorer"
              hint="The folder where Beat Saber is installed, must have a 'Beat Saber.exe' file there"
              solo
      ></v-text-field>
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

<script lang="ts">
  import {remote} from 'electron';
  import BeatSaber from '@/lib/BeatSaber';
  import Vue from 'vue';
  import {sync, get} from 'vuex-pathify';
  import SongData from '@/lib/SongData';
  import BtnScan from '@/components/BtnScan.vue';

  export default Vue.extend({
    name: 'Settings',
    components: {BtnScan},
    data: () => ({
      rules: {
        validInstallationPath: [(v: string) => BeatSaber.isPathLegit(v) || 'Installation path is not valid'],
      },
    }),
    computed: {
      installationPath: sync('settings/installationPath'),
      configValid: sync('settings/configValid'),
      darkTheme: sync('settings/darkTheme'),
      miniVariant: sync('settings/miniVariant'),
      permanent: sync('settings/permanent'),
      lastScan: get('songs/lastScan'),
      songs: get('songs/songs'),
    },
    methods: {
      openFileExplorer(): void {
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
      getNumberOfSongs(): number {
        const songs = this.songs as SongData[];
        return this.songs !== undefined ? songs.filter((s) => s.valid).length : 0;
      },
      getNumberOfInvalidSongs(): number {
        const songs = this.songs as SongData[];
        return this.songs !== undefined ? songs.filter((s) => !s.valid).length : 0;
      },
    },
  });
</script>
