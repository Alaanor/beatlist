<p align="center">
  <a href="https://github.com/Alaanor/beatlist/releases/latest">
    <img src="src/assets/title_white.png" width="256px" alt="logo">
  </a>
</p>
<p align="center">
  <img src="https://img.shields.io/github/release/Alaanor/beatlist.svg?style=flat-square" alt="version">
  <img src="https://img.shields.io/github/downloads/Alaanor/beatlist/total.svg?color=#3fb911?style=flat-square" alt="download count">
</p>

# Beatlist

Beatlist is an app that manages playlists and beatmaps for the game Beat Saber.

# Feature

 - Create, edit, delete playlists.
 - Download beatmaps and playlists from the community.
 - Manage your local beatmaps library.
 - One click install
 
# Requirement

- **Beat Saber** on **Windows**. _This is not for quest user and there's no plan to support it at the moment._
- You might need [rithik-b/PlaylistLoaderPlugin](https://github.com/rithik-b/PlaylistLoaderPlugin). So you can load playlists in game.
  - This plugin is on **ModAssistant**, it's called **PlaylistLoaderLite**.

# Installation

1. [Download](https://github.com/Alaanor/beatlist/releases/latest) and execute the latest version.
2. Insert manually or use the detector to set the **installation path** of Beat Saber in **settings**
3. **Scan** your beatmaps/playlists library in settings through the scan button.
4. Enjoy !

# Screenshots

<a href="https://raw.githubusercontent.com/Alaanor/beatlist/screenshot/v1_2/beatmapLocal.png">
  <img src="https://raw.githubusercontent.com/Alaanor/beatlist/screenshot/v1_2/beatmapLocal.png" width="48%">
</a>

<a href="https://raw.githubusercontent.com/Alaanor/beatlist/screenshot/v1_2/beatmapPage.png">
  <img src="https://raw.githubusercontent.com/Alaanor/beatlist/screenshot/v1_2/beatmapPage.png" width="48%">
</a>

<a href="https://raw.githubusercontent.com/Alaanor/beatlist/screenshot/v1_2/beastsaberPlaylists.png">
  <img src="https://raw.githubusercontent.com/Alaanor/beatlist/screenshot/v1_2/beastsaberPlaylists.png" width="48%">
</a>

<a href="https://raw.githubusercontent.com/Alaanor/beatlist/screenshot/v1_2/beatsaverOnline.png">
  <img src="https://raw.githubusercontent.com/Alaanor/beatlist/screenshot/v1_2/beatsaverOnline.png" width="48%">
</a>

<a href="https://raw.githubusercontent.com/Alaanor/beatlist/screenshot/v1_2/localPlaylist.png">
  <img src="https://raw.githubusercontent.com/Alaanor/beatlist/screenshot/v1_2/localPlaylist.png" width="48%">
</a>

<a href="https://raw.githubusercontent.com/Alaanor/beatlist/screenshot/v1_2/editingPlaylist.png">
  <img src="https://raw.githubusercontent.com/Alaanor/beatlist/screenshot/v1_2/editingPlaylist.png" width="48%">
</a>

# Changelog

See [CHANGELOG.md](CHANGELOG.md) for the details of each release.

# Contributing

I'd be more than happy to accept a pull request !

## Setting up the development environment

```bash
# Clone the project
git clone https://github.com/Alaanor/beatlist.git
cd beatlist

# Install dependencies
npm install

# Run the electron app
npm run serve
```

It use [Vuetify](https://vuetifyjs.com/) for the UI and [Pathify](https://github.com/davestewart/vuex-pathify) to simplify vuex. If you got any question, feel free to hit me up.

# Contact

You can reach me through discord: [Alaanor#9999](https://discordapp.com/users/213397906571395072)

# Licence

This project is licensed under [MIT](LICENSE).
