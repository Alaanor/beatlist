import Vue from "vue";
import VueRouter from "vue-router";
import Settings from "@/pages/settings";
import Home from "@/pages/home";
import Downloads from "@/pages/downloads/";
import Beatmap, {
  BeatmapLocal,
  BeatmapLocalUnit,
  BeatmapOnline,
  BeatmapOnlineUnit,
} from "@/pages/beatmap";
import Playlists, {
  PlaylistsLocal,
  PlaylistsLocalUnit,
  PlaylistsBsaber,
} from "@/pages/playlists";
import route from "@/plugins/route/route";
import store from "./store";

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    {
      path: "/",
      name: route.HOME,
      component: Home,
    },
    {
      path: "/beatmaps",
      name: route.BEATMAPS,
      redirect: { name: "beatmaps-local" },
      component: Beatmap,
      meta: {
        subNav: [
          {
            name: "Local",
            path: { name: "beatmaps-local" },
            icon: "computer",
          },
          {
            name: "Online - Beatsaver",
            path: { name: "beatmaps-online" },
            icon: "language",
          },
        ],
      },
      children: [
        {
          path: "local",
          name: route.BEATMAPS_LOCAL,
          component: BeatmapLocal,
        },
        {
          path: "local/:hash",
          name: route.BEATMAPS_LOCAL_UNIT,
          component: BeatmapLocalUnit,
        },
        {
          path: "online",
          name: route.BEATMAPS_ONLINE,
          component: BeatmapOnline,
        },
        {
          path: "online/:hash",
          name: route.BEATMAPS_ONLINE_UNIT,
          component: BeatmapOnlineUnit,
        },
      ],
    },
    {
      path: "/playlists",
      name: "playlists",
      redirect: { name: "playlists-local" },
      component: Playlists,
      meta: {
        subNav: [
          {
            name: "Local",
            path: { name: "playlists-local" },
            icon: "computer",
          },
          {
            name: "Online - BSaber.com",
            path: { name: "playlists-bsaber" },
            icon: "language",
          },
        ],
      },
      children: [
        {
          path: "local",
          name: route.PLAYLISTS_LOCAL,
          component: PlaylistsLocal,
        },
        {
          path: "local/:hash",
          name: route.PLAYLISTS_LOCAL_UNIT,
          component: PlaylistsLocalUnit,
        },
        {
          path: "bsaber",
          name: route.PLAYLISTS_BSABER,
          component: PlaylistsBsaber,
        },
      ],
    },
    {
      path: "/downloads",
      name: route.DOWNLOADS,
      component: Downloads,
    },
    {
      path: "/settings",
      name: route.SETTINGS,
      component: Settings,
    },
    { path: "*", redirect: "/" },
  ],
});

router.beforeEach(async (to, from, next) => {
  await store.restored;

  const subNav =
    to.matched.find((record) => record.meta.subNav)?.meta.subNav ?? [];

  store.commit("appState/SET_SUB_NAV", subNav);

  next();
});

export default router;
