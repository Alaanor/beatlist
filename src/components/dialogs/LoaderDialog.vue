<template>
  <v-dialog
    v-model="value"
    persistent
    width="300"
    @input="$emit('input', $event.target.value)"
  >
    <v-card>
      <v-list-item>
        <v-list-item-icon>
          <v-icon>search</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Scanning song</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-card-text>
        <v-progress-linear
          :indeterminate="true"
          class="mb-0"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'LoaderDialog',
  props: {
    value: { type: Boolean, required: true },
    icon: { type: String, default: 'load' },
    text: { type: String, default: 'loading' },
  },
});
</script>

<style scoped>

</style>
