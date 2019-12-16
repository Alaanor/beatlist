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
        primary: '#353535',
        accent: colors.green.accent2,
        close: colors.red.darken3,
        link: colors.blue.darken1,
      },
      light: {
        primary: colors.grey.lighten3,
        accent: colors.green.accent4,
        close: colors.red.lighten1,
        link: colors.blue.darken2,
      },
    },
  },
});
