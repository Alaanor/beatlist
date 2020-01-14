<template>
  <v-chip-group
    v-model="shownColumn"
    mandatory
    multiple
    show-arrows
  >
    <v-chip
      v-for="column in availableColumn"
      :key="column.value"
      :value="column.value"
      class="success--text"
      outlined
      small
    >
      {{ column.name }}
    </v-chip>
  </v-chip-group>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export default Vue.extend({
  name: 'BeatmapsTableColumnSelector',
  props: {
    value: { type: Array as PropType<string[]>, required: true },
  },
  data: () => ({
    shownColumn: [] as string[],
    headers: [
      { value: 'cover', text: 'Cover' },
      { value: 'name', text: 'Song name' },
      { value: 'artist', text: 'Artist' },
      { value: 'mapper', text: 'Mapper' },
      { value: 'difficulties', text: 'Difficulties' },
      { value: 'dl', text: 'Downloads' },
      { value: 'plays', text: 'Plays' },
      { value: 'upvotes', text: 'Up votes' },
      { value: 'downvotes', text: 'Down votes' },
      { value: 'rating', text: 'Rating' },
      { value: 'uploaded', text: 'Uploaded' },
      { value: 'key', text: 'Key' },
      { value: 'hash', text: 'Hash' },
    ],
  }),
  computed: {
    availableColumn(): {name: string, value: string }[] {
      return this.headers.map((header) => ({
        name: header.text,
        value: header.value,
      }));
    },
  },
  watch: {
    shownColumn(): void {
      this.$emit('input', this.shownColumn);
    },
  },
  mounted(): void {
    this.shownColumn = this.value;
  },
});
</script>
