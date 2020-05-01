import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import colors from "vuetify/lib/util/colors";

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: "mdi",
  },
  theme: {
    themes: {
      dark: {
        primary: colors.blue.lighten2,
        secondary: "#AAA",
        accent: colors.blueGrey.lighten2,
        app: "#1e1e1e",
        appSecondary: "#232323",
        close: colors.red.darken3,
      },
      light: {
        primary: colors.blue.base,
        secondary: "#666",
        accent: colors.blueGrey.darken2,
        app: colors.grey.lighten3,
        appSecondary: colors.grey.lighten4,
        close: colors.red.lighten1,
      },
    },
    options: {
      customProperties: true,
    },
  },
});
