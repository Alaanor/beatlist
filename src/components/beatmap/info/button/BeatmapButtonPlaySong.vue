<template>
  <div class="d-flex align-center">
    <Tooltip :text="audioTooltip()">
      <v-btn
        icon
        :loading="loading"
        @click="togglePlay()"
      >
        <v-icon v-if="playing">
          pause_circle_outline
        </v-icon>
        <v-icon v-else>
          play_circle_outline
        </v-icon>
      </v-btn>
    </Tooltip>
    <v-expand-x-transition mode="out-in">
      <div
        v-if="playing"
        class="ml-2 text-no-wrap"
      >
        {{ currentTime }} on {{ totalTime }}
      </div>
    </v-expand-x-transition>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { BeatsaverBeatmap } from '@/libraries/net/beatsaver/BeatsaverBeatmap';
import Tooltip from '@/components/helper/Tooltip.vue';
import BeatmapLibrary from '@/libraries/beatmap/BeatmapLibrary';
import { BeatmapLocal } from '@/libraries/beatmap/BeatmapLocal';
import BeatmapLocalUtilities from '@/libraries/beatmap/BeatmapLocalUtilities';

export default Vue.extend({
  name: 'BeatmapButtonPlaySong',
  components: { Tooltip },
  props: {
    beatmap: { type: Object as PropType<BeatsaverBeatmap>, required: true },
  },
  data: () => ({
    audio: new Audio(),
    currentSeconds: 0,
    totalSeconds: 0,
    loading: false,
    playing: false,
  }),
  computed: {
    beatmapLocal(): BeatmapLocal | undefined {
      return BeatmapLibrary.GetMapByHash(this.beatmap.hash);
    },
    currentTime(): string {
      return this.convertTimeHHMMSS(this.currentSeconds);
    },
    totalTime(): string {
      return this.convertTimeHHMMSS(this.totalSeconds);
    },
  },
  methods: {
    async LoadAudioSrc(): Promise<void> {
      this.loading = true;

      if (this.beatmapLocal) {
        return BeatmapLocalUtilities
          .GetAudioSrcBase64(this.beatmapLocal)
          .then((data: string) => {
            this.audio.src = data;
            this.setupAudioPlayer();
          });
      }

      return undefined;
    },
    setupAudioPlayer() {
      this.audio.addEventListener('timeupdate', () => {
        this.currentSeconds = Math.ceil(this.audio.currentTime);
      });

      this.audio.addEventListener('pause', () => {
        this.playing = false;
      });

      this.audio.addEventListener('play', () => {
        this.playing = true;
      });

      this.audio.addEventListener('loadeddata', () => {
        this.loading = false;
        this.totalSeconds = Math.ceil(this.audio.duration);
      });
    },
    togglePlay(): void {
      if (!this.audio.src) {
        this.LoadAudioSrc()
          .then(() => {
            this.togglePlay();
          });
      } else if (this.audio.paused) {
        this.audio.play();
      } else {
        this.audio.pause();
        this.audio.currentTime = 0;
      }
    },
    audioTooltip(): string {
      return !this.playing ? 'Play the song' : 'Stop the song';
    },
    convertTimeHHMMSS(val: number): string {
      const time = new Date(val * 1000).toISOString().substr(11, 8);
      return time.indexOf('00:') === 0 ? time.substr(3) : time;
    },
  },
});
</script>

<style scoped>

</style>
