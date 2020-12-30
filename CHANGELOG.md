# Changelog

## v1.2.4 (30/12/2020)
**Bug fixes**:
 - Do not remove the playlist thumbnail when adding songs. (#80, #82)

This is the final version of beatlist, and the repo will be archived. See README.MD for more information.

## v1.2.3 (18/12/2020)
**Features:**
 - Handling rate limit (#77)
 - Added a mirror of beatsaver, BeatSaberPlus, available in options (#79)

**Improvement:**
 - If you had a lot of playlist, beatlist could be slow. It should now handle better. (#75)

**Bug fixes**:
 - Download should now work again (#78)

## v1.2.2 (02/09/2020)
**Improvement:**
 - Added a way to display in which playlist(s) a beatmap is the table (#40, #65)
 - Some rephrasing & installation path detection change (#59)
 
**Bug fixes:**
 - Snackbar is now displayed in white when using the white mode
 - & is now whitelisted as character for the folder's name
 - Rewording from "cancel" to "close" (#61)
 
Many thanks to @SWinxy and @SpellcheckerExtraordinaire for their contributions in this release
 
## v1.2.1 (10/06/2020)
**Improvement:**
 - Colorblind mode (difficulties badges can now have a letter or be grey-scaled)
 - All pages are now "keep-alive", so you won't lose your search and filter if you change page.
 - Preview button directly on the row in some tables (#43)
 - Adjust naming convention to match ModAssistant and BeatSaverDownloader (#39)
 - The song preview will now be stopped if you change page
 
## v1.2.0 (18/05/2020)
**Features:**
 - Rework of the whole UI, it now uses table and overall the app is denser.
 - Along with tables, you can now do bulk action such as download all beatmaps from a playlist.
 - There's a little button to preview the music on each beatmap page

**Improvement:**
 - More filter and search possibilities, locally.
 - A better scanner, more efficient and a cache system so you don't spam beatsaver server.
 - New users are welcomed with a message
 - You can now see the reason if a playlist or a beatmap failed to be loaded in beatlist.
 - Option to automatically start the download after opening a one-click install button.
 - Downloader queue

**Bug fixes:**
 - Should now handle bigger scan without white screen.
 - Download should no longer fail after the application being unfocused.
 - One click will no longer be enabled by default at each startup.
 - If an important folder such as playlists or custom level does not exist, beatlist will handle the creation of them.
 - No longer undeletable beatmap.
 - Paginate back to page 1 when changing the query.
 
Any kind of feedback is welcome, don't hesitate to DM me on discord. And yes, 2-4 weeks prediction from the previous release note was a failure oof.

## v1.1.4 (05/01/2020)
**Quick change:**
 - Changed the way beatlist download beatmap on the background to help the beatsaver server.

A quite huge update should come soon (I hope I can do it within 2-4 weeks) with a lot of fixes and improvements. :)

## v1.1.3 (02/12/2019)
**Bug fixes:**
 - Fixed the search bar for online beatmap. Oops.

## v1.1.2 (24/11/2019)
**Features:**
 - Discord Rich Presence added
 - Now support the OneClick button on beatsaver.com
 
**Improvements:**
 - Changed license to MIT
 - Added a button to open the folder in the context of playlist or beatmap.

**Bug fixes:**
 - An invalid character from the folder name resulted to an error
 - Not all song were shown on the playlist editor on the song browser
 - Fixed the clear button on the search bar. It now really clear the input.

## v1.1.1 (16/11/2019)
**Improvements:**
 - Added an button to preview beatmap (external website)
 - Skeleton loader for online playlist page
 - Redirect on settings page if no valid settings available (first time user)
 - The app can now compute beatmap hash on its own
 - Added a discord server for beatlist

**Bug fixes:**
 - Songhashdata.dat is no longer required
 - Fixed various bug in playlists
 - Song are now scanned automatically when you launch the app

## v1.1.0 (06/10/2019)
**Features:**
 - Online beatmap download (beatsaver.com)
 - Online playlist download (bsaber.com)

**Improvements:**
 - Major
   - Automatically detect new beatmap installed
   - Material design 2.0 upgrade, updated the design
   - More information when you click on a beatmap
   - On local song:
     - Sort by Date, Downloads, Plays, Upvotes, Downvotes, Rating
     - Filter by difficulties (#7) and/or bpm.
   
 - Minor:
   - Use of installer instead of executable.
   - Playlist filename are now synced with their title.
   - New default playlist cover image.
   - You can now delete a beatmap.
   - Link in description are now clickable.
   - The local beatmap scanner is now smarter and will only check for the difference.

**Bug fixes:**
 - (#5) Wrong image could be displayed if the user search fast
 - Fixed app icon, it could be badly displayed.
 
<a href="https://www.notion.so/Beatlist-V1-1-848d401722464698a106011a03d359be" target="_blank">See more (include screenshots)</a>

## v1.0.3 (05/07/2019)

**Features:**
 - Playlist list/grid are now clickable

**Fixes:**
 - (#-) Some songs were not displayed in the playlist

## v1.0.2 (03/07/2019)

**Fixes:**
 - (#2) Songs scan: directories path are case sensitive

## v1.0.1 (01/07/2019)

**Fixes:**
 - (#1) Title is not saved when editing a playlist

## v1.0.0 (30/06/2019)

Release of beatlist

**Features:**
 - Manage playlist/songs
 - Scan local song
 - Read old playlist, convert to json, use hash as key
 - Search + Grid/List view layout
 - Settings validation form for installation path
 - UI preference in settings
 - FAQ and Home page

## v0.1.0 (18/06/2019)

Beginning of the project :)
