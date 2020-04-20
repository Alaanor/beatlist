<template>
  <v-dialog
    v-model="value"
    persistent
    width="300"
    @input="$emit('input', $event.target.value)"
  >
    <v-card :color="color">
      <v-list-item>
        <v-list-item-icon class="mr-2">
          <v-icon>{{ icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title
            v-if="progress === undefined"
            class="body-2"
          >
            {{ text }}
          </v-list-item-title>
          <v-list-item-title
            v-else
            class="body-2"
          >
            {{ `${text} (${progress.get().done}/${progress.get().total})` }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-card-text>
        <v-progress-linear
          v-if="progress === undefined"
          :indeterminate="true"
          class="mb-0"
        />
        <v-progress-linear
          v-else
          :value="progress.getRatio() * 100"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { ProgressInterface } from '@/libraries/common/Progress';

export default Vue.extend({
  name: 'LoaderDialog',
  props: {
    value: { type: Boolean, required: true },
    progress: { type: Object as PropType<ProgressInterface>, default: undefined },
    icon: { type: String, default: 'load' },
    text: { type: String, default: 'loading' },
    color: { type: String, default: undefined },
  },
});
</script>

<style scoped>

</style>
