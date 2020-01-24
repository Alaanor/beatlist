<template>
  <v-container>
    <p class="display-2">
      Downloads
    </p>
    <v-list rounded>
      <DownloadsListGroup
        sub-header="On going"
        :operations="ongoing"
      />
      <DownloadsListGroup
        sub-header="Queued"
        :operations="queued"
      />
      <DownloadsListGroup
        sub-header="Completed"
        :operations="completed"
      />
    </v-list>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import DownloadManager from '@/libraries/net/downloader/DownloadManager';
import DownloadsListGroup from '@/components/downloads/list/DownloadsListGroup.vue';

export default Vue.extend({
  name: 'Downloads',
  components: { DownloadsListGroup },
  computed: {
    queued: () => DownloadManager.Singleton.queuedOperation,
    ongoing: () => DownloadManager.Singleton.ongoingOperation,
    completed: () => DownloadManager.Singleton.completedOperation,
  },

});
</script>

<style scoped>

</style>
