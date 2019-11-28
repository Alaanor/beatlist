<template>
  <v-app>
    <AppMenu/>
    <!-- App Bar -->
    <!-- Content -->
    <!-- Services/Background -->
  </v-app>
</template>

<script lang="ts">
  import Vue from 'vue';
  import AppMenu from '@/components/core/AppMenu.vue';
  import AppBar from '@/components/core/AppBar.vue';
  import AppContent from '@/components/core/AppContent.vue';
  import AppServices from '@/components/core/AppServices.vue';

  export default Vue.extend({
    name: 'App',
    components: { AppMenu, AppBar, AppContent, AppServices },
    data: () => ({

    }),
  });
</script>

<style scoped>

</style>
