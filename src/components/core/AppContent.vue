<template>
  <v-content>
    <v-container
      fluid
      fill-height
    >
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
  methods: {
    onReady() {
      // TODO: CheckSettingsRequirement + RegisterBeatSaverLinkListener + DiscordRichPresence
    },
  },
});
</script>

<style scoped>

</style>
