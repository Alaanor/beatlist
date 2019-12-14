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
import { get } from 'vuex-pathify';

export default Vue.extend({
  name: 'AppContent',
  data: () => ({
    isReady: false,
  }),
  computed: {
    configValid: get('settings/configValid'),
  },
  mounted(): void {
    this.onReady();
  },
  methods: {
    onReady() {
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

<style scoped>

</style>
