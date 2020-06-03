<template>
  <v-dialog v-model="open" persistent width="400" overlay-opacity="0.97" dark>
    <v-card>
      <v-card-title>
        <div class="display-2 text-center font-weight-light ma-auto">
          Welcome to<br />
          <img
            src="@/assets/title_dark.png"
            width="250"
            alt="beatlist logo title"
          />
        </div>
      </v-card-title>
      <v-card-text>
        <div class="flex flex-column">
          <NewUserModalSetInstallationPath class="pb-2" />
          <NewUserModalScanContent v-if="installationPath !== ''" />
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          v-if="installationPath !== '' && lastScan"
          text
          color="success"
          @click="done"
        >
          Start using beatlist
        </v-btn>
        <v-btn v-else text @click="done">
          Skip
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import { get, sync } from "vuex-pathify";
import NewUserModalSetInstallationPath from "@/components/services/modal/newUser/NewUserModalSetInstallationPath.vue";
import NewUserModalScanContent from "@/components/services/modal/newUser/NewUserModalScanContent.vue";

export default Vue.extend({
  name: "NewUserModalServiceVue",
  components: {
    NewUserModalSetInstallationPath,
    NewUserModalScanContent,
  },
  computed: {
    open: sync<boolean>("modal/newUserModal"),
    installationPath: get<string>("settings/installationPath"),
    lastScan: get<Date | undefined>("beatmap/lastScan"),
  },
  methods: {
    done() {
      this.open = false;
    },
  },
});
</script>
