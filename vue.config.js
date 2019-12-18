const path = require('path');

module.exports = {
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        appId: 'com.alaanor.beatlist',
        win: {
          target: 'nsis',
          icon: './public/icon.ico',
        },
      },
    },
  },
  configureWebpack: {
    resolve: {
      alias: {
        src: path.resolve(__dirname, 'src'),
      },
    },
  },
};
