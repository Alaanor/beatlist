<template>
  <v-container>
    <component
      :is="`NotificationModel${notification.type}`"
      v-for="(notification, key) in toNotify"
      :key="key"
      :notification="notification"
    />
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import NotificationLibrary from '@/libraries/notification/NotificationLibrary';
import NotificationModelMessage from '@/components/notification/NotificationModelMessage.vue';
import NotificationModelBeatmapDownload from '@/components/notification/NotificationModelBeatmapDownload.vue';

export default Vue.extend({
  name: 'NotificationService',
  components: { NotificationModelMessage, NotificationModelBeatmapDownload },
  computed: {
    toNotify: () => NotificationLibrary.GetAllUnnotified(),
  },
});
</script>

<style scoped>

</style>
