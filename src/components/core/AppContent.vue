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
          <transition
            name="pageChange"
            mode="out-in"
          >
            <keep-alive>
              <router-view />
            </keep-alive>
          </transition>
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
.pageChange-enter-active {
  animation-name: slideIn;
}

.pageChange-leave-active {
  animation-name: slideOut;
}

.pageChange-leave-active,
.pageChange-enter-active {
  animation-duration: 0.4s;
  animation-timing-function: ease-out;
  transition: opacity 0.4s ease-out;
}

.pageChange-leave-to,
.pageChange-enter {
  opacity: 0;
}

.pageChange-enter-to,
.pageChange-leave {
  opacity: 1;
}


@keyframes slideIn {
  from {
    transform: translateX(-10%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes slideOut {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(10%);
  }
}
</style>
