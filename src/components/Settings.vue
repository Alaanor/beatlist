<template>
  <v-container>
    <h1>Settings</h1>
    <br/>
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
  </v-container>
</template>

<script lang="ts">
  import store from '@/store';
  import {remote} from 'electron';
  import BeatSaber from '@/lib/BeatSaber';
  import Vue from 'vue';

  export default Vue.extend({
    name: 'Settings',
    data: () => ({
      rules: {
        validInstallationPath: [(v: string) => BeatSaber.isPathLegit(v) || 'Installation path is not valid'],
      },
    }),
    computed: {
      installationPath: {
        get() {
          return store.state.installationPath;
        },
        set(value: string) {
          store.commit('setInstallationPath', value);
        },
      },
      configValid: {
        get() {
          return store.state.configValid;
        },
        set(value: boolean) {
          store.commit('setConfigValidState', value);
        },
      },
    },
    methods: {
      openFileExplorer() {
        const folder = remote.dialog.showOpenDialog({properties: ['openDirectory']});
        if (folder !== undefined) {
          store.commit('setInstallationPath', folder[0]);
        }
      },
      validate() {
        const form = this.$refs.form as HTMLFormElement;
        form.validate();
      },
    },
  });
</script>

<style scoped>

</style>
