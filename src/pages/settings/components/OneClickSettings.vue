<template>
  <div>
    <p class="title pt-3">
      One click
    </p>
    <span class="text--disabled">
      The current beatsaver:// url handler is
      <strong class="accent--text">
        {{ currentBeatsaverProtocolHandler() }}
      </strong>
    </span>
    <v-switch
      v-model="enabled"
      color="accent"
      label="Enable one click feature"
      messages="Open beatsaver:// link with beatlist"
      dense
      inset
    />
    <v-switch
      v-model="downloadOnClick"
      color="accent"
      label="Download on click"
      messages="If this option is enabled it will directly start the download after you open a beatsaver:// link."
      :disabled="!enabled"
      dense
      inset
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { sync } from "vuex-pathify";
import { remote } from "electron";

export default Vue.extend({
  name: "OneClickSettings",
  computed: {
    enabled: sync<boolean>("settings/oneClick@enabled"),
    downloadOnClick: sync<boolean>("settings/oneClick@downloadOnClick"),
  },
  watch: {
    enabled() {
      if (this.enabled) {
        remote.app.setAsDefaultProtocolClient("beatsaver");
      } else {
        remote.app.removeAsDefaultProtocolClient("beatsaver");
      }
    },
  },
  methods: {
    currentBeatsaverProtocolHandler() {
      return remote.app.getApplicationNameForProtocol("beatsaver://");
    },
  },
});
</script>
