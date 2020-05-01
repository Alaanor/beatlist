<template>
  <v-content>
    <v-container v-if="isReady" fluid>
      <v-row>
        <transition name="slide-x-transition" mode="out-in">
          <router-view style="z-index: 1;" />
        </transition>
      </v-row>
    </v-container>
    <LoadingPage v-else>
      <span class="pt-3 grey--text">Loading content ...</span>
      <transition name="slide-x-transition">
        <span v-if="twoSecond" class="pt warning--text caption">
          If you're reading this message, there's probably a problem
        </span>
      </transition>
    </LoadingPage>
  </v-content>
</template>

<script lang="ts">
import Vue from "vue";
import { get } from "vuex-pathify";
import store from "@/plugins/store";
import LoadingPage from "@/components/helper/LoadingPage.vue";

export default Vue.extend({
  name: "AppContent",
  components: { LoadingPage },
  data: () => ({
    isReady: false,
    twoSecond: false,
  }),
  computed: {
    configValid: get<boolean>("settings/configValid"),
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
        this.$router.push({ name: "settings" });
      }
    },
  },
});
</script>
