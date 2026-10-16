<template>
  <main class="cv-page">
    <header class="topbar">
      <button class="back-button" type="button" @click="navigate('/')">⌂ <span>Trang chủ</span></button>
      <div class="brand">📄 CV theo JD</div>
      <span class="save-state">{{ savedAt ? 'Đã lưu trên thiết bị này' : 'Tự lưu trên thiết bị này' }}</span>
    </header>

    <section class="hero">
      <p class="eyebrow">HỒ SƠ NGHỀ NGHIỆP CỦA BẠN</p>
      <h1>Tạo CV bám sát công việc bạn muốn ứng tuyển</h1>
      <p>Nhập CV nền một lần, dán JD để tạo bản CV riêng, rà soát nội dung rồi in hoặc lưu PDF.</p>
      <div class="workflow"><span>1. CV nền</span><b>→</b><span>2. Dán JD</span><b>→</b><span>3. Rà soát & xuất CV</span></div>
    </section>

    <div class="notice"><strong>Thông tin phải đúng sự thật.</strong> CV nền được giữ nguyên. Bản nháp chỉ ưu tiên nội dung đã có theo JD, không tự thêm kinh nghiệm, thành tích hay kỹ năng mới.</div>

    <section class="workspace">
      <div class="editor-column">
        <section class="panel">
          <div class="panel-heading"><div><p class="eyebrow">BƯỚC 1</p><h2>CV nền của bạn</h2></div><div class="heading-actions"><span class="pill">Tự lưu</span><button class="secondary" type="button" @click="openProfileFile">Nhập hồ sơ</button><input ref="profileFile" class="file-input" type="file" accept="application/json,.json" @change="importProfile"></div></div>
          <p class="help">Điền thông tin thật. Mỗi dòng kinh nghiệm nên ghi: Chức danh | Công ty | Thời gian | Việc đã làm / kết quả.</p>
          <div class="form-grid">
            <label>Họ và tên<input v-model="profile.name" placeholder="Ví dụ: Nguyễn Văn A" autocomplete="name"></label>
            <label>Chức danh mục tiêu<input v-model="profile.title" placeholder="Ví dụ: Senior Java Developer"></label>
            <label>Email<input v-model="profile.email" placeholder="name@email.com" autocomplete="email"></label>
            <label>Số điện thoại<input v-model="profile.phone" placeholder="+84 ..." autocomplete="tel"></label>
            <label class="wide">Địa điểm / LinkedIn / GitHub<input v-model="profile.links" placeholder="Hồ Chí Minh · linkedin.com/in/... · github.com/..."></label>
            <label class="wide">Tóm tắt nghề nghiệp<textarea v-model="profile.summary" rows="4" placeholder="Số năm kinh nghiệm, loại sản phẩm, trách nhiệm chính và kết quả có thể kiểm chứng."></textarea></label>
            <label class="wide">Kỹ năng / công nghệ<textarea v-model="profile.skills" rows="3" placeholder="Java, Spring Boot, REST API, PostgreSQL, AWS... Chỉ ghi kỹ năng bạn thực sự đã dùng."></textarea></label>
            <label class="wide">Kinh nghiệm làm việc<textarea v-model="profile.experience" rows="6" placeholder="Backend Developer | Công ty A | 2022–nay&#10;• Xây dựng ...&#10;• Cải thiện ... (ghi số liệu nếu có)&#10;&#10;Java Developer | Công ty B | 2020–2022&#10;• ..."></textarea></label>
            <label class="wide">Dự án tiêu biểu<textarea v-model="profile.projects" rows="4" placeholder="Tên dự án | Vai trò | Công nghệ&#10;• Bài toán, phần bạn trực tiếp làm và kết quả."></textarea></label>
            <label class="wide">Học vấn / chứng chỉ<textarea v-model="profile.education" rows="3" placeholder="Bằng cấp, trường, thời gian; chứng chỉ liên quan (nếu có)."></textarea></label>
          </div>
        </section>

        <section class="panel jd-panel">
          <div class="panel-heading"><div><p class="eyebrow">BƯỚC 2</p><h2>Mô tả công việc (JD)</h2></div></div>
          <label class="job-title-label" for="job-title-input">Chức danh ứng tuyển</label>
          <input id="job-title-input" v-model="jobTitle" class="job-title-input" placeholder="Ví dụ: Senior Java Developer">
          <label class="sr-only" for="jd-input">Dán nội dung JD</label>
          <textarea id="jd-input" v-model="jd" class="jd-input" rows="12" placeholder="Dán toàn bộ JD vào đây: trách nhiệm, yêu cầu kỹ thuật, kinh nghiệm và kỹ năng mềm..."></textarea>
          <div class="actions">
            <button class="primary" type="button" :disabled="!jd.trim()" @click="analyze">Tạo CV nháp theo JD</button>
            <button class="secondary" type="button" @click="clearJd">Xóa JD</button>
          </div>
          <p class="help">Xử lý ngay trên thiết bị: ưu tiên kỹ năng và sắp xếp kinh nghiệm/dự án theo từ khóa nhận diện được. Không gửi CV/JD lên máy chủ hay tự viết thêm nội dung.</p>
        </section>

        <section v-if="draftReady" class="panel draft-panel">
          <div class="panel-heading"><div><p class="eyebrow">BẢN RIÊNG CHO JOB</p><h2>Rà soát và chỉnh CV nháp</h2></div></div>
          <p class="help">Bạn có thể chỉnh bản này mà không làm thay đổi CV nền. Bấm “Tạo CV nháp theo JD” lần nữa để tạo lại từ CV nền.</p>
          <div class="form-grid">
            <label class="wide">Tóm tắt<textarea v-model="draft.summary" rows="4"></textarea></label>
            <label class="wide">Kỹ năng / công nghệ<textarea v-model="draft.skills" rows="3"></textarea></label>
            <label class="wide">Kinh nghiệm làm việc<textarea v-model="draft.experience" rows="7"></textarea></label>
            <label class="wide">Dự án tiêu biểu<textarea v-model="draft.projects" rows="4"></textarea></label>
            <label class="wide">Học vấn / chứng chỉ<textarea v-model="draft.education" rows="3"></textarea></label>
          </div>
        </section>
      </div>

      <div class="preview-column">
        <section v-if="analysis" class="panel analysis-panel">
          <div class="panel-heading"><div><p class="eyebrow">ĐỐI CHIẾU JD</p><h2>Yêu cầu và mức độ khớp</h2></div><span class="match-score">{{ analysis.score }}%</span></div>
          <p class="help">Tỷ lệ chỉ tính các từ khóa công nghệ nhận diện được. “Chưa thấy trong CV” nghĩa là chưa có trong nội dung bạn nhập.</p>
          <div v-if="analysis.matched.length" class="keyword-group"><h3>Đã thấy trong CV</h3><div class="chips"><span v-for="word in analysis.matched" :key="word" class="chip matched">✓ {{ word }}</span></div></div>
          <div v-if="analysis.missing.length" class="keyword-group"><h3>JD cần bạn xác nhận / bổ sung nếu đúng</h3><div class="chips"><span v-for="word in analysis.missing" :key="word" class="chip missing">＋ {{ word }}</span></div></div>
          <p v-if="!analysis.matched.length && !analysis.missing.length" class="empty-note">Chưa nhận diện được từ khóa kỹ thuật phổ biến trong JD. Hãy kiểm tra JD và cập nhật CV nền bằng kỹ năng liên quan.</p>
          <label class="confirm-box"><input v-model="confirmedTerms" type="checkbox"> Tôi đã kiểm tra các kỹ năng được đề xuất và chỉ giữ những gì mình thực sự có.</label>
        </section>

        <section class="preview-shell">
          <div class="preview-toolbar"><div><p class="eyebrow">BƯỚC 3</p><h2>{{ draftReady ? 'Xem trước CV theo JD' : 'Xem trước CV nền' }}</h2></div><div class="actions"><button class="secondary" type="button" @click="copyCv">Sao chép</button><button class="primary" type="button" @click="printCv">In / Lưu PDF</button></div></div>
          <article class="cv-paper" id="cv-paper">
            <header class="cv-header">
              <h1>{{ profile.name || 'HỌ VÀ TÊN' }}</h1>
              <p class="cv-title">{{ currentCv.title || 'CHỨC DANH ỨNG TUYỂN' }}</p>
              <p class="contact-line">{{ [profile.email, profile.phone, profile.links].filter(Boolean).join('  ·  ') || 'Email · Điện thoại · Địa điểm / LinkedIn' }}</p>
            </header>
            <section class="cv-section"><h2>TÓM TẮT</h2><p>{{ currentCv.summary || 'Bản tóm tắt nghề nghiệp sẽ hiển thị ở đây sau khi bạn điền CV nền.' }}</p></section>
            <section v-if="displaySkills.length" class="cv-section"><h2>KỸ NĂNG</h2><div class="skill-list"><span v-for="skill in displaySkills" :key="skill">{{ skill }}</span></div></section>
            <section v-if="currentCv.experience.trim()" class="cv-section"><h2>KINH NGHIỆM LÀM VIỆC</h2><p class="preserve-lines">{{ currentCv.experience }}</p></section>
            <section v-if="currentCv.projects.trim()" class="cv-section"><h2>DỰ ÁN TIÊU BIỂU</h2><p class="preserve-lines">{{ currentCv.projects }}</p></section>
            <section v-if="currentCv.education.trim()" class="cv-section"><h2>HỌC VẤN & CHỨNG CHỈ</h2><p class="preserve-lines">{{ currentCv.education }}</p></section>
            <p v-if="!hasProfile" class="placeholder-hint">Điền CV nền ở cột bên trái để tạo bản xem trước. Nội dung trống sẽ không được tự bịa.</p>
          </article>
          <p class="help preview-help">Bản xem trước là bản nháp. Hãy rà lại ngày tháng, số liệu, chính tả và mọi tuyên bố trước khi gửi.</p>
        </section>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue';
import { navigate } from '../utils/navigate.js';

const PROFILE_KEY = 'skillforge_cv_profile_v1';
const JD_KEY = 'skillforge_cv_jd_v1';
const JOB_TITLE_KEY = 'skillforge_cv_job_title_v1';
const DRAFT_KEY = 'skillforge_cv_draft_v1';
const defaultProfile = { name: '', title: '', email: '', phone: '', links: '', summary: '', skills: '', experience: '', projects: '', education: '' };
const defaultDraft = { title: '', summary: '', skills: '', experience: '', projects: '', education: '' };
function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}
const profile = reactive({ ...defaultProfile, ...load(PROFILE_KEY, {}) });
const jd = ref(load(JD_KEY, ''));
const jobTitle = ref(load(JOB_TITLE_KEY, ''));
const storedDraft = load(DRAFT_KEY, {});
const { ready: storedDraftReady, analysis: storedAnalysis, confirmedTerms: storedConfirmedTerms, ...storedDraftFields } = storedDraft && typeof storedDraft === 'object' ? storedDraft : {};
const draft = reactive({ ...defaultDraft, ...storedDraftFields });
const draftReady = ref(storedDraftReady === true);
const analysis = ref(storedAnalysis && typeof storedAnalysis === 'object' ? storedAnalysis : null);
const confirmedTerms = ref(storedConfirmedTerms === true);
const savedAt = ref(false);
const profileFile = ref(null);
let saveTimer;

function persistState() {
  window.clearTimeout(saveTimer);
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    localStorage.setItem(JD_KEY, JSON.stringify(jd.value));
    localStorage.setItem(JOB_TITLE_KEY, JSON.stringify(jobTitle.value));
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ ready: draftReady.value, analysis: analysis.value, confirmedTerms: confirmedTerms.value, ...draft }));
    savedAt.value = true;
  } catch { savedAt.value = false; }
}
function scheduleSave() {
  window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(persistState, 250);
}
watch([() => ({ ...profile }), jd, jobTitle, () => ({ ...draft }), draftReady, analysis, confirmedTerms], scheduleSave, { deep: true });
watch([() => ({ ...profile }), jd, jobTitle], () => {
  analysis.value = null;
  confirmedTerms.value = false;
  draftReady.value = false;
}, { deep: true, flush: 'sync' });
window.addEventListener('pagehide', persistState);
onBeforeUnmount(() => {
  window.removeEventListener('pagehide', persistState);
  persistState();
});

const hasProfile = computed(() => Object.values(profile).some(value => String(value).trim()));
const currentCv = computed(() => draftReady.value ? draft : profile);
const cvText = computed(() => [
  profile.name, currentCv.value.title, [profile.email, profile.phone, profile.links].filter(Boolean).join(' · '),
  currentCv.value.summary,
  displaySkills.value.length ? `KỸ NĂNG\n${displaySkills.value.join(', ')}` : '',
  currentCv.value.experience ? `KINH NGHIỆM LÀM VIỆC\n${currentCv.value.experience}` : '',
  currentCv.value.projects ? `DỰ ÁN TIÊU BIỂU\n${currentCv.value.projects}` : '',
  currentCv.value.education ? `HỌC VẤN & CHỨNG CHỈ\n${currentCv.value.education}` : '',
].filter(Boolean).join('\n\n'));
const displaySkills = computed(() => {
  const base = splitSkills(currentCv.value.skills);
  if (!analysis.value || !confirmedTerms.value) return base;
  const known = new Set(base.map(normalize));
  return [...base, ...analysis.value.matched.filter(skill => !known.has(normalize(skill)))];
});

const KEYWORDS = [
  'Java', 'Spring Boot', 'Spring Security', 'Spring Data JPA', 'Hibernate', 'REST API', 'GraphQL', '.NET', 'C#', 'ASP.NET Core',
  'JavaScript', 'TypeScript', 'React', 'Vue', 'Angular', 'Node.js', 'HTML', 'CSS', 'SQL', 'PostgreSQL', 'MySQL', 'SQL Server',
  'MongoDB', 'Redis', 'Kafka', 'RabbitMQ', 'Microservices', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Lambda', 'S3', 'EC2',
  'Terraform', 'CI/CD', 'Jenkins', 'GitHub Actions', 'GitLab CI', 'Linux', 'OAuth 2.0', 'JWT', 'JUnit', 'Mockito', 'Selenium', 'Cypress',
  'Agile', 'Scrum', 'System Design', 'Data Engineering', 'Python', 'Machine Learning', 'ETL',
];
function normalize(value) { return value.toLocaleLowerCase().replace(/[^\p{L}\p{N}+#.]/gu, ''); }
function splitSkills(value) { return value.split(/[\n,;•]+/).map(skill => skill.trim()).filter(Boolean); }
function containsTerm(text, term) {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(?<![\\w+#])${escaped}(?![\\w+#])`, 'i').test(text);
}
function relevanceScore(text, terms) {
  return terms.reduce((score, term) => score + Number(containsTerm(text, term)), 0);
}
function prioritizeEntries(value, terms) {
  const entries = value.split(/\n\s*\n/).map(text => text.trim()).filter(Boolean);
  if (entries.length < 2 || !terms.length) return value;
  return entries
    .map((text, index) => ({ text, index, score: relevanceScore(text, terms) }))
    .sort((first, second) => second.score - first.score || first.index - second.index)
    .map(entry => entry.text)
    .join('\n\n');
}
function analyze() {
  const found = KEYWORDS.filter(term => containsTerm(jd.value, term))
    .sort((first, second) => jd.value.toLowerCase().indexOf(first.toLowerCase()) - jd.value.toLowerCase().indexOf(second.toLowerCase()));
  const cv = Object.values(profile).join('\n');
  const matched = found.filter(term => containsTerm(cv, term));
  const missing = found.filter(term => !matched.includes(term));
  analysis.value = { matched, missing, score: found.length ? Math.round(matched.length / found.length * 100) : 0 };
  confirmedTerms.value = false;
  const skills = splitSkills(profile.skills)
    .map((skill, index) => ({ skill, index, score: relevanceScore(skill, matched) }))
    .sort((first, second) => second.score - first.score || first.index - second.index)
    .map(item => item.skill);
  Object.assign(draft, {
    title: jobTitle.value.trim() || profile.title,
    summary: profile.summary,
    skills: skills.join(', '),
    experience: prioritizeEntries(profile.experience, matched),
    projects: prioritizeEntries(profile.projects, matched),
    education: profile.education,
  });
  draftReady.value = true;
}
function clearJd() {
  jd.value = '';
  jobTitle.value = '';
  analysis.value = null;
  confirmedTerms.value = false;
  Object.assign(draft, defaultDraft);
  draftReady.value = false;
}
function openProfileFile() { profileFile.value?.click(); }
async function importProfile(event) {
  const file = event.target.files?.[0];
  event.target.value = '';
  if (!file) return;
  try {
    const imported = JSON.parse(await file.text());
    const source = imported.profile || imported;
    const keys = Object.keys(defaultProfile);
    if (!source || typeof source !== 'object' || !keys.some(key => typeof source[key] === 'string' && source[key].trim())) {
      throw new Error('Tệp không có các trường hồ sơ CV hợp lệ.');
    }
    for (const key of keys) profile[key] = typeof source[key] === 'string' ? source[key] : '';
    analysis.value = null;
    confirmedTerms.value = false;
    Object.assign(draft, defaultDraft);
    draftReady.value = false;
    window.alert('Đã nhập CV nền. Thông tin sẽ được lưu trên trình duyệt này.');
  } catch (error) {
    window.alert(error instanceof SyntaxError ? 'Không đọc được JSON. Hãy chọn tệp hồ sơ CV hợp lệ.' : error.message);
  }
}
function printCv() { window.print(); }
async function copyCv() {
  if (!cvText.value.trim()) return;
  try { await navigator.clipboard.writeText(cvText.value); window.alert('Đã sao chép nội dung CV.'); }
  catch { window.alert('Không thể sao chép tự động. Hãy chọn nội dung trong bản xem trước để sao chép.'); }
}
</script>

<style scoped>
.cv-page{min-height:100vh;background:radial-gradient(ellipse at 12% 0%,#201746 0,transparent 32%),#0c0a1d;color:#f4f2ff;padding:24px clamp(16px,4vw,64px) 64px;font-family:Inter,system-ui,sans-serif}.topbar{max-width:1440px;margin:0 auto 30px;display:flex;align-items:center;justify-content:space-between;gap:16px}.brand{font-size:20px;font-weight:800}.back-button,.secondary{border:1px solid #45356c;background:#19142d;color:#e8e1ff;border-radius:12px;padding:10px 14px;cursor:pointer}.save-state,.help{color:#a8a4bd;font-size:13px}.hero,.notice,.workspace{max-width:1440px;margin-left:auto;margin-right:auto}.hero{padding:16px 0 24px}.eyebrow{font-size:11px;letter-spacing:.12em;font-weight:800;color:#a98aff;margin:0 0 8px}.hero h1{font-size:clamp(28px,4vw,46px);max-width:820px;line-height:1.12;margin:0 0 12px}.hero>p:not(.eyebrow){color:#c5c1d3;font-size:16px;max-width:760px;line-height:1.65}.workflow{display:flex;gap:12px;align-items:center;color:#ddd4ff;font-weight:700;margin-top:20px;flex-wrap:wrap}.workflow b{color:#9368ff}.notice{border:1px solid #5d4a23;background:#211b2a;color:#e7d9b3;border-radius:14px;padding:14px 18px;margin-bottom:22px;line-height:1.6}.notice strong{color:#ffd66e}.workspace{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:20px;align-items:start}.editor-column,.preview-column{display:grid;gap:18px;min-width:0}.panel,.preview-shell{background:#151126;border:1px solid #30244c;border-radius:18px;padding:22px}.panel-heading,.preview-toolbar{display:flex;justify-content:space-between;align-items:center;gap:16px;margin-bottom:12px}.panel h2,.preview-toolbar h2{font-size:20px;margin:0}.pill{font-size:12px;color:#62e6b6;border:1px solid #225b4b;border-radius:999px;padding:6px 10px}.help{line-height:1.55;margin:8px 0 14px}.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}.form-grid label{display:grid;gap:7px;color:#dcd8e9;font-size:13px;font-weight:700}.form-grid .wide{grid-column:1/-1}input,textarea{font:inherit;color:#f5f2ff;background:#0f0c1d;border:1px solid #3b3154;border-radius:10px;padding:11px 12px;outline:none;width:100%}input:focus,textarea:focus{border-color:#a178ff;box-shadow:0 0 0 3px #8557ff22}textarea{resize:vertical;line-height:1.55}.jd-input{min-height:230px}.actions{display:flex;gap:10px;flex-wrap:wrap}.primary{border:0;background:linear-gradient(120deg,#7148ef,#9a5bff);color:#fff;border-radius:11px;padding:11px 16px;font-weight:800;cursor:pointer}.primary:disabled{opacity:.5;cursor:not-allowed}.match-score{font-size:20px;font-weight:900;color:#63e5b4;border:1px solid #22654f;border-radius:50%;width:54px;height:54px;display:grid;place-items:center}.keyword-group{margin:18px 0}.keyword-group h3{font-size:13px;color:#cfc9dc;margin:0 0 10px}.chips,.skill-list{display:flex;gap:7px;flex-wrap:wrap}.chip,.skill-list span{border-radius:999px;padding:6px 10px;font-size:12px}.chip.matched{background:#15372c;color:#7bf0bd}.chip.missing{background:#372b19;color:#ffce72}.confirm-box{display:flex;gap:10px;align-items:flex-start;border-top:1px solid #342a47;padding-top:15px;color:#d5d0e2;font-size:13px;line-height:1.5}.confirm-box input{width:17px;height:17px;flex:0 0 17px;margin-top:1px;accent-color:#8b5cf6}.empty-note{color:#c8bddf;font-size:13px}.preview-shell{padding:0;background:transparent;border:0}.preview-toolbar{padding:0 2px 10px}.cv-paper{background:#fff;color:#20202a;min-height:700px;padding:clamp(24px,4vw,48px);border-radius:5px;box-shadow:0 14px 40px #0005;font-family:Arial,sans-serif}.cv-header{border-bottom:2px solid #6c4ac2;padding-bottom:17px}.cv-header h1{font-size:29px;letter-spacing:.02em;margin:0 0 6px;color:#211b34}.cv-title{font-size:15px;font-weight:bold;color:#6543ad;margin:0 0 9px}.contact-line{font-size:11px;color:#555;margin:0;overflow-wrap:anywhere}.cv-section{margin-top:22px}.cv-section h2{font-size:12px;letter-spacing:.1em;color:#62449d;border-bottom:1px solid #ddd5ee;padding-bottom:6px;margin:0 0 9px}.cv-section p{font-size:12px;line-height:1.65;margin:0;color:#333}.preserve-lines{white-space:pre-wrap}.skill-list span{border:1px solid #ddd5ee;color:#44365f;background:#f7f4fb;padding:5px 8px;font-size:11px}.placeholder-hint{color:#827b91;font-size:13px;margin-top:28px}.preview-help{margin:10px 2px}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
.heading-actions{display:flex;align-items:center;gap:8px}.file-input{display:none}.heading-actions .secondary{font-size:12px;padding:8px 10px}
.job-title-label{display:block;color:#dcd8e9;font-size:13px;font-weight:700;margin-bottom:7px}.job-title-input{margin-bottom:14px}
@media(max-width:980px){.workspace{grid-template-columns:1fr}.preview-column{grid-row:2}.cv-paper{min-height:unset}}
@media(max-width:600px){.cv-page{padding:16px 12px 40px}.topbar{margin-bottom:18px;flex-wrap:wrap}.brand{order:-1;width:100%}.save-state{font-size:11px}.panel{padding:16px}.form-grid{grid-template-columns:1fr}.form-grid .wide{grid-column:auto}.preview-toolbar{align-items:flex-start;flex-direction:column}.cv-paper{padding:24px 18px}.back-button span{display:inline}}
@media print{.cv-page{background:#fff;padding:0;color:#111}.topbar,.hero,.notice,.editor-column,.preview-toolbar,.preview-help,.analysis-panel{display:none!important}.workspace,.preview-column,.preview-shell{display:block!important;margin:0;padding:0;border:0;max-width:none}.cv-paper{box-shadow:none;border-radius:0;padding:12mm 15mm;min-height:0}.cv-section{break-inside:avoid}.cv-page #cv-paper{display:block}}
</style>
