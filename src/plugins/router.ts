import Vue from 'vue';
import VueRouter from 'vue-router';
import SongListLocal from './pages/SongListLocal.vue';
import SongListOnline from './pages/SongListOnline.vue';
import PlaylistsLocal from './pages/PlaylistsLocal.vue';
import PlaylistsOnline from './pages/PlaylistsOnline.vue';
import PlaylistEditor from './pages/PlaylistEditor.vue';
import Settings from './pages/Settings.vue';
import Home from './pages/Home.vue';
import FAQ from './pages/FAQ.vue';
import store from '../store/store';

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/songs/local',
      name: 'song-list-local',
      component: SongListLocal,
      meta: {requireValidSettings: true},
    },
    {
      path: '/songs/online',
      name: 'song-list-online',
      component: SongListOnline,
      meta: {requireValidSettings: true},
    },
    {
      path: '/playlists/online',
      name: 'playlists-online',
      component: PlaylistsOnline,
      meta: {requireValidSettings: true},
    },
    {
      path: '/playlists/local',
      name: 'playlists-local',
      component: PlaylistsLocal,
      meta: {requireValidSettings: true},
    },
    {
      path: '/playlist/local/edit/:hash',
      name: 'playlist-editor',
      component: PlaylistEditor,
      meta: {requireValidSettings: true},
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings,
    },
    {
      path: '/faq',
      name: 'faq',
      component: FAQ,
    },
    {path: '*', redirect: '/'},
  ],
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requireValidSettings)) {
    const st = store as unknown as { get: (path: string) => boolean };
    if (!st.get('settings/configValid')) {
      next();
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
