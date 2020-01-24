import Vue from 'vue';
import VueRouter from 'vue-router';
import store from './store';

import Settings from '@/pages/settings';
import Home from '@/pages/home';
import Downloads from '@/pages/downloads/';
import Beatmap, {
  BeatmapLocal, BeatmapLocalUnit,
  BeatmapOnline, BeatmapOnlineUnit,
} from '@/pages/beatmap';

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/beatmaps',
      name: 'beatmaps',
      redirect: { name: 'beatmaps-local' },
      component: Beatmap,
      meta: {
        subNav: [
          {
            name: 'Local',
            path: { name: 'beatmaps-local' },
            icon: 'computer',
          },
          {
            name: 'Online',
            path: { name: 'beatmaps-online' },
            icon: 'language',
          },
        ],
      },
      children: [
        {
          path: 'local',
          name: 'beatmaps-local',
          component: BeatmapLocal,
        },
        {
          path: 'local/:key',
          name: 'beatmaps-local-unit',
          component: BeatmapLocalUnit,
        },
        {
          path: 'online',
          name: 'beatmaps-online',
          component: BeatmapOnline,
        },
        {
          path: 'online/:key',
          name: 'beatmaps-online-unit',
          component: BeatmapOnlineUnit,
        },
      ],
    },
    {
      path: '/downloads',
      name: 'downloads',
      component: Downloads,
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings,
    },
    { path: '*', redirect: '/' },
  ],
});

router.beforeEach(async (to, from, next) => {
  // wait for the vuex-persist to be ready, restored exists but isn't defined.
  // @ts-ignore
  await store.restored.then();

  const subNav = to.matched
    .find((record) => record.meta.subNav)
    ?.meta.subNav ?? [];

  store.commit('appState/SET_SUB_NAV', subNav);

  next();
});

export default router;
