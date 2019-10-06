<p align="center">
  <img src="src/assets/title_white.png" width="256px" alt="logo">
</p>
<p align="center">
  <img src="https://img.shields.io/github/release/Alaanor/beatlist.svg?style=flat-square" alt="version">
  <img src="https://img.shields.io/github/downloads/Alaanor/beatlist/total.svg?color=#3fb911?style=flat-square" alt="download count">
</p>

# Beatlist

Beatlist is an electron app to create and manage playlist for the game BeatSaber.

# Feature

 - Create, edit, delete playlist.
 - Songs browser: ability to add and remove song to a playlist.
 - Should be compatible wherever you created your playlist.
 - Song are scanned from your BeatSaber installation path. I do not fetch for song online (yet?)
 
# Installation

1. [Download](https://github.com/Alaanor/beatlist/releases) and execute the latest version.
2. Insert manually or use the detector to set the **installation path** of BeatSaber in **settings**
3. **Scan** your songs library in settings through the scan button.
4. Enjoy !

# Screenshots

<a href="https://raw.githubusercontent.com/Alaanor/beatlist/screenshot/songlist.png">
  <img src="https://raw.githubusercontent.com/Alaanor/beatlist/screenshot/v1_0/songlist.png" width="33%">
</a>

<a href="https://raw.githubusercontent.com/Alaanor/beatlist/screenshot/playlistEditor1.png">
  <img src="https://raw.githubusercontent.com/Alaanor/beatlist/screenshot/v1_0/playlistEditor1.png" width="33%">
</a>

<a href="https://raw.githubusercontent.com/Alaanor/beatlist/screenshot/playlistEditor2.png">
  <img src="https://raw.githubusercontent.com/Alaanor/beatlist/screenshot/v1_0/playlistEditor2.png" width="33%">
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
npm run electron:serve
```

It use [Vuetify](https://vuetifyjs.com/) for the UI and [Pathify](https://github.com/davestewart/vuex-pathify) to simplify vuex. If you got any question, feel free to hit me up.

# Contact

You can reach me through discord: [Alaanor#9999](https://discordapp.com/users/213397906571395072)

# Licence

This project is licensed under [WTFPL](LICENSE).
