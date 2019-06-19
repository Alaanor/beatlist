<template>
  <v-container>
    <h1>Settings</h1>
    <form>
      <v-text-field
              v-model="installationPath"
              label="Installation path"
              required
      ></v-text-field>
    </form>
  </v-container>
</template>

<script lang="ts">
  import store from '@/store';

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
  };
</script>

<style scoped>

</style>
