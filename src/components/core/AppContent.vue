<template>
  <v-content>
    <v-container fluid>
      <v-row v-if="isReady">
        <v-col
          lg="10"
          cols="12"
          offset-lg="1"
        >
          <transition
            name="slide-x-transition"
            mode="out-in"
          >
            <router-view />
          </transition>
        </v-col>
      </v-row>
      <v-row
        v-else
      >
        <v-col
          lg="10"
          cols="12"
          offset-lg="1"
        >
          <div class="d-flex justify-center align-center flex-column fill-height">
            <v-progress-circular
              :size="75"
              :width="6"
              color="grey"
              indeterminate
            />
            <span class="pt-3 grey--text">Loading content ...</span>
            <transition name="slide-x-transition">
              <span
                v-if="twoSecond"
                class="pt warning--text caption"
              >
                If you're reading this message, there's probably a problem
              </span>
            </transition>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>

<script lang="ts">
import Vue from 'vue';
import { get } from 'vuex-pathify';
import store from '@/plugins/store';

export default Vue.extend({
  name: 'AppContent',
  data: () => ({
    isReady: false,
    twoSecond: false,
  }),
  computed: {
    configValid: get<boolean>('settings/configValid'),
  },
  async mounted() {
    setTimeout(() => {
      this.twoSecond = true;
    }, 2000);

    await (store as any).restored.then();
    this.onReady();
  },
  methods: {
    onReady() {
      this.isReady = true;
      this.CheckForSettingsRequirement();
    },
    CheckForSettingsRequirement() {
      if (!this.configValid) {
        this.$router.push({ name: 'settings' });
      }
    },
  },
});
</script>
