<template>
  <v-navigation-drawer
    permanent
    :app="app"
    :right="right"
    :width="width"
    color="transparent"
    :style="app ? 'margin-top: 80px' : ''"
  >
    <p
      class="title font-weight-light mb-2"
      style="padding-left: 7px"
    >
      {{ headerName }}
    </p>
    <ul class="toc">
      <li
        v-for="item in items"
        :key="item.name"
        :class="item.sectionId === activeSection ? 'active blue--text' : 'text--disabled'"
        class="toc-item font-weight-light"
        @click="goTo(item.sectionId)"
      >
        <a>
          {{ item.name }}
        </a>
      </li>
    </ul>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { TocItem } from '@/components/toc/TocItem';

export default Vue.extend({
  name: 'Toc',
  props: {
    headerName: { type: String, default: 'Contents' },
    items: { type: Array as PropType<TocItem[]>, required: true },
    app: { type: Boolean, default: true },
    width: { type: Number, default: 150 },
    right: { type: Boolean, default: true },
  },
  data: () => ({
    activeSection: 'playlist-details',
    offset: 25,
  }),
  created(): void {
    window.addEventListener('scroll', this.updateCurrentSection);
  },
  destroyed(): void {
    window.removeEventListener('scroll', this.updateCurrentSection);
  },
  methods: {
    goTo(domId: string) {
      this.$vuetify.goTo(`#${domId}`, {
        duration: 500,
        offset: this.offset,
        easing: 'easeInOutCubic',
      });
    },
    updateCurrentSection() {
      const orderedItemByScroll = this.items
        .map((item: TocItem) => ({
          position: document.querySelector(`#${item.sectionId}`)?.getBoundingClientRect().top,
          sectionId: item.sectionId,
        }))
        .filter((o): o is { position: number, sectionId: string } => o.position !== undefined)
        .map((item) => {
          item.position -= this.offset + 100;
          return item;
        })
        .sort((a, b) => a.position - b.position);

      if (orderedItemByScroll.length === 0) {
        return;
      }

      if (orderedItemByScroll[0].position > 0) {
        this.activeSection = orderedItemByScroll[0].sectionId;
      } else {
        this.activeSection = [
          ...orderedItemByScroll.filter((item) => item.position <= 0),
        ].pop()?.sectionId ?? '';
      }
    },
  },
});
</script>

<style scoped>
  ul.toc {
    padding-left: 0;
  }
  li.toc-item {
    list-style-type: none !important;
    border-left: 2px solid transparent;
  }

  li.toc-item a {
    text-decoration: none;
    color: inherit;
    transition: color .1s ease-in;
    padding-left: 5px;
  }

  li.toc-item.active {
    border-color: #2196f3;
  }
</style>
