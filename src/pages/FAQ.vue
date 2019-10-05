<!--suppress ALL -->
<template>
  <v-container>
    <p class="display-2">Frequently asked questions</p>
    <br>
    <v-expansion-panels popout>
      <v-expansion-panel v-for="item in items">
        <v-expansion-panel-header>{{item.question}}</v-expansion-panel-header>
        <v-expansion-panel-content>
          <span v-html="item.answer"></span>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <br>
    <v-layout align-center>
      <v-flex>
        <div class="text-center">
          <v-chip style="cursor: pointer" @click="openLink('https://discordapp.com/users/213397906571395072')">
            <v-avatar left>
              <img src="https://cdn.discordapp.com/avatars/213397906571395072/a_dcae5045fba3fffee46a967ce187b609.webp?size=128"
                   alt="trevor">
            </v-avatar>
            Alaanor<span class="grey--text">#9999</span>
          </v-chip>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import Vue from 'vue';
  import {shell} from 'electron';

  export default Vue.extend({
    name: 'faq',
    data: () => ({
      items: [
        {
          question: 'What is the purpose of this app ?',
          answer: 'This app has preliminary been developed to create playlists based on the local songs you already \
            have',
        },
        {
          question: 'Some song couldn\'t\'ve been imported, why ?',
          answer: 'Custom map or old song that aren\'t on beatsaver are excluded.<br>\
            Duplicate map are also excluded.<br>\
            This is to prevent unexpected error when dealing with songs that have missing information.',
        },
        {
          question: 'Some online feature are not loading.',
          answer: `Either one of them changed their API or their API service is down.<br>\
            In the first case check you can reach me on discord to notify me, who know, I may not know that is broken !<br>\
            In the second case, a little of patience should solve it. :)`,
        },
        {
          question: 'I\'ve found a bug ! What can I do ?',
          answer: 'If you\'re a developer, please create an issue with the steps to reproduce the bug. You can also access \
            the inspector/console through ctrl+shift+i<br>\
            If you\'re a user, try to find the steps to reproduce the error and please dm me on discord: \
            <strong>Alaanor#9999</strong>. So we can try to fix it together :)',
        },
        {
          question: 'Feature X is missing, please implement it',
          answer: 'Well maybe ? Dm me on discord so we can discuss if that would be an awesome feature to implement ! \
            Discord: <strong>Alaanor#9999</strong><br>\
            If you\'re a developper, I\'ll gladly accept your pull request !',
        },
      ],
    }),
    methods: {
      openLink(link) {
        shell.openExternal(link);
      },
    },
  });
</script>
