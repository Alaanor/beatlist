<template>
  <v-container>
    <h1>Settings</h1>
    <br/>
    <form>
      <v-text-field
              v-model="installationPath"
              label="Installation path"
              append-icon="folder"
              @click:append="openFileExplorer"
              required solo
      ></v-text-field>
    </form>
  </v-container>
</template>

<script lang="ts">
  import store from '@/store';
  import { remote } from 'electron';

  export default {
    name: 'Settings',
    computed: {
      installationPath: {
        get() {
          return store.state.installationPath;
        },
        set(value: string) {
          store.commit('setInstallationPath', value);
        },
      },
    },
    methods: {
      openFileExplorer() {
        store.commit('setInstallationPath', remote.dialog.showOpenDialog({}));
      },
    },
  };
</script>

<style scoped>

</style>
