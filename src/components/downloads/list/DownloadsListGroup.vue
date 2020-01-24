<template>
  <div>
    <v-subheader v-if="subHeader">
      {{ `${subHeader} - ${operations.length}` }}
    </v-subheader>
    <v-list-item-group v-if="operations.length !== 0">
      <v-list-item
        v-for="operation in operations"
        :key="operation.type"
      >
        <component :is="`DownloadListTemplate${operation.type}`"/>
      </v-list-item>
    </v-list-item-group>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { DownloadOperation } from '@/libraries/net/downloader/operation/DownloadOperation';

export default Vue.extend({
  name: 'DownloadsListGroup',
  props: {
    operations: { type: Array as PropType<DownloadOperation[]>, required: true },
    subHeader: { type: String, default: undefined },
  },
});
</script>

<style scoped>

</style>
