import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import colors from 'vuetify/lib/util/colors';

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'mdi',
  },
  theme: {
    themes: {
      dark: {
        primary: colors.blue.lighten2,
        secondary: '#AAA',
        accent: colors.blueGrey.lighten2,
        app: '#353535',
        close: colors.red.darken3,
      },
      light: {
        primary: colors.blue.base,
        secondary: '#666',
        accent: colors.blueGrey.darken2,
        app: colors.grey.lighten3,
        close: colors.red.lighten1,
      },
    },
  },
});
