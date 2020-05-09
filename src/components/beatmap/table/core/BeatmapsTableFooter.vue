<template>
  <div>
    <div class="d-flex justify-end align-center small-font py-1">
      <span v-if="!noItemPerPageChoice">Rows per page:</span>
      <v-menu v-if="!noItemPerPageChoice">
        <template #activator="{ on }">
          <v-btn small text outlined class="mx-3" v-on="on">
            {{ itemsPerPage | withAll }}
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="item in itemsPerPageList"
            :key="item"
            @click="updateItemsPerPage(item)"
          >
            <v-list-item-title>{{ item | withAll }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <span class="px-2">
        {{
          `${pagination.pageStart + 1}-${pagination.pageStop} of ${
            pagination.itemsLength
          }`
        }}
      </span>
      <v-btn
        icon
        small
        class="ml-2 mr-1"
        :disabled="isFirstPage"
        @click="pageStart"
      >
        <v-icon small>
          first_page
        </v-icon>
      </v-btn>
      <v-btn
        icon
        small
        class="mx-1"
        :disabled="isFirstPage"
        @click="pagePrevious"
      >
        <v-icon small>
          chevron_left
        </v-icon>
      </v-btn>
      <v-btn icon small class="mx-1" :disabled="isLastPage" @click="pageNext">
        <v-icon small>
          chevron_right
        </v-icon>
      </v-btn>
      <v-btn
        icon
        small
        class="ml-1 mr-5"
        :disabled="isLastPage"
        @click="pageEnd"
      >
        <v-icon small>
          last_page
        </v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";

export default Vue.extend({
  name: "BeatmapsTableFooter",
  filters: {
    withAll(item: number): string {
      return item === -1 ? "all" : item.toString();
    },
  },
  props: {
    page: { type: Number, required: true },
    pagination: { type: Object, required: true },
    itemsPerPage: { type: Number, default: undefined },
    itemsPerPageList: {
      type: Array as PropType<number[]>,
      default: () => [5, 10, 15, 20, 25, 50, 100, -1],
    },
    noItemPerPageChoice: { type: Boolean, default: false },
  },
  computed: {
    isFirstPage() {
      return this.page === 1;
    },
    isLastPage() {
      return this.page === this.pagination.pageCount;
    },
  },
  methods: {
    pagePrevious() {
      if (this.page > 0) {
        this.$emit("update:page", this.page - 1);
      }
    },
    pageNext() {
      if (this.page < this.pagination.pageCount) {
        this.$emit("update:page", this.page + 1);
      }
    },
    pageStart() {
      this.$emit("update:page", 1);
    },
    pageEnd() {
      this.$emit("update:page", this.pagination.pageCount);
    },
    updateItemsPerPage(item: number) {
      this.$emit("update:itemsPerPage", item);
    },
  },
});
</script>
<style scoped>
.small-font {
  font-size: 12px;
}
</style>
