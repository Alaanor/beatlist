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

# Screenshot

<a href="https://raw.githubusercontent.com/Alaanor/beatlist/screenshot/songlist.png">
  <img src="https://raw.githubusercontent.com/Alaanor/beatlist/screenshot/songlist.png" width="33%">
</a>

<a href="https://raw.githubusercontent.com/Alaanor/beatlist/screenshot/playlistEditor1.png">
  <img src="https://raw.githubusercontent.com/Alaanor/beatlist/screenshot/playlistEditor1.png" width="33%">
</a>

<a href="https://raw.githubusercontent.com/Alaanor/beatlist/screenshot/playlistEditor2.png">
  <img src="https://raw.githubusercontent.com/Alaanor/beatlist/screenshot/playlistEditor2.png" width="33%">
</a>

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

Although the license of this project is under [WTFPL](LICENSE.txt), all **my dependency are not**, so please be sure to check them if needed. Tools like [nlf](https://www.npmjs.com/package/nlf) make easy to list the license of each dependencies. If someone know a license that fit all the dependency, just tell me I'd be more than happy to fix it !
