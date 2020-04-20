<template>
  <v-progress-circular
    v-if="operation"
    color="success"
    :rotate="-90"
    :value="progressPercent.toString()"
  />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { DownloadOperation } from '@/libraries/net/downloader/operation/DownloadOperation';

export default Vue.extend({
  name: 'DownloadProgressCircular',
  props: {
    operation: { type: Object as PropType<DownloadOperation>, required: true },
  },
  computed: {
    progressPercent(): number {
      const percent = this.operation.progress.bytes.percent * 100;
      return Math.ceil(percent / 5) * 5; // less update, the UI react faster
    },
  },
});
</script>

<style scoped>

</style>
