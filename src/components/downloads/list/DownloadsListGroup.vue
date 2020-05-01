<template>
  <div>
    <v-subheader v-if="subHeader">
      {{ `${subHeader} - ${operations.length}` }}
    </v-subheader>
    <v-list v-if="operations.length !== 0" rounded dense>
      <div
        v-for="operation in operations"
        :key="operation.beatmap.key + operation.progress.time.startedAt"
        dense
      >
        <component
          :is="`DownloadsListTemplate${operation.type}`"
          :operation="operation"
          :type="type"
        />
      </div>
    </v-list>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { DownloadOperation } from "@/libraries/net/downloader/operation/DownloadOperation";
import DownloadsListTemplateBeatmap from "@/components/downloads/list/template/DownloadsListTemplateBeatmap.vue";

export default Vue.extend({
  name: "DownloadsListGroup",
  components: { DownloadsListTemplateBeatmap },
  props: {
    operations: {
      type: Array as PropType<DownloadOperation[]>,
      required: true,
    },
    subHeader: { type: String, default: undefined },
    type: {
      type: String as PropType<"queued" | "ongoing" | "completed">,
      required: true,
    },
  },
});
</script>

<style scoped></style>
