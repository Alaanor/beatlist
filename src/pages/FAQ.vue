<!--suppress ALL -->
<template>
  <v-container>
    <h1>Frequently asked questions</h1>
    <br>
    <v-expansion-panel popout focusable>
      <v-expansion-panel-content v-for="item in items">
        <template v-slot:header>
          <div>{{item.question}}</div>
        </template>
        <v-card>
          <v-card-text v-html="item.answer"></v-card-text>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
    <br>
    <v-layout align-center>
      <v-flex>
        <div class="text-xs-center">
          <v-chip style="cursor: pointer" @click="openLink('https://discordapp.com/users/213397906571395072')">
            <v-avatar>
              <img src="https://cdn.discordapp.com/avatars/213397906571395072/a_8c702d715ac7a908e6d428dc26923473.png?size=128" alt="trevor">
            </v-avatar>
            Alaanor#9999
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
          answer: 'This app has preliminary been developed to create playlists based on the local songs you already ' +
            'have',
        },
        {
          question: 'but wher can i get moar songe ?',
          answer: 'just use the ig downloader smh',
        },
        {
          question: 'Some song couldn\'t\'ve been imported, why ?',
          answer: 'Custom map or old song that aren\'t on beatsaver are excluded.<br>' +
            'Duplicate map are also excluded.<br>' +
            'This is to prevent unexpected error when dealing with songs that have missing information.',
        },
        {
          question: 'I\'ve found a bug ! What can I do ?',
          answer: 'If you\'re a developer, please create an issue with the steps to reproduce the bug. You can also access ' +
            'the inspector/console through ctrl+shift+i<br>' +
            'If you\'re a user, try to find the steps to reproduce the error and please dm me on discord: ' +
            '<strong>Alaanor#9999</strong>. So we can try to fix it together :)',
        },
        {
          question: 'Feature X is missing, please implement it',
          answer: 'Well maybe ? Dm me on discord so we can discuss if that would be an awesome feature to implement ! ' +
            'Discord: <strong>Alaanor#9999</strong><br>' +
            'If you\'re a developper, I\'ll gladly accept your pull request !',
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
