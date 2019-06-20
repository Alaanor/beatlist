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
    <h2>Preferences</h2>
    <v-switch v-model="darkTheme" label="Dark theme"></v-switch>
    <v-switch v-model="miniVariant" label="Mini sidebar"></v-switch>
  </v-container>
</template>

<script lang="ts">
  import {remote} from 'electron';
  import BeatSaber from '@/lib/BeatSaber';
  import Vue from 'vue';
  import { sync } from 'vuex-pathify';

  export default Vue.extend({
    name: 'Settings',
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
    },
  });
</script>
