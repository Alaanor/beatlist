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
        <keep-alive>
          <transition
            appear
            name="slide-x-transition"
            mode="out-in"
          >
            <router-view/>
          </transition>
        </keep-alive>
      </v-layout>
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
