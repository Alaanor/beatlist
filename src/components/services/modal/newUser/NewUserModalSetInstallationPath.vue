<template>
  <div>
    <v-progress-circular v-if="loading" indeterminate />
    <div v-if="failed" class="d-flex flex-row align-center">
      <v-icon color="error" class="pr-4">
        report_problem
      </v-icon>
      <div>
        Failed to detect your beatsaber installation<br />
        <span class="text--disabled caption">
          Are you sure you installed the game ? <br />
          This is for pc user only, quest is not supported.
        </span>
      </div>
    </div>
    <div v-else class="d-flex flex-row align-center">
      <v-icon color="success" class="pr-4">
        check
      </v-icon>
      <div>
        Found the installation path at<br />
        <span class="text--disabled caption">{{ installationPath }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { sync } from "vuex-pathify";
import PathResolver from "@/libraries/ipc/PathResolver.ipc";

export default Vue.extend({
  name: "NewUserModalSetInstallationPath",
  data: () => ({
    loading: true,
    failed: false,
  }),
  computed: {
    installationPath: sync<string>("settings/installationPath"),
  },
  mounted(): void {
    if (this.installationPath !== "") {
      this.loading = false;
      return;
    }

    PathResolver.detectInstallationPath()
      .then((path: string) => {
        this.failed = path === "";
        this.installationPath = path;
      })
      .finally(() => {
        this.loading = false;
      });
  },
});
</script>
