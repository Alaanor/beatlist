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
        accent: colors.blueGrey.lighten2,
        close: colors.red.darken3,
      },
      light: {
        primary: colors.grey.lighten3,
        accent: colors.blueGrey.darken2,
        close: colors.red.lighten1,
      },
    },
  },
});
