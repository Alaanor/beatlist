<template>
  <v-content>
    <v-container
      fluid
      fill-height
    >
      <v-layout v-if="isReady">
        <v-flex
          lg10
          xs12
          offset-lg1
        >
          <keep-alive>
            <transition
              appear
              name="slide-x-transition"
              mode="out-in"
            >
              <router-view/>
            </transition>
          </keep-alive>
        </v-flex>
      </v-layout>
      <v-layout
        v-else
        justify-center
        align-center
      >
        <v-flex shrink>
          <v-progress-circular
            :size="100"
            :width="5"
            indeterminate
          />
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'AppContent',
  data: () => ({
    isReady: false,
  }),
  mounted(): void {
    const st = this.$store as unknown as { _vm: { $root: Vue } };
    st._vm.$root.$on('storageReady', () => {
      this.isReady = true;
      this.onReady();
    });
  },
  methods: {
    onReady() {
      // TODO: CheckSettingsRequirement + RegisterBeatSaverLinkListener + DiscordRichPresence
    },
  },
});
</script>

<style scoped>

</style>
