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
import DownloadsListGroup from '@/components/downloads/list/DownloadsListGroup.vue';
import DownloadLibrary from '@/libraries/net/downloader/DownloadLibrary';

export default Vue.extend({
  name: 'Downloads',
  components: { DownloadsListGroup },
  computed: {
    queued: () => DownloadLibrary.queuedOperation,
    ongoing: () => DownloadLibrary.ongoingOperation,
    completed: () => DownloadLibrary.completedOperation,
  },
});
</script>

<style scoped>

</style>
