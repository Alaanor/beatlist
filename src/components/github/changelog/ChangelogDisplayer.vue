<template>
  <v-container class="py-0">
    <v-layout>
      <v-flex
        v-if="changelogRaw !== '' && !hasErr"
        id="markdown"
        v-html="changelog"
      />
      <v-flex
        v-if="hasErr"
      >
        <v-alert
          text
          type="warning"
          icon="warning"
          class="mt-5"
        >
          <span>Unfortunately, we weren't able to fetch the CHANGELOG.md</span>
          <br>
          <span class="caption">
            You can always check the
            <a
              href="https://github.com/Alaanor/beatlist"
              target="_blank"
              class="warning--text"
            >Github repo</a>.
          </span>
        </v-alert>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import marked from 'marked';
import BeatlistRepo from '@/libraries/net/github/BeatlistRepo';

export default Vue.extend({
  name: 'ChangelogDisplayer',
  data: () => ({
    changelogRaw: '',
    hasErr: false,
  }),
  computed: {
    changelog() {
      return marked(this.changelogRaw, { breaks: true, headerIds: false });
    },
  },
  mounted(): void {
    new BeatlistRepo()
      .GetChangelogContent()
      .then((content) => {
        if (content) {
          this.changelogRaw = content;
          this.hasErr = false;
        } else {
          this.hasErr = true;
        }
      });
  },
});
</script>

<style scoped>
#markdown:first-child {
  margin-top: 0px !important;
}

#markdown >>> h1,
#markdown >>> h2,
#markdown >>> h3,
#markdown >>> h4,
#markdown >>> h5,
#markdown >>> h6 {
  margin-bottom: 15px;
  margin-top: 15px;
}

#markdown >>> p,
#markdown >>> li {
  font-weight: 400;
}

#markdown >>> ul {
  margin-bottom: 15px;
}

#markdown >>> p {
  margin-bottom: 5px;
}
</style>
