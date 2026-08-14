<template>
  <div class="podcast-page">
    <CTopbar
      title="🎧 Podcast"
      back-label="English"
      @go-home="handleBack"
    />

    <div class="podcast-container">
      <!-- YouTube Tab -->
      <div class="yt-section">
        <div class="yt-header">
          <h2>📺 YouTube Podcasts</h2>
          <button class="add-yt-btn" @click="showAddYtModal = true">+ Thêm YouTube</button>
        </div>

        <!-- YouTube List -->
        <div class="yt-grid">
          <div
            v-for="(yt, index) in youtubeList"
            :key="index"
            class="yt-card"
            :class="{ active: currentYtIndex === index }"
            @click="selectYt(yt, index)"
          >
            <div class="yt-thumb">
              <img v-if="yt.thumb" :src="yt.thumb" :alt="yt.title" />
              <span v-else class="yt-icon">📺</span>
              <span class="yt-duration" v-if="yt.duration">{{ yt.duration }}</span>
            </div>
            <div class="yt-info">
              <span class="yt-title">{{ yt.title }}</span>
              <span class="yt-channel">{{ yt.channel }}</span>
            </div>
          </div>
        </div>

        <!-- YouTube Player -->
        <div class="yt-player-wrapper" v-if="currentYt">
          <div class="yt-player-card">
            <div class="now-playing-header">
              <span class="np-icon">🔊</span>
              <span>Now Playing</span>
            </div>
            <h3>{{ currentYt.title }}</h3>
            <p class="yt-channel-name">{{ currentYt.channel }}</p>
            
            <!-- Audio Visualizer (decorative) -->
            <div class="audio-viz">
              <span v-for="i in 20" :key="i" class="viz-bar" :style="{ animationDelay: (i * 0.05) + 's' }"></span>
            </div>

            <!-- Open YouTube -->
            <div class="yt-controls">
              <a :href="`https://youtu.be/${currentYt.videoId}`" target="_blank" class="yt-open-btn">
                ▶ Mở YouTube để nghe
              </a>
            </div>
            <p class="yt-tip">Video sẽ mở trong tab mới. Tắt hình ảnh hoặc thu nhỏ cửa sổ để chỉ nghe.</p>
          </div>
        </div>

        <div v-else class="yt-empty">
          <p>Chọn một video để bắt đầu nghe podcast tiếng Anh</p>
        </div>
      </div>

      <!-- Audio Tab -->
      <div class="audio-section">
        <div class="audio-header">
          <h2>🎵 Audio MP3</h2>
          <button class="add-audio-btn" @click="showAddAudioModal = true">+ Thêm Audio</button>
        </div>

        <div class="audio-list">
          <div
            v-for="(podcast, index) in podcasts"
            :key="index"
            class="audio-item"
            :class="{ active: currentAudioIndex === index }"
            @click="selectAudio(index)"
          >
            <span class="audio-icon">🎙️</span>
            <div class="audio-info">
              <span class="audio-title">{{ podcast.title }}</span>
              <span class="audio-author">{{ podcast.author }}</span>
            </div>
            <span class="audio-duration">{{ podcast.duration }}</span>
          </div>
        </div>

        <!-- Audio Player -->
        <div v-if="currentAudio" class="audio-player-card">
          <div class="player-art">
            <span class="art-icon">🎧</span>
          </div>
          <h3 class="player-title">{{ currentAudio.title }}</h3>
          <p class="player-author">{{ currentAudio.author }}</p>

          <div class="progress-bar" @click="seek($event)">
            <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
          </div>
          <div class="time-display">
            <span>{{ formatTime(currentTime) }}</span>
            <span>{{ formatTime(duration) }}</span>
          </div>

          <div class="player-controls">
            <button class="ctrl-btn" @click="skipBack">
              <span>-15s</span>
            </button>
            <button class="ctrl-btn play-btn" @click="togglePlay">
              {{ isPlaying ? '⏸' : '▶' }}
            </button>
            <button class="ctrl-btn" @click="skipForward">
              <span>+15s</span>
            </button>
          </div>

          <div class="speed-control">
            <span>Tốc độ:</span>
            <button
              v-for="s in speeds"
              :key="s"
              :class="{ active: playbackRate === s }"
              @click="setSpeed(s)"
            >
              {{ s }}x
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add YouTube Modal -->
    <CModal v-if="showAddYtModal" @close="showAddYtModal = false">
      <template #header>
        <h3>Thêm YouTube Podcast</h3>
      </template>
      <template #body>
        <p class="modal-hint">Dán URL hoặc Video ID từ YouTube</p>
        <input
          v-model="newYtUrl"
          type="text"
          placeholder="https://youtube.com/watch?v=... hoặc video ID"
          class="url-input"
        />
        <input
          v-model="newYtTitle"
          type="text"
          placeholder="Tên podcast"
          class="url-input"
        />
        <input
          v-model="newYtChannel"
          type="text"
          placeholder="Kênh (VD: BBC Learning English)"
          class="url-input"
        />
      </template>
      <template #footer>
        <CButton @click="addYouTube">Thêm</CButton>
        <CButton variant="secondary" @click="showAddYtModal = false">Hủy</CButton>
      </template>
    </CModal>

    <!-- Add Audio Modal -->
    <CModal v-if="showAddAudioModal" @close="showAddAudioModal = false">
      <template #header>
        <h3>Thêm Audio MP3</h3>
      </template>
      <template #body>
        <input
          v-model="newAudioUrl"
          type="url"
          placeholder="https://example.com/podcast.mp3"
          class="url-input"
        />
        <input
          v-model="newAudioTitle"
          type="text"
          placeholder="Tên podcast"
          class="url-input"
        />
      </template>
      <template #footer>
        <CButton @click="addAudio">Thêm</CButton>
        <CButton variant="secondary" @click="showAddAudioModal = false">Hủy</CButton>
      </template>
    </CModal>
  </div>
</template>

<script>
import { navigate } from '../utils/navigate.js';
import CTopbar from '../components/CTopbar.vue';
import CModal from '../components/CModal.vue';
import CButton from '../components/CButton.vue';

function extractYtId(input) {
  if (!input) return null;
  const patterns = [
    /youtu\.be\/([^?&]+)/,
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtube\.com\/embed\/([^?&]+)/,
    /^([a-zA-Z0-9_-]{11})$/
  ];
  for (const p of patterns) {
    const m = input.match(p);
    if (m) return m[1];
  }
  return null;
}

export default {
  name: 'PodcastPage',
  components: { CTopbar, CModal, CButton },
  data() {
    return {
      // YouTube
      youtubeList: [
        {
          title: '6 Minute English - Public speaking',
          channel: 'BBC Learning English',
          videoId: 'q3n-DM6JLIY',
          thumb: 'https://img.youtube.com/vi/q3n-DM6JLIY/mqdefault.jpg',
          duration: '6:00'
        },
        {
          title: '6 Minute English - Saving the world',
          channel: 'BBC Learning English',
          videoId: 'KjCMfLnrWuo',
          thumb: 'https://img.youtube.com/vi/KjCMfLnrWuo/mqdefault.jpg',
          duration: '6:00'
        },
        {
          title: '6 Minute English - Loneliness',
          channel: 'BBC Learning English',
          videoId: 'V3vD61z9pMk',
          thumb: 'https://img.youtube.com/vi/V3vD61z9pMk/mqdefault.jpg',
          duration: '6:00'
        },
        {
          title: 'BBC Learning English - Words in the News',
          channel: 'BBC Learning English',
          videoId: 'XJrnZRJgx8U',
          thumb: 'https://img.youtube.com/vi/XJrnZRJgx8U/mqdefault.jpg',
          duration: '6:00'
        },
        {
          title: 'BBC English Masterclass',
          channel: 'BBC Learning English',
          videoId: '8JtF1Q5tn0o',
          thumb: 'https://img.youtube.com/vi/8JtF1Q5tn0o/mqdefault.jpg',
          duration: '15:00'
        },
      ],
      currentYtIndex: -1,

      // Audio MP3
      podcasts: [
        { title: 'ESL Pod (Demo)', author: 'ESL Pod', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', duration: '~6:00' },
        { title: 'BBC 6 Minute English', author: 'BBC Learning English', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', duration: '~7:00' },
        { title: 'VOA Learning English', author: 'VOA', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', duration: '~5:00' },
      ],
      currentAudioIndex: -1,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      playbackRate: 1,
      speeds: [0.5, 0.75, 1, 1.25, 1.5, 2],

      // Modals
      showAddYtModal: false,
      showAddAudioModal: false,

      // New items
      newYtUrl: '',
      newYtTitle: '',
      newYtChannel: '',
      newAudioUrl: '',
      newAudioTitle: '',

      audio: null,
    };
  },
  computed: {
    currentAudio() {
      return this.currentAudioIndex >= 0 ? this.podcasts[this.currentAudioIndex] : null;
    },
    currentYt() {
      return this.currentYtIndex >= 0 ? this.youtubeList[this.currentYtIndex] : null;
    },
    progressPercent() {
      return this.duration > 0 ? (this.currentTime / this.duration) * 100 : 0;
    },
  },
  methods: {
    handleBack() {
      navigate('/english-hub');
    },

    // YouTube
    selectYt(yt, index) {
      this.currentYtIndex = index;
      if (this.currentAudio) {
        this.pauseAudio();
      }
    },
    addYouTube() {
      const videoId = extractYtId(this.newYtUrl);
      if (!videoId) {
        alert('Không tìm thấy Video ID. Kiểm tra lại URL.');
        return;
      }
      this.youtubeList.push({
        title: this.newYtTitle || 'YouTube Podcast',
        channel: this.newYtChannel || 'Custom',
        videoId: videoId,
        thumb: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
        duration: ''
      });
      this.newYtUrl = '';
      this.newYtTitle = '';
      this.newYtChannel = '';
      this.showAddYtModal = false;
    },

    // Audio
    selectAudio(index) {
      this.currentAudioIndex = index;
      this.currentYtIndex = -1;
      this.playAudio();
    },
    playAudio() {
      if (!this.currentAudio?.url) {
        alert('Podcast này chưa có URL. Vui lòng thêm URL.');
        return;
      }
      
      if (this.audio) {
        this.audio.pause();
      }
      
      this.audio = new Audio(this.currentAudio.url);
      this.audio.playbackRate = this.playbackRate;
      
      this.audio.addEventListener('timeupdate', () => {
        this.currentTime = this.audio.currentTime;
      });
      
      this.audio.addEventListener('loadedmetadata', () => {
        this.duration = this.audio.duration;
      });
      
      this.audio.addEventListener('ended', () => {
        this.isPlaying = false;
      });
      
      this.audio.play();
      this.isPlaying = true;
    },
    pauseAudio() {
      if (this.audio) {
        this.audio.pause();
        this.isPlaying = false;
      }
    },
    togglePlay() {
      if (!this.audio) return;
      if (this.isPlaying) {
        this.audio.pause();
      } else {
        this.audio.play();
      }
      this.isPlaying = !this.isPlaying;
    },
    seek(event) {
      if (!this.audio || !this.duration) return;
      const rect = event.target.getBoundingClientRect();
      const percent = (event.clientX - rect.left) / rect.width;
      this.audio.currentTime = percent * this.duration;
    },
    skipBack() {
      if (this.audio) {
        this.audio.currentTime = Math.max(0, this.audio.currentTime - 15);
      }
    },
    skipForward() {
      if (this.audio) {
        this.audio.currentTime = Math.min(this.duration, this.audio.currentTime + 15);
      }
    },
    setSpeed(speed) {
      this.playbackRate = speed;
      if (this.audio) {
        this.audio.playbackRate = speed;
      }
    },
    formatTime(seconds) {
      if (!seconds || isNaN(seconds)) return '0:00';
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    },
    addAudio() {
      if (this.newAudioUrl && this.newAudioTitle) {
        this.podcasts.push({
          title: this.newAudioTitle,
          author: 'Custom',
          url: this.newAudioUrl,
          duration: '?:??',
        });
        this.newAudioUrl = '';
        this.newAudioTitle = '';
        this.showAddAudioModal = false;
      }
    },
  },
  beforeUnmount() {
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }
  },
};
</script>

<style scoped>
.podcast-page {
  background: var(--forge-bg);
  min-height: 100vh;
  padding: 1rem;
}

.podcast-container {
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* YouTube Section */
.yt-section {
  background: var(--forge-card);
  border-radius: 16px;
  padding: 1.5rem;
}

.yt-header, .audio-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.yt-header h2, .audio-header h2 {
  font-size: 1.1rem;
  margin: 0;
  color: var(--forge-text);
}

.add-yt-btn, .add-audio-btn {
  background: var(--forge-accent);
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  color: white;
  font-size: 0.85rem;
  cursor: pointer;
  transition: opacity 0.2s;
}

.add-yt-btn:hover, .add-audio-btn:hover {
  opacity: 0.85;
}

.yt-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.yt-card {
  background: var(--forge-surface);
  border: 1px solid var(--forge-border);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
}

.yt-card:hover {
  border-color: var(--forge-accent);
  transform: translateY(-2px);
}

.yt-card.active {
  border-color: var(--forge-accent);
  box-shadow: 0 0 20px rgba(249, 115, 22, 0.2);
}

.yt-thumb {
  position: relative;
  width: 100%;
  height: 160px;
  background: #1a1a2e;
  display: flex;
  align-items: center;
  justify-content: center;
}

.yt-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.yt-icon {
  font-size: 3rem;
}

.yt-duration {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0,0,0,0.8);
  color: white;
  font-size: 0.75rem;
  padding: 2px 6px;
  border-radius: 4px;
}

.yt-info {
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.yt-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--forge-text);
  line-height: 1.3;
}

.yt-channel {
  font-size: 0.75rem;
  color: var(--forge-text3);
}

.yt-player-wrapper {
  margin-top: 1rem;
}

.yt-player-card {
  background: var(--forge-surface);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
}

.yt-player-card h3 {
  margin: 0 0 0.25rem;
  font-size: 1.1rem;
}

.yt-channel-name {
  color: var(--forge-text3);
  margin: 0 0 1rem;
  font-size: 0.85rem;
}

.yt-embed {
  position: relative;
  width: 100%;
  max-width: 640px;
  margin: 0 auto 1rem;
  padding-bottom: 56.25%;
  border-radius: 12px;
  overflow: hidden;
}

.yt-embed iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.yt-controls {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1rem;
}

.yt-open-btn {
  display: inline-block;
  background: #ff0000;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.2s;
}

.yt-open-btn:hover {
  background: #cc0000;
  transform: scale(1.05);
}

.yt-tip {
  font-size: 0.8rem;
  color: var(--forge-text3);
  margin: 0.5rem 0 0;
  text-align: center;
}

.now-playing-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
  font-size: 0.85rem;
  color: var(--forge-accent);
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.np-icon {
  font-size: 1.5rem;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.audio-viz {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 4px;
  height: 60px;
  margin: 1.5rem 0;
}

.viz-bar {
  width: 6px;
  background: linear-gradient(to top, var(--forge-accent), var(--forge-accent2));
  border-radius: 3px;
  animation: equalizer 0.8s ease-in-out infinite alternate;
}

@keyframes equalizer {
  0% { height: 10px; }
  100% { height: 50px; }
}

.yt-empty {
  text-align: center;
  padding: 3rem;
  color: var(--forge-text3);
}

/* Audio Section */
.audio-section {
  background: var(--forge-card);
  border-radius: 16px;
  padding: 1.5rem;
}

.audio-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.audio-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  background: var(--forge-surface);
  border: 1px solid transparent;
}

.audio-item:hover {
  background: var(--forge-hover);
  border-color: var(--forge-border);
}

.audio-item.active {
  border-color: var(--forge-accent);
  background: rgba(249, 115, 22, 0.1);
}

.audio-icon {
  font-size: 1.5rem;
}

.audio-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.audio-title {
  font-weight: 500;
  font-size: 0.9rem;
  color: var(--forge-text);
}

.audio-author {
  font-size: 0.75rem;
  color: var(--forge-text3);
}

.audio-duration {
  font-size: 0.8rem;
  color: var(--forge-text3);
}

.audio-player-card {
  background: var(--forge-surface);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
}

.player-art {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, var(--forge-accent), var(--forge-accent2));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}

.art-icon {
  font-size: 2.5rem;
}

.player-title {
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
}

.player-author {
  color: var(--forge-text3);
  font-size: 0.85rem;
  margin-bottom: 1rem;
}

.progress-bar {
  height: 6px;
  background: var(--forge-border);
  border-radius: 3px;
  cursor: pointer;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: var(--forge-accent);
  border-radius: 3px;
  transition: width 0.1s;
}

.time-display {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: var(--forge-text3);
  margin-bottom: 1rem;
}

.player-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.ctrl-btn {
  background: var(--forge-surface);
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  cursor: pointer;
  font-size: 0.85rem;
  color: var(--forge-text);
  transition: all 0.2s;
}

.ctrl-btn:hover {
  background: var(--forge-hover);
}

.ctrl-btn.play-btn {
  width: 56px;
  height: 56px;
  background: var(--forge-accent);
  color: white;
  font-size: 1.25rem;
}

.speed-control {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--forge-text3);
}

.speed-control button {
  background: transparent;
  border: 1px solid var(--forge-border);
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  font-size: 0.8rem;
  color: var(--forge-text2);
}

.speed-control button.active {
  background: var(--forge-accent);
  border-color: var(--forge-accent);
  color: white;
}

.modal-hint {
  font-size: 0.85rem;
  color: var(--forge-text3);
  margin-bottom: 0.75rem;
}

.url-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--forge-border);
  border-radius: 8px;
  background: var(--forge-surface);
  color: var(--forge-text);
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
}

.url-input:focus {
  outline: none;
  border-color: var(--forge-accent);
}

@media (max-width: 700px) {
  .yt-grid {
    grid-template-columns: 1fr;
  }
  
  .yt-embed {
    max-width: 100%;
  }
}
</style>
