<template>
  <v-container class="centerPage">
    <v-row class="fill-height">
      <v-col cols="12">
        <div class="d-flex justify-center align-center flex-column fill-height">
          <v-progress-circular
            :size="100"
            :width="6"
            color="grey darken-2"
            indeterminate
          />
          <slot/>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'LoadingPage',
});
</script>

<style scoped>
.centerPage {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
