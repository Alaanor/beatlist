<template>
  <v-dialog v-model="open" max-width="80%" @click:outside="closeDialog">
    <v-card>
      <v-card-title>
        Invalid beatmaps
      </v-card-title>
      <v-card-text>
        <v-simple-table height="500" dense fixed-header>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">
                  Key type
                </th>
                <th class="text-left">
                  Key value
                </th>
                <th class="text-left">
                  Reason
                </th>
                <th class="text-left">
                  More info
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="[index, item] in invalidBeatmap" :key="index">
                <td>{{ item.loadState.attemptedSource.type }}</td>
                <td>{{ item.loadState.attemptedSource.value }}</td>
                <td class="error--text">
                  {{ item.loadState.errorType | errorTranslated }}
                </td>
                <td>
                  {{ item.loadState.errorMessage }}
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="closeDialog">
          Ok
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import BeatsaverCachedLibrary from "@/libraries/beatmap/repo/BeatsaverCachedLibrary";
import { BeatsaverItemLoadError } from "@/libraries/beatmap/repo/BeatsaverItem";

export default Vue.extend({
  name: "InvalidBeatmapDialog",
  filters: {
    errorTranslated: (error: BeatsaverItemLoadError): string => {
      switch (error) {
        case BeatsaverItemLoadError.BeatmapNotOnBeatsaver:
          return "Couldn't find the map on beatsaver";
        case BeatsaverItemLoadError.BeatsaverServerNotAvailable:
          return "Beatsaver server was unavailable";
        case BeatsaverItemLoadError.InvalidDataReceivedFromBeatsaver:
          return "Unexpected answer gotten from beatsaver";
        case BeatsaverItemLoadError.BeatsaverRateLimited:
          return "Got rate limited by the beatsaver's server";
        case BeatsaverItemLoadError.RequestTimeout:
          return "The request got a timeout";
        case BeatsaverItemLoadError.Unknown:
        default:
          return "Unknown error";
      }
    },
  },
  props: {
    open: { type: Boolean, required: true },
  },
  computed: {
    invalidBeatmap: () => BeatsaverCachedLibrary.GetAllInvalid(),
  },
  methods: {
    closeDialog() {
      this.$emit("update:open", false);
    },
  },
});
</script>
