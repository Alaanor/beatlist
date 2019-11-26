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
};
