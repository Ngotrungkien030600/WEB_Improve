<template>
  <div class="it-game-page">
    <CTopbar title="🎯 Luyện giao tiếp IT" back-label="Tiếng Anh" @go-home="goBack" />

    <main class="game-shell">
      <nav class="game-picker" aria-label="Chọn bài luyện">
        <button
          v-for="game in itEnglishGames"
          :key="game.id"
          class="picker-button"
          :class="{ active: game.id === gameId }"
          @click="selectGame(game.id)"
        >
          <span>{{ game.icon }}</span><span>{{ game.title }}</span>
        </button>
      </nav>

      <section v-if="round" class="practice-card">
        <div class="practice-heading">
          <div>
            <p class="eyebrow">{{ activeGame.icon }} BÀI LUYỆN GIAO TIẾP IT</p>
            <h1>{{ activeGame.title }}</h1>
            <p class="subheading">{{ activeGame.description }}</p>
          </div>
          <div class="round-count">Tình huống {{ roundIndex + 1 }} / {{ activeGame.rounds.length }}</div>
        </div>

        <div class="progress-track"><span :style="{ width: `${((roundIndex + 1) / activeGame.rounds.length) * 100}%` }"></span></div>

        <template v-if="activeGame.id === 'interview'">
          <Scenario :text="round.situation" />
          <div class="prompt-box"><p class="label">CÂU HỎI PHỎNG VẤN</p><h2>{{ round.prompt }}</h2><p>{{ round.promptVi }}</p></div>
          <SpeakBox v-model="draft" :placeholder="'Tự trả lời bằng tiếng Anh. Bạn có thể bắt đầu bằng 2–3 câu…'" />
          <div class="actions"><button class="primary" @click="showSample = !showSample">{{ showSample ? 'Ẩn bài mẫu' : 'Xem bài mẫu và cách triển khai' }}</button><button class="secondary" @click="nextRound">Tình huống tiếp theo →</button></div>
          <div v-if="showSample" class="learning-panel">
            <div class="sample-heading"><h3>Bài mẫu</h3><button class="listen" @click="speak(round.sample)">🔊 Nghe câu mẫu</button></div>
            <blockquote>{{ round.sample }}</blockquote><p class="translation">{{ round.sampleVi }}</p>
            <h3>Cách triển khai</h3><ol><li v-for="item in round.structure" :key="item">{{ item }}</li></ol>
            <WordList :words="round.words" />
          </div>
        </template>

        <template v-else-if="activeGame.id === 'standup'">
          <Scenario :text="round.situation" />
          <div class="standup-fields">
            <SpeakBox v-model="standup.yesterday" title="Hôm qua — What did you do?" placeholder="I fixed… / I finished…" />
            <SpeakBox v-model="standup.today" title="Hôm nay — What are you working on?" placeholder="Today, I’m working on…" />
            <SpeakBox v-model="standup.blocker" title="Vướng mắc — Are you blocked?" placeholder="I’m blocked by… / I don’t have any blockers…" />
          </div>
          <div class="actions"><button class="primary" @click="showSample = !showSample">{{ showSample ? 'Ẩn câu mẫu' : 'Xem câu mẫu và nghĩa' }}</button><button class="secondary" @click="nextRound">Tình huống tiếp theo →</button></div>
          <div v-if="showSample" class="learning-panel">
            <div v-for="(sentence, i) in [round.yesterday, round.today, round.blocker]" :key="sentence" class="example-line"><p><strong>{{ ['Hôm qua', 'Hôm nay', 'Vướng mắc'][i] }}:</strong> {{ sentence }}</p><p class="translation">{{ round.translations[i] }}</p><button class="listen" @click="speak(sentence)">🔊 Nghe câu</button></div>
            <WordList :words="round.words" />
          </div>
        </template>

        <template v-else-if="activeGame.id === 'clarify'">
          <Scenario :text="round.situation" />
          <p class="instruction">Chọn những câu bạn sẽ hỏi khách hàng để làm rõ yêu cầu:</p>
          <div class="choice-list">
            <button v-for="(option, index) in round.options" :key="option.text" class="choice" :class="choiceClass(index)" @click="toggleChoice(index)">
              <span class="choice-mark">{{ selectedChoices.includes(index) ? '✓' : '＋' }}</span><span>{{ option.text }}<small v-if="checked && selectedChoices.includes(index)">{{ option.why }}</small></span>
            </button>
          </div>
          <div class="actions"><button class="primary" @click="checked = true">Kiểm tra lựa chọn</button><button v-if="checked" class="secondary" @click="showSample = !showSample">{{ showSample ? 'Ẩn phản hồi' : 'Xem khách hàng trả lời' }}</button><button class="secondary" @click="nextRound">Tình huống tiếp theo →</button></div>
          <div v-if="checked && showSample" class="learning-panel"><h3>Khách hàng trả lời</h3><blockquote>{{ round.customer }}</blockquote><p class="translation">{{ round.customerVi }}</p><h3>Bước tiếp theo</h3><p>{{ round.next }}</p><blockquote>{{ round.nextEn }}</blockquote><WordList :words="round.words" /></div>
          <p v-if="checked" class="score-note">Bạn chọn đúng {{ selectionScore }} / {{ round.options.filter(option => option.good).length }} câu hỏi cần làm rõ và chọn nhầm {{ incorrectSelections }} câu chưa phù hợp. Đọc lý do dưới các lựa chọn để hiểu vì sao.</p>
        </template>

        <template v-else-if="activeGame.id === 'incident'">
          <Scenario :text="round.situation" />
          <p class="instruction">Chọn các bước điều tra giúp tìm nguyên nhân dựa trên bằng chứng:</p>
          <div class="choice-list">
            <button v-for="(option, index) in round.investigation" :key="option.text" class="choice" :class="choiceClass(index)" @click="toggleChoice(index)">
              <span class="choice-mark">{{ selectedChoices.includes(index) ? '✓' : '＋' }}</span><span>{{ option.text }}<small v-if="checked && selectedChoices.includes(index)">{{ option.why }}</small></span>
            </button>
          </div>
          <SpeakBox v-model="draft" title="Giải thích suy luận của bạn bằng tiếng Anh" placeholder="The logs show… I suspect… I’d check…" />
          <div class="actions"><button class="primary" @click="checked = true; showSample = true">Xem phân tích và câu mẫu</button><button class="secondary" @click="nextRound">Sự cố tiếp theo →</button></div>
          <div v-if="showSample" class="learning-panel"><h3>Phân tích</h3><p class="score-note">{{ investigationFeedback }}</p><blockquote>{{ round.model }}</blockquote><p class="translation">{{ round.modelVi }}</p><button class="listen" @click="speak(round.model)">🔊 Nghe cách trình bày</button><WordList :words="round.words" /></div>
        </template>

        <template v-else>
          <div class="prompt-box"><p class="label">CÂU HỎI PHỎNG VẤN</p><h2>{{ round.prompt }}</h2><p>{{ round.promptVi }}</p></div>
          <p class="instruction">Chọn từng ý theo thứ tự bạn muốn kể. Dùng mũi tên để đổi thứ tự:</p>
          <div class="block-list">
            <div v-for="(block, index) in arrangedBlocks" :key="block.id" class="answer-block">
              <span class="block-number">{{ index + 1 }}</span><span>{{ block.text }}</span>
              <button :disabled="index === 0" aria-label="Chuyển lên" @click="moveBlock(index, -1)">↑</button><button :disabled="index === arrangedBlocks.length - 1" aria-label="Chuyển xuống" @click="moveBlock(index, 1)">↓</button>
            </div>
          </div>
          <div class="block-bank"><button v-for="(block, index) in availableBlocks" :key="block.original" class="bank-block" @click="addBlock(index)">{{ block.text }}</button><p v-if="!availableBlocks.length" class="score-note">Bạn đã đưa hết các ý vào câu trả lời.</p></div>
          <div class="actions"><button class="primary" @click="checkOrder">Kiểm tra mạch kể chuyện</button><button v-if="checked" class="secondary" @click="showSample = !showSample">{{ showSample ? 'Ẩn bài hoàn chỉnh' : 'Xem bài mẫu hoàn chỉnh' }}</button><button class="secondary" @click="nextRound">Câu hỏi tiếp theo →</button></div>
          <p v-if="checked" class="score-note">{{ orderFeedback }}</p>
          <div v-if="showSample" class="learning-panel"><h3>Bài mẫu hoàn chỉnh</h3><blockquote>{{ round.model }}</blockquote><p class="translation">{{ round.modelVi }}</p><h3>Khung kể chuyện</h3><ol><li v-for="note in round.notes" :key="note">{{ note }}</li></ol><WordList :words="round.words" /></div>
        </template>
      </section>
      <section v-else class="practice-card empty-round" role="status">
        <h1>Chưa tải được bài luyện</h1>
        <p>Không tìm thấy tình huống cho mục này. Quay lại Tiếng Anh rồi mở lại Phỏng vấn thử nhé.</p>
        <button class="primary" @click="goBack">Quay lại Tiếng Anh</button>
      </section>
      <p class="practice-tip">Mẹo luyện: tự nói thành tiếng trước khi mở bài mẫu. Mục tiêu là diễn đạt được ý của mình, không cần học thuộc nguyên văn.</p>
    </main>
  </div>
</template>

<script setup>
import { computed, defineComponent, h, onBeforeUnmount, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import CTopbar from '../components/CTopbar.vue';
import { itEnglishGames } from '../data/it-english-games.js';

const route = useRoute();
const router = useRouter();
const validIds = itEnglishGames.map(game => game.id);
const gameId = ref(validIds.includes(route.params.gameId) ? route.params.gameId : validIds[0]);
const activeGame = computed(() => itEnglishGames.find(game => game.id === gameId.value) || itEnglishGames[0]);
const roundIndex = ref(0);
const round = computed(() => activeGame.value?.rounds?.[roundIndex.value] ?? activeGame.value?.rounds?.[0] ?? null);
const draft = ref('');
const showSample = ref(false);
const selectedChoices = ref([]);
const checked = ref(false);
const standup = reactive({ yesterday: '', today: '', blocker: '' });
const arrangedBlocks = ref([]);
const blockPool = ref([]);
const speechRecognition = ref(null);

const selectionScore = computed(() => {
  const options = round.value.options || [];
  return selectedChoices.value.filter(index => options[index]?.good).length;
});
const incorrectSelections = computed(() => {
  const options = round.value.options || [];
  return selectedChoices.value.filter(index => !options[index]?.good).length;
});
const investigationFeedback = computed(() => {
  const options = round.value.investigation || [];
  const right = options.filter((option, index) => option.good === selectedChoices.value.includes(index)).length;
  return `Bạn xác định đúng ${right}/${options.length} lựa chọn. Ưu tiên kiểm tra log, cấu hình và số liệu trước khi thay đổi hệ thống.`;
});
const orderFeedback = computed(() => {
  const expected = round.value.order;
  const actual = arrangedBlocks.value.map(block => block.original);
  const correct = actual.filter((item, index) => item === expected[index]).length;
  return `Mạch kể hiện tại đúng ${correct}/${expected.length} ý. Một câu trả lời tốt thường nêu bối cảnh, hành động, kết quả rồi bài học.`;
});

const Scenario = defineComponent({ props: { text: { type: String, required: true } }, setup(props) { return () => h('div', { class: 'scenario-box' }, [h('p', { class: 'label' }, 'TÌNH HUỐNG'), h('p', props.text)]); } });
const WordList = defineComponent({ props: { words: { type: Array, default: () => [] } }, setup(props) { return () => h('div', { class: 'word-list' }, [h('h3', 'Cụm từ nên nhớ'), ...props.words.map(([word, meaning]) => h('div', { class: 'word-row', key: word }, [h('strong', word), h('span', meaning)]))]); } });
const SpeakBox = defineComponent({
  props: { modelValue: { type: String, default: '' }, title: { type: String, default: 'Đến lượt bạn trả lời' }, placeholder: { type: String, default: 'Viết hoặc nói câu trả lời bằng tiếng Anh…' } },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const listening = ref(false);
    const startSpeech = () => {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) { window.alert('Trình duyệt này chưa hỗ trợ nhận diện giọng nói. Bạn vẫn có thể nhập câu trả lời vào ô bên trên.'); return; }
      const recognition = new SpeechRecognition();
      speechRecognition.value = recognition;
      recognition.lang = 'en-US'; recognition.interimResults = false; recognition.continuous = true;
      recognition.onresult = (event) => { const transcript = Array.from(event.results).slice(event.resultIndex).map(result => result[0].transcript).join(' '); emit('update:modelValue', `${props.modelValue}${props.modelValue ? ' ' : ''}${transcript}`); };
      recognition.onend = () => { listening.value = false; };
      recognition.onerror = () => { listening.value = false; };
      recognition.start(); listening.value = true;
    };
    const stopSpeech = () => { speechRecognition.value?.stop?.(); listening.value = false; };
    return () => h('div', { class: 'speak-box' }, [h('div', { class: 'speak-heading' }, [h('label', props.title), h('button', { class: 'listen', onClick: listening.value ? stopSpeech : startSpeech }, listening.value ? '⏹ Dừng ghi âm' : '🎙️ Nói tiếng Anh')]), h('textarea', { value: props.modelValue, placeholder: props.placeholder, rows: 4, onInput: event => emit('update:modelValue', event.target.value) })]);
  },
});

function resetRound() {
  draft.value = ''; showSample.value = false; checked.value = false; selectedChoices.value = [];
  standup.yesterday = ''; standup.today = ''; standup.blocker = '';
  arrangedBlocks.value = [];
  blockPool.value = round.value?.blocks?.map((text, original) => ({ text, original })).sort(() => Math.random() - 0.5) || [];
}
resetRound();
function selectGame(id) { router.push(`/it-english-practice/${id}`); }
function goBack() { router.push('/english'); }
function nextRound() { roundIndex.value = (roundIndex.value + 1) % activeGame.value.rounds.length; resetRound(); }
function toggleChoice(index) { selectedChoices.value = selectedChoices.value.includes(index) ? selectedChoices.value.filter(item => item !== index) : [...selectedChoices.value, index]; }
function choiceClass(index) { if (!checked.value) return selectedChoices.value.includes(index) ? 'selected' : ''; const option = (round.value.options || round.value.investigation)[index]; return option.good ? 'correct' : selectedChoices.value.includes(index) ? 'incorrect' : ''; }
function speak(text) { if (!window.speechSynthesis || !text) return; window.speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(text); utterance.lang = 'en-US'; window.speechSynthesis.speak(utterance); }
function addBlock(index) { const block = availableBlocks.value[index]; if (block) arrangedBlocks.value.push(block); }
function moveBlock(index, offset) { const target = index + offset; if (target < 0 || target >= arrangedBlocks.value.length) return; const copy = [...arrangedBlocks.value]; [copy[index], copy[target]] = [copy[target], copy[index]]; arrangedBlocks.value = copy; }
const availableBlocks = computed(() => blockPool.value.filter(block => !arrangedBlocks.value.some(selected => selected.original === block.original)));
function checkOrder() { checked.value = true; }
watch(() => route.params.gameId, (id) => { gameId.value = validIds.includes(id) ? id : validIds[0]; roundIndex.value = 0; resetRound(); });
watch(gameId, () => { roundIndex.value = 0; resetRound(); });
onBeforeUnmount(() => { speechRecognition.value?.stop?.(); window.speechSynthesis?.cancel?.(); });
</script>

<style scoped>
.it-game-page{min-height:100vh;background:linear-gradient(140deg,#111027,#17233b);color:#e8edf7;padding:0 1.5rem 3rem}.game-shell{max-width:1060px;margin:1.5rem auto}.game-picker{display:flex;gap:.6rem;overflow-x:auto;padding:.4rem 0 1.2rem}.picker-button{display:flex;align-items:center;gap:.5rem;white-space:nowrap;border:1px solid #ffffff20;background:#ffffff08;color:#d7dcec;border-radius:999px;padding:.7rem 1rem;font-weight:650;cursor:pointer}.picker-button.active{background:#7548ea;border-color:#a38aff;color:white}.practice-card{background:#17162c;border:1px solid #ffffff1b;border-radius:24px;padding:clamp(1.1rem,3vw,2rem);box-shadow:0 18px 55px #05051055}.practice-heading{display:flex;align-items:flex-start;justify-content:space-between;gap:1rem}.eyebrow,.label{font-size:.75rem;letter-spacing:.09em;font-weight:800;color:#a78bfa;margin:0 0 .55rem}.practice-heading h1{font-size:clamp(1.6rem,4vw,2.2rem);margin:.2rem 0}.subheading{color:#9fa9c0;margin:.4rem 0 0}.round-count{white-space:nowrap;color:#c1b2ff;background:#7548ea20;border:1px solid #7548ea55;border-radius:999px;padding:.55rem .8rem;font-size:.86rem}.progress-track{height:5px;background:#ffffff12;border-radius:8px;margin:1.35rem 0 1.5rem;overflow:hidden}.progress-track span{display:block;height:100%;background:linear-gradient(90deg,#8b5cf6,#37d6ac);transition:width .2s}.scenario-box,.prompt-box{border:1px solid #ffffff17;border-radius:16px;background:#ffffff06;padding:1rem 1.15rem;margin:1rem 0}.scenario-box>p:last-child{line-height:1.7;margin:.25rem 0}.prompt-box h2{font-size:1.35rem;margin:.3rem 0}.prompt-box>p:last-child{color:#aeb8cd;margin:.4rem 0}.speak-box{margin:1rem 0}.speak-heading,.sample-heading{display:flex;justify-content:space-between;align-items:center;gap:1rem;margin-bottom:.5rem}.speak-heading label{font-weight:700}.speak-box textarea{width:100%;resize:vertical;min-height:110px;background:#0f0e20;color:#edf0fa;border:1px solid #ffffff26;border-radius:13px;padding:.9rem 1rem;font:inherit;line-height:1.6;box-sizing:border-box}.speak-box textarea:focus{outline:2px solid #8b5cf6;border-color:transparent}.listen{background:#ffffff0b;color:#cbbcff;border:1px solid #ffffff20;border-radius:10px;padding:.55rem .75rem;cursor:pointer;white-space:nowrap}.actions{display:flex;flex-wrap:wrap;gap:.65rem;margin:1rem 0}.actions button{border-radius:11px;padding:.75rem 1rem;font:inherit;font-weight:700;cursor:pointer}.primary{border:0;background:#7950ed;color:white}.secondary{border:1px solid #ffffff24;background:#ffffff08;color:#e1e6f3}.learning-panel{margin-top:1.2rem;border:1px solid #37d6ac38;background:#37d6ac09;border-radius:16px;padding:1.15rem}.learning-panel h3{font-size:1rem;margin:1rem 0 .55rem}.learning-panel h3:first-child{margin-top:0}.learning-panel blockquote{margin:.5rem 0;padding:.8rem 1rem;border-left:3px solid #8b5cf6;background:#ffffff08;border-radius:0 9px 9px 0;line-height:1.75}.translation{color:#aeb8cd;line-height:1.65;margin:.4rem 0 1rem}.learning-panel ol{padding-left:1.3rem;color:#d6dced;line-height:1.8}.word-list{border-top:1px solid #ffffff16;padding-top:.7rem;margin-top:1rem}.word-row{display:grid;grid-template-columns:minmax(150px,.8fr) 2fr;gap:1rem;padding:.55rem 0;border-bottom:1px solid #ffffff0e}.word-row strong{color:#65dfba}.word-row span{color:#b7bfd0}.standup-fields{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.7rem}.instruction{color:#c7cee0;font-weight:650;margin:1.2rem 0 .7rem}.choice-list{display:grid;gap:.55rem}.choice{display:flex;align-items:flex-start;gap:.75rem;text-align:left;padding:.85rem 1rem;border:1px solid #ffffff1b;border-radius:13px;background:#ffffff06;color:#e2e8f5;font:inherit;line-height:1.5;cursor:pointer}.choice.selected{border-color:#9477ff;background:#7950ed17}.choice.correct{border-color:#3cce9d;background:#24b67d13}.choice.incorrect{border-color:#ff6e81;background:#ff526812}.choice-mark{color:#9b82ff;font-size:1.1rem;font-weight:800}.choice small{display:block;color:#afbad0;margin-top:.4rem}.score-note{color:#aab5ca;line-height:1.6}.example-line{border-bottom:1px solid #ffffff13;padding:.45rem 0 1rem;margin-bottom:.6rem}.example-line .translation{margin-bottom:.3rem}.block-list{display:grid;gap:.55rem}.answer-block{display:grid;grid-template-columns:2rem 1fr 2rem 2rem;gap:.55rem;align-items:center;padding:.7rem;border:1px solid #ffffff21;background:#ffffff08;border-radius:12px;line-height:1.5}.block-number{display:grid;place-items:center;width:1.7rem;height:1.7rem;border-radius:50%;background:#7950ed;color:white;font-weight:800}.answer-block button{border:1px solid #ffffff25;border-radius:7px;background:#ffffff09;color:white;height:2rem;cursor:pointer}.answer-block button:disabled{opacity:.3;cursor:default}.block-bank{display:grid;gap:.5rem;margin-top:.85rem}.bank-block{background:#ffffff04;border:1px dashed #ffffff2b;color:#c9d2e5;text-align:left;padding:.7rem .85rem;border-radius:10px;cursor:pointer}.practice-tip{color:#919bb0;text-align:center;font-size:.9rem;margin:1rem auto;max-width:700px;line-height:1.6}@media(max-width:760px){.it-game-page{padding:0 .8rem 2rem}.practice-heading{display:block}.round-count{display:inline-block;margin-top:.8rem}.standup-fields{grid-template-columns:1fr}.word-row{grid-template-columns:1fr;gap:.15rem}.game-shell{margin-top:.8rem}}
</style>
