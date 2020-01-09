<template>
  <div>
    <v-divider/>
    <div class="d-flex justify-end align-center small-font py-1">
      <span>Rows per page:</span>
      <v-menu>
        <template #activator="{ on }">
          <v-btn
            small
            text
            outlined
            class="mx-3"
            v-on="on"
          >
            {{ itemsPerPage | withAll }}
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="item in footerOptions.itemPerPageList"
            :key="item"
            @click="itemsPerPage = item"
          >
            <v-list-item-title>{{ item | withAll }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <span class="px-2">
        {{ `${pagination.pageStart+1}-${pagination.pageStop} of ${pagination.itemsLength}` }}
      </span>
      <v-btn
        icon
        small
        class="ml-2 mr-1"
        @click="options.page--"
      >
        <v-icon small>
          chevron_left
        </v-icon>
      </v-btn>
      <v-btn
        icon
        small
        class="ml-1 mr-5"
        @click="options.page++"
      >
        <v-icon small>
          chevron_right
        </v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { sync } from 'vuex-pathify';

export default {
  name: 'BeatmapsTableFooter',
  filters: {
    withAll(item: number): string {
      return item === -1 ? 'All' : item.toString();
    },
  },
  props: {
    options: { type: Object, required: true },
    pagination: { type: Object, required: true },
  },
  data: () => ({
    footerOptions: {
      itemPerPageList: [5, 10, 15, 20, 25, 50, 100, -1],
    },
  }),
  computed: {
    itemsPerPage: sync<number>('settings/beatmapsTable@itemsPerPage'),
  },
};
</script>
<style scoped>
  .small-font {
    font-size: 12px;
  }
</style>
