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
        <component
          :is="`DownloadsListTemplate${operation.type}`"
          :operation="operation"
        />
      </v-list-item>
    </v-list-item-group>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { DownloadOperation } from '@/libraries/net/downloader/operation/DownloadOperation';
import DownloadsListTemplateBeatmap from '@/components/downloads/list/template/DownloadsListTemplateBeatmap.vue';

export default Vue.extend({
  name: 'DownloadsListGroup',
  components: { DownloadsListTemplateBeatmap },
  props: {
    operations: { type: Array as PropType<DownloadOperation[]>, required: true },
    subHeader: { type: String, default: undefined },
  },
});
</script>

<style scoped>

</style>
