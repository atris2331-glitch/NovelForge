// ── State ──
let viewMode = 'single'; // 'scroll' | 'single' | 'spread'
let currentPageIndex = 0;
let zoomLevel = 100;
let allPages = []; // flat list of all page DOM elements after render
let chapters = [
  { id: 1, title: 'ลมกรด', content: 'ณ ชายแดนที่ขอบฟ้าแห่งอาณาจักรอาร์เวน สายลมพัดผ่านทุ่งหญ้าสีทองราวกับการโอดครวญของวิญญาณที่ไม่มีที่ไป เซล่า หญิงสาวผมดำประกายสีน้ำเงิน ยืนอยู่บนหน้าผาสูงชัน สายตาปักแน่นอยู่ที่ขอบฟ้าอันไกลโพ้น\n\nเธอเคยได้ยินเรื่องเล่าจากยายมาตั้งแต่เด็ก เรื่องของมังกรลมที่ซ่อนตัวอยู่ในเมฆก้อนใหญ่ เรื่องของอาณาจักรที่หายไปพร้อมกับพายุฝนครั้งใหญ่เมื่อพันปีก่อน และเรื่องของสมบัติที่ซ่อนไว้ลึกในหัวใจของพายุนั้น\n\n«ถ้าลมพาเธอไป จงไปด้วยใจที่กล้า» นั่นคือสิ่งที่ยายบอกในวันที่เธอจากไปตลอดกาล เซล่าบิดริมฝีปาก มือเธอกำดาบเงินอยู่แน่น ดาบที่เป็นมรดกจากตระกูลที่สูญสลายไปนานแล้ว', note: '', imageData: null, imageSize: 100 },
  { id: 2, title: 'เมืองใต้พายุ', content: 'ตลาดเมืองคาลิสเต้มีกลิ่นของควันธูปและเครื่องเทศปนกัน พ่อค้าแม่ค้าเรียกขายสินค้าด้วยเสียงดัง ขณะที่เด็กๆ วิ่งเล่นอยู่ระหว่างแผงขาย\n\nเซล่าสวมผ้าคลุมหน้าสีน้ำตาล เดินผ่านฝูงชนอย่างระมัดระวัง เธอกำลังมองหาใครบางคน คนที่รู้เรื่องแผนที่ที่ซ่อนอยู่ในตำนาน\n\n«เฮ้ นายหญิง รอสักครู่» เสียงชายคนหนึ่งเรียกจากหลัง เซล่าหยุดเดินแต่ไม่หันหน้า มือวางบนด้ามดาบโดยสัญชาตญาณ', note: '', imageData: null, imageSize: 100 },
];
let currentChapterId = 1;
let coverImageData = null;
let textAlign = 'justify';
let dropCap = true;
let bodyFont = 'Sarabun';
let coverTemplate = 'dark';
let coverTemplates = {
  dark:       { bg: 'linear-gradient(160deg,#1a1210,#3d2010)', accent: '#8b4513' },
  navy:       { bg: 'linear-gradient(160deg,#0a1628,#1a3a5c)', accent: '#1a3a5c' },
  forest:     { bg: 'linear-gradient(160deg,#0d2016,#1e5c38)', accent: '#2d6a4f' },
  rose:       { bg: 'linear-gradient(160deg,#2a0a14,#7a2040)', accent: '#922b21' },
  ivory:      { bg: 'linear-gradient(160deg,#f5ede0,#ddd0bc)', accent: '#8b4513' },
  slate:      { bg: 'linear-gradient(160deg,#1c1c24,#2e2e3a)', accent: '#6b2d8b' },
  // ── แนวใหม่ ──
  anime_dark: { bg: 'linear-gradient(160deg,#0e001e,#1a0040,#0e001e)', accent: '#7c3aed' },
  anime_day:  { bg: 'linear-gradient(160deg,#e0e7ff,#c7d2fe,#a5b4fc)', accent: '#4338ca' },
  sakura:     { bg: 'linear-gradient(160deg,#1a0010,#4a1030,#2a0820)', accent: '#e91e8c' },
  sakura_soft:{ bg: 'linear-gradient(160deg,#fff0f5,#ffd6e8,#ffe4ee)', accent: '#be185d' },
  yaoi_dark:  { bg: 'linear-gradient(160deg,#0a0015,#1e0035,#0a0015)', accent: '#9333ea' },
  yaoi_pink:  { bg: 'linear-gradient(160deg,#2d001a,#5a0030,#2d001a)', accent: '#f43f5e' },
  fantasy_gold:{ bg: 'linear-gradient(160deg,#1a1000,#3d2800,#1a1000)', accent: '#d97706' },
  galaxy:     { bg: 'linear-gradient(160deg,#020817,#0f1628,#1a0a2e)', accent: '#818cf8' },
  wuxia:      { bg: 'linear-gradient(160deg,#1a0505,#3d0000,#1a0505)', accent: '#dc2626' },
  kidspastel: { bg: 'linear-gradient(160deg,#fef3c7,#fde8f0,#e8f0fe)', accent: '#f59e0b' },
  mint_fresh: { bg: 'linear-gradient(160deg,#064e3b,#065f46,#064e3b)', accent: '#34d399' },
  horror:     { bg: 'linear-gradient(160deg,#000000,#1a0000,#0a0000)', accent: '#991b1b' },
  vintage_bl: { bg: 'linear-gradient(160deg,#fdf2f8,#fce7f3,#fbcfe8)', accent: '#9d174d' },
  steampunk:  { bg: 'linear-gradient(160deg,#1c1408,#2d2010,#1c1408)', accent: '#b45309' },
  ocean:      { bg: 'linear-gradient(160deg,#001e3c,#003366,#001e3c)', accent: '#0ea5e9' },
  custom_tpl: { bg: 'linear-gradient(160deg,#1a1612,#2a2018)', accent: '#8b4513', custom: true },
};
// Custom cover template image
let customCoverTemplateImageData = null;

// ── Init ──
function init() {
  // Try to load from autosave first
  const saved = localStorage.getItem('ebook_editor_autosave');
  if (saved) {
    try {
      const data = JSON.parse(saved);
      if (data.chapters && data.chapters.length > 0) {
        chapters = data.chapters;
        currentChapterId = chapters[0].id;
        // Restore book info
        if (data.bookInfo) {
          Object.entries(data.bookInfo).forEach(([id, val]) => {
            const el = document.getElementById(id);
            if (el) {
              if (el.type === 'checkbox') el.checked = val;
              else el.value = val;
            }
          });
        }
        // Restore settings
        if (data.settings) {
          if (data.settings.textAlign) textAlign = data.settings.textAlign;
          if (data.settings.dropCap !== undefined) dropCap = data.settings.dropCap;
          if (data.settings.bodyFont) bodyFont = data.settings.bodyFont;
          if (data.settings.coverTemplate) coverTemplate = data.settings.coverTemplate;
          if (data.settings.coverImageData) {
            coverImageData = data.settings.coverImageData;
            document.getElementById('coverPreview').src = coverImageData;
            document.getElementById('coverPreview').style.display = 'block';
            document.getElementById('coverPlaceholder').style.display = 'none';
            document.getElementById('coverDrop').classList.add('has-image');
            document.getElementById('coverBg').style.backgroundImage = `url(${coverImageData})`;
            document.getElementById('coverBg').style.backgroundSize = 'cover';
            document.getElementById('coverBg').style.backgroundPosition = 'center';
          }
          // Restore sliders
          ['fontSize','lineHeight','marginV','marginH','coverBrightness','coverOverlay'].forEach(id => {
            if (data.settings[id] !== undefined) {
              const el = document.getElementById(id);
              if (el) {
                el.value = data.settings[id];
                // Trigger display updates
                if (id === 'fontSize') document.getElementById('fontSizeVal').textContent = data.settings[id] + 'px';
                if (id === 'lineHeight') document.getElementById('lineHeightVal').textContent = (data.settings[id]/100).toFixed(2);
                if (id === 'marginV') document.getElementById('marginVVal').textContent = data.settings[id] + 'px';
                if (id === 'marginH') document.getElementById('marginHVal').textContent = data.settings[id] + 'px';
                if (id === 'coverBrightness') { document.getElementById('coverBrightnessVal').textContent = data.settings[id] + '%'; updateCoverBrightness(data.settings[id]); }
                if (id === 'coverOverlay') { document.getElementById('coverOverlayVal').textContent = data.settings[id] + '%'; updateCoverOverlay(data.settings[id]); }
              }
            }
          });
          // Restore font button
          if (data.settings.bodyFont) {
            document.querySelectorAll('.font-btn').forEach(b => {
              b.classList.toggle('active', b.textContent.startsWith(data.settings.bodyFont));
            });
          }
          // Restore text align radios
          if (data.settings.textAlign) {
            document.querySelectorAll('input[name=align]').forEach(r => {
              r.checked = r.value === data.settings.textAlign;
            });
          }
          // Restore drop cap
          if (data.settings.dropCap !== undefined) {
            document.getElementById('showDropCap').checked = data.settings.dropCap;
          }
        }
        showAutosaveStatus('loaded');
      }
    } catch(e) { console.warn('Autosave load failed', e); }
  }

  renderChapterList();
  selectChapter(currentChapterId || chapters[0].id);
  updatePreview();
  updateStats();

  // Record initial snapshot so Undo always has a base
  setTimeout(() => { _pushHistory(_snapshot()); _updateHistoryBtns(); }, 100);
  // Init right panel section accordions
  setTimeout(initPanelSectionAccordions, 200);

  // Auto-collapse LEFT panel on tablet/mobile to maximize preview
  if (window.innerWidth < 900) {
    const sidebar = document.querySelector('.sidebar');
    const lbtn = document.getElementById('leftPanelToggle');
    const rb2 = document.getElementById('rb-leftPanel');
    if (sidebar && !sidebar.classList.contains('collapsed-panel')) {
      sidebar.classList.add('collapsed-panel');
      if (lbtn) lbtn.classList.remove('active');
      if (rb2) rb2.classList.remove('active');
    }
    // Also collapse right panel
    const rp = document.querySelector('.right-panel');
    const rbtn = document.getElementById('rightPanelToggle');
    const rb3 = document.getElementById('rb-rightPanel');
    if (rp && !rp.classList.contains('collapsed-panel')) {
      rp.classList.add('collapsed-panel');
      if (rbtn) rbtn.classList.remove('active');
      if (rb3) rb3.classList.remove('active');
    }
    showToast('💡 แตะ ☰ เพื่อเปิดแผงซ้าย / ✏️ เพื่อเปิดแผงแก้ไข');
  }

  // Auto save every 30 seconds
  setInterval(autoSave, 30000);
  // Also save on any content change (debounced)
  autoSaveDebounce = debounce(autoSave, 3000);
  // Load backup history
  setTimeout(_loadBackupsFromStorage, 300);
}

let autoSaveDebounce;
function debounce(fn, delay) {
  let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
}

// ── Auto Save ──
function autoSave() {
  showAutosaveStatus('saving');
  try {
    const bookInfoIds = ['bookTitle','bookSubtitle','authorName','penName','publisher','pubYear','genre',
      'showTOC','showPreface','prefaceTitle','prefaceContent','showDedication','dedicationText'];
    const bookInfo = {};
    bookInfoIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) bookInfo[id] = el.type === 'checkbox' ? el.checked : el.value;
    });

    const settings = {
      textAlign, dropCap, bodyFont, coverTemplate, coverImageData,
      fontSize: document.getElementById('fontSize')?.value,
      lineHeight: document.getElementById('lineHeight')?.value,
      marginV: document.getElementById('marginV')?.value,
      marginH: document.getElementById('marginH')?.value,
      coverBrightness: document.getElementById('coverBrightness')?.value,
      coverOverlay: document.getElementById('coverOverlay')?.value,
    };

    const data = { bookInfo, chapters, settings, savedAt: new Date().toISOString() };
    localStorage.setItem('ebook_editor_autosave', JSON.stringify(data));
    showAutosaveStatus('saved');
  } catch(e) {
    console.warn('Autosave failed', e);
    showAutosaveStatus('error');
  }
}

function showAutosaveStatus(status) {
  const badge = document.getElementById('autosaveBadge');
  const text = document.getElementById('autosaveText');
  if (!badge || !text) return;
  badge.className = 'autosave-badge';
  if (status === 'saving') {
    badge.classList.add('saving'); text.textContent = 'กำลังบันทึก...';
  } else if (status === 'saved') {
    badge.classList.add('saved');
    const now = new Date();
    text.textContent = `✓ บันทึก ${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}`;
    setTimeout(() => { badge.className = 'autosave-badge'; text.textContent = 'Auto Save ✓'; }, 3000);
  } else if (status === 'loaded') {
    badge.classList.add('saved'); text.textContent = '✓ โหลดแล้ว';
    setTimeout(() => { badge.className = 'autosave-badge'; text.textContent = 'Auto Save ✓'; }, 3000);
  } else if (status === 'error') {
    text.textContent = '⚠️ บันทึกไม่ได้';
    setTimeout(() => { text.textContent = 'Auto Save'; }, 3000);
  } else {
    text.textContent = 'Auto Save';
  }
}

// ── Save Project as JSON ──
function saveProject() {
  autoSave();
  const bookInfoIds = ['bookTitle','bookSubtitle','authorName','penName','publisher','pubYear','genre',
    'showTOC','showPreface','prefaceTitle','prefaceContent','showDedication','dedicationText'];
  const bookInfo = {};
  bookInfoIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) bookInfo[id] = el.type === 'checkbox' ? el.checked : el.value;
  });
  const settings = {
    textAlign, dropCap, bodyFont, coverTemplate, coverImageData,
    fontSize: document.getElementById('fontSize')?.value,
    lineHeight: document.getElementById('lineHeight')?.value,
    marginV: document.getElementById('marginV')?.value,
    marginH: document.getElementById('marginH')?.value,
    coverBrightness: document.getElementById('coverBrightness')?.value,
    coverOverlay: document.getElementById('coverOverlay')?.value,
  };
  const data = { bookInfo, chapters, settings, savedAt: new Date().toISOString(), version: '4' };
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const title = document.getElementById('bookTitle')?.value || 'ebook';
  const safeTitle = title.replace(/[^a-zA-Z0-9ก-๙]/g, '_');
  a.href = url; a.download = `${safeTitle}_project.json`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('💾 บันทึกโปรเจกต์ .json เรียบร้อย!');
}

// ── Load Project from JSON ──
function loadProjectClick() {
  document.getElementById('loadProjectInput').click();
}

function loadProjectFile(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (!data.chapters) { showToast('❌ ไฟล์ไม่ถูกต้อง'); return; }
      chapters = data.chapters;
      currentChapterId = chapters[0].id;
      // Restore book info
      if (data.bookInfo) {
        Object.entries(data.bookInfo).forEach(([id, val]) => {
          const el = document.getElementById(id);
          if (el) {
            if (el.type === 'checkbox') el.checked = val;
            else el.value = val;
          }
        });
      }
      // Restore settings
      if (data.settings) {
        if (data.settings.textAlign) { textAlign = data.settings.textAlign; document.querySelectorAll('input[name=align]').forEach(r => r.checked = r.value === textAlign); }
        if (data.settings.dropCap !== undefined) { dropCap = data.settings.dropCap; document.getElementById('showDropCap').checked = dropCap; }
        if (data.settings.bodyFont) { bodyFont = data.settings.bodyFont; document.querySelectorAll('.font-btn').forEach(b => b.classList.toggle('active', b.textContent.startsWith(bodyFont))); }
        if (data.settings.coverTemplate) coverTemplate = data.settings.coverTemplate;
        if (data.settings.coverImageData) {
          coverImageData = data.settings.coverImageData;
          document.getElementById('coverPreview').src = coverImageData;
          document.getElementById('coverPreview').style.display = 'block';
          document.getElementById('coverPlaceholder').style.display = 'none';
          document.getElementById('coverDrop').classList.add('has-image');
          document.getElementById('coverBg').style.backgroundImage = `url(${coverImageData})`;
          document.getElementById('coverBg').style.backgroundSize = 'cover';
          document.getElementById('coverBg').style.backgroundPosition = 'center';
        }
        ['fontSize','lineHeight','marginV','marginH','coverBrightness','coverOverlay'].forEach(id => {
          if (data.settings[id] !== undefined) {
            const el = document.getElementById(id);
            if (el) { el.value = data.settings[id]; }
            if (id === 'fontSize') document.getElementById('fontSizeVal').textContent = data.settings[id] + 'px';
            if (id === 'lineHeight') document.getElementById('lineHeightVal').textContent = (data.settings[id]/100).toFixed(2);
            if (id === 'marginV') document.getElementById('marginVVal').textContent = data.settings[id] + 'px';
            if (id === 'marginH') document.getElementById('marginHVal').textContent = data.settings[id] + 'px';
            if (id === 'coverBrightness') { document.getElementById('coverBrightnessVal').textContent = data.settings[id] + '%'; updateCoverBrightness(data.settings[id]); }
            if (id === 'coverOverlay') { document.getElementById('coverOverlayVal').textContent = data.settings[id] + '%'; updateCoverOverlay(data.settings[id]); }
          }
        });
      }
      renderChapterList();
      selectChapter(chapters[0].id);
      updatePreview();
      updateStats();
      localStorage.setItem('ebook_editor_autosave', JSON.stringify(data));
      showToast('📂 โหลดโปรเจกต์เรียบร้อย! ' + chapters.length + ' บท');
    } catch(err) {
      showToast('❌ ไฟล์ .json ไม่ถูกต้อง');
      console.error(err);
    }
  };
  reader.readAsText(file);
  input.value = '';
}

// ── Import .txt ──
function importTxtClick() {
  document.getElementById('importTxtInput').click();
}

function importTxtFile(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target.result;
    // ตรวจว่ามีตัวแบ่งบทหรือไม่
    // รองรับ: "=== บทที่ 1 ===" / "=== ชื่อบท ===" / "บทที่ 1" / "บท 1" / "chapter" (case-insensitive)
    const chapterSplitRe = /^(?:={2,}.*={2,}|บทที่\s*\d+.*|บท\s*\d+.*|chapter\s*\d+.*)$/im;
    const hasChapters = chapterSplitRe.test(text);

    if (hasChapters) {
      _importTxtMultiChapter(text, file.name);
    } else {
      _importTxtSingleChapter(text, file.name);
    }
    input.value = '';
  };
  reader.readAsText(file, 'UTF-8');
}

async function _importTxtSingleChapter(text, filename) {
  const title = filename.replace(/\.txt$/i, '').replace(/\.docx$/i, '');
  // ประมวลผลแบบ async หลายรอบเพื่อไม่บล็อก UI
  await new Promise(r => setTimeout(r, 0));
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  await new Promise(r => setTimeout(r, 0));
  const content = lines.join('\n');

  const addMode = confirm(`นำเข้าเป็น 1 บท: "${title}"\n${lines.length} ย่อหน้า\n\nเพิ่มเข้าโปรเจกต์ปัจจุบัน หรือสร้างโปรเจกต์ใหม่?\n(OK = เพิ่ม, Cancel = ใหม่)`);
  if (!addMode) chapters = [];

  const id = 'ch_' + Date.now();
  chapters.push({ id, title, content, fontSize: null, lineHeight: null, align: null, font: null });
  currentChapterId = id;
  renderChapterList();
  selectChapter(id);
  updatePreview();
  updateStats();
  showToast(`✅ นำเข้า "${title}" — ${lines.length} ย่อหน้าเรียบร้อย`);
}

async function _importTxtMultiChapter(text, filename) {
  await new Promise(r => setTimeout(r, 0));
  const lines = text.split('\n');
  const chapterHeadRe = /^(?:={2,}\s*(.+?)\s*={2,}|(บทที่\s*\d+[^\n]*)|( บท\s*\d+[^\n]*)|(chapter\s*\d+[^\n]*))$/i;

  const rawChapters = [];
  let cur = null;

  // ประมวลผลทีละ 200 บรรทัดเพื่อไม่บล็อก UI
  for (let i = 0; i < lines.length; i++) {
    if (i % 200 === 0) await new Promise(r => setTimeout(r, 0));
    const line = lines[i];
    const m = line.match(chapterHeadRe);
    if (m) {
      if (cur) rawChapters.push(cur);
      const title = (m[1] || m[2] || m[3] || m[4] || line).trim();
      cur = { title, lines: [] };
    } else {
      if (!cur) cur = { title: filename.replace(/\.txt$/i, '').replace(/\.docx$/i, ''), lines: [] };
      cur.lines.push(line.trim());
    }
  }
  if (cur) rawChapters.push(cur);

  await new Promise(r => setTimeout(r, 0));
  const validChapters = rawChapters.map(c => ({
    ...c,
    content: c.lines.filter(l => l.length > 0).join('\n')
  })).filter(c => c.content.length > 0 || c.title);

  if (validChapters.length === 0) { showToast('❌ ไม่พบเนื้อหาในไฟล์'); return; }

  const addMode = confirm(`พบ ${validChapters.length} บท\n\nเพิ่มเข้าโปรเจกต์ปัจจุบัน หรือสร้างโปรเจกต์ใหม่?\n(OK = เพิ่ม, Cancel = ใหม่)`);
  if (!addMode) chapters = [];

  // เพิ่มบทแบบ batch เพื่อไม่บล็อก UI
  for (let i = 0; i < validChapters.length; i++) {
    if (i % 10 === 0) await new Promise(r => setTimeout(r, 0));
    const c = validChapters[i];
    const id = 'ch_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
    chapters.push({ id, title: c.title, content: c.content, fontSize: null, lineHeight: null, align: null, font: null });
  }

  currentChapterId = chapters[chapters.length - validChapters.length].id;
  renderChapterList();
  selectChapter(currentChapterId);
  updatePreview();
  updateStats();
  showToast(`✅ นำเข้า ${validChapters.length} บทเรียบร้อย!`);
}

// ── Import .docx ──
function importDocxClick() {
  if (typeof mammoth === 'undefined') {
    showToast('⚠ กำลังโหลด mammoth.js... ลองใหม่อีกครั้ง');
    return;
  }
  document.getElementById('importDocxInput').click();
}

// แปลง HTML inline ของ mammoth → markup string ของ editor
function _mammothNodeToMarkup(node) {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent;
  const tag = node.nodeName;
  const inner = Array.from(node.childNodes).map(_mammothNodeToMarkup).join('');
  if (tag === 'STRONG' || tag === 'B') return `**${inner}**`;
  if (tag === 'EM' || tag === 'I') return `_${inner}_`;
  if (tag === 'U') return `__${inner}__`;
  if (tag === 'BR') return '\n';
  return inner;
}

// แปลง block element ของ mammoth → markup line(s)
function _mammothBlockToLines(node) {
  const tag = node.nodeName;
  const text = (node.textContent || '').trim();
  if (!text && tag !== 'BR') return [];

  if (tag === 'H1') return [null]; // sentinel สำหรับแยกบท — จัดการข้างนอก
  if (tag === 'H2' || tag === 'H3') {
    // section separator
    const markup = _mammothNodeToMarkup(node).trim();
    return ['— ✦ —', `**${markup}**`];
  }
  if (tag === 'TABLE') {
    // แปลงตาราง → แถวธรรมดา
    const rows = Array.from(node.querySelectorAll('tr'));
    return rows.map(r => Array.from(r.querySelectorAll('td,th')).map(c => c.textContent.trim()).join(' | '));
  }
  if (tag === 'UL' || tag === 'OL') {
    return Array.from(node.querySelectorAll('li')).map(li => '• ' + _mammothNodeToMarkup(li).trim()).filter(Boolean);
  }
  if (tag === 'P' || tag === 'DIV') {
    const markup = _mammothNodeToMarkup(node).trim();
    return markup ? [markup] : [];
  }
  // fallback
  const markup = _mammothNodeToMarkup(node).trim();
  return markup ? [markup] : [];
}

function importDocxFile(input) {
  const file = input.files[0];
  if (!file) return;
  if (typeof mammoth === 'undefined') { showToast('❌ ไม่พบ mammoth.js — ต้องใช้ Internet'); return; }

  showToast('⏳ กำลังอ่านไฟล์ .docx...');
  const reader = new FileReader();
  reader.onload = (e) => {
    const arrayBuffer = e.target.result;
    setTimeout(async () => {
      try {
        const result = await mammoth.convertToHtml({ arrayBuffer });
        const html = result.value || '';
        if (!html.trim()) { showToast('❌ ไม่พบข้อความในไฟล์'); input.value = ''; return; }

        await new Promise(r => setTimeout(r, 0));
        const baseName = file.name.replace(/\.docx$/i, '');

        const parser = new DOMParser();
        const dom = parser.parseFromString(html, 'text/html');
        const nodes = Array.from(dom.body.children); // ใช้ .children (elements only)
        const hasH1 = nodes.some(n => n.nodeName === 'H1');

        if (hasH1) {
          await _importDocxByHeading(nodes, baseName);
        } else {
          // ไม่มี H1 → ตรวจ text-based chapter split
          const text = dom.body.textContent || '';
          const chapterHeadRe = /^(?:={2,}.*={2,}|บทที่\s*\d+.*|บท\s*\d+.*|chapter\s*\d+.*)$/im;
          if (chapterHeadRe.test(text)) {
            // fallback: txt-style multi-chapter (preserve markup best-effort)
            await _importDocxNoHeading(nodes, baseName, true);
          } else {
            await _importDocxNoHeading(nodes, baseName, false);
          }
        }
      } catch(err) {
        showToast('❌ อ่านไฟล์ .docx ไม่ได้: ' + err.message);
        console.error(err);
      }
      input.value = '';
    }, 50);
  };
  reader.onerror = () => { showToast('❌ อ่านไฟล์ไม่ได้'); input.value = ''; };
  reader.readAsArrayBuffer(file);
}

async function _importDocxByHeading(nodes, baseName) {
  const rawChapters = [];
  let cur = null;

  for (let i = 0; i < nodes.length; i++) {
    if (i % 100 === 0) await new Promise(r => setTimeout(r, 0));
    const node = nodes[i];
    const tag = node.nodeName;
    const text = (node.textContent || '').trim();

    if (tag === 'H1') {
      if (cur) rawChapters.push(cur);
      cur = { title: text, lines: [] };
    } else {
      if (!cur) cur = { title: baseName, lines: [] };
      const lines = _mammothBlockToLines(node);
      lines.forEach(l => { if (l !== null && l !== undefined) cur.lines.push(l); });
    }
  }
  if (cur) rawChapters.push(cur);

  // กรองบทที่มีเนื้อหา
  const validChapters = rawChapters
    .map(c => ({ title: c.title, content: c.lines.filter(l => l.length > 0).join('\n') }))
    .filter(c => c.content.trim().length > 0 || c.title !== baseName);

  if (validChapters.length === 0) { showToast('❌ ไม่พบเนื้อหาในไฟล์'); return; }

  const addMode = confirm(`พบ ${validChapters.length} บท (แบ่งตาม Heading 1)\n\nเพิ่มเข้าโปรเจกต์ปัจจุบัน หรือสร้างโปรเจกต์ใหม่?\n(OK = เพิ่ม, Cancel = ใหม่)`);
  if (!addMode) chapters = [];

  for (let i = 0; i < validChapters.length; i++) {
    if (i % 10 === 0) await new Promise(r => setTimeout(r, 0));
    const c = validChapters[i];
    const id = 'ch_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
    chapters.push({ id, title: c.title, content: c.content, fontSize: null, lineHeight: null, align: null, font: null });
  }

  currentChapterId = chapters[chapters.length - validChapters.length].id;
  renderChapterList();
  selectChapter(currentChapterId);
  updatePreview();
  updateStats();
  showToast(`✅ นำเข้า ${validChapters.length} บทเรียบร้อย (รักษา bold/italic)`);
}

// นำเข้าไฟล์ที่ไม่มี H1 → ทั้งหมดเป็น 1 บท หรือแบ่งตาม text pattern
async function _importDocxNoHeading(nodes, baseName, tryMultiChapter) {
  // รวม markup ทั้งหมดก่อน
  const allLines = [];
  for (let i = 0; i < nodes.length; i++) {
    if (i % 100 === 0) await new Promise(r => setTimeout(r, 0));
    const lines = _mammothBlockToLines(nodes[i]);
    lines.forEach(l => { if (l) allLines.push(l); });
  }

  if (tryMultiChapter) {
    // ลองแบ่งตาม text pattern เหมือน txt import
    const chapterHeadRe = /^(?:={2,}\s*(.+?)\s*={2,}|(บทที่\s*\d+[^\n]*)|(บท\s*\d+[^\n]*)|(chapter\s*\d+[^\n]*))$/i;
    const rawChapters = [];
    let cur = null;
    for (const line of allLines) {
      const m = line.match(chapterHeadRe);
      if (m) {
        if (cur) rawChapters.push(cur);
        const title = (m[1] || m[2] || m[3] || m[4] || line).trim();
        cur = { title, lines: [] };
      } else {
        if (!cur) cur = { title: baseName, lines: [] };
        cur.lines.push(line);
      }
    }
    if (cur) rawChapters.push(cur);
    const validChapters = rawChapters
      .map(c => ({ title: c.title, content: c.lines.filter(l => l.length > 0).join('\n') }))
      .filter(c => c.content.trim().length > 0);

    if (validChapters.length > 1) {
      const addMode = confirm(`พบ ${validChapters.length} บท\n\nเพิ่มเข้าโปรเจกต์ปัจจุบัน หรือสร้างโปรเจกต์ใหม่?\n(OK = เพิ่ม, Cancel = ใหม่)`);
      if (!addMode) chapters = [];
      for (const c of validChapters) {
        const id = 'ch_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
        chapters.push({ id, title: c.title, content: c.content, fontSize: null, lineHeight: null, align: null, font: null });
      }
      currentChapterId = chapters[chapters.length - validChapters.length].id;
      renderChapterList(); selectChapter(currentChapterId); updatePreview(); updateStats();
      showToast(`✅ นำเข้า ${validChapters.length} บทเรียบร้อย`);
      return;
    }
  }

  // Single chapter
  const content = allLines.filter(l => l.length > 0).join('\n');
  const addMode = confirm(`นำเข้าเป็น 1 บท: "${baseName}"\n\nเพิ่มเข้าโปรเจกต์ปัจจุบัน หรือสร้างโปรเจกต์ใหม่?\n(OK = เพิ่ม, Cancel = ใหม่)`);
  if (!addMode) chapters = [];
  const id = 'ch_' + Date.now();
  chapters.push({ id, title: baseName, content, fontSize: null, lineHeight: null, align: null, font: null });
  currentChapterId = id;
  renderChapterList(); selectChapter(id); updatePreview(); updateStats();
  showToast(`✅ นำเข้า "${baseName}" เรียบร้อย (รักษา bold/italic)`);
}

function openSearch() {
  document.getElementById('searchModal').classList.add('open');
  setTimeout(() => document.getElementById('searchInput').focus(), 100);
}
function closeSearch() {
  document.getElementById('searchModal').classList.remove('open');
}

// ── Focus Mode ──
function toggleFocusMode() {
  document.body.classList.toggle('focus-mode');
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && document.body.classList.contains('focus-mode')) toggleFocusMode();
  if (e.key === 'Escape' && document.getElementById('searchModal').classList.contains('open')) closeSearch();
  // Undo / Redo — let browser handle inside WYSIWYG editor, intercept elsewhere
  if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
    const ed = document.getElementById('chapterEditor');
    if (document.activeElement !== ed) { e.preventDefault(); historyUndo(); }
  }
  if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
    const ed = document.getElementById('chapterEditor');
    if (document.activeElement !== ed) { e.preventDefault(); historyRedo(); }
  }
});

document.addEventListener('mousedown', (e) => {
  const bar = document.getElementById('inlineFmtBar');
  if (bar && !bar.contains(e.target) && e.target.id !== 'chapterEditor') {
    hideInlineFmtBar();
  }
});

// ── Chapter management ──
function renderChapterList() {
  const list = document.getElementById('chapterList');
  list.innerHTML = '';
  chapters.forEach((ch, i) => {
    const el = document.createElement('div');
    el.className = 'chapter-item' + (ch.id === currentChapterId ? ' active' : '');
    el.draggable = true;
    el.dataset.chId = ch.id;
    el.innerHTML = `
      <span class="ch-drag" title="ลากเพื่อสลับตำแหน่ง">⠿</span>
      <div class="ch-move-btns">
        <button class="ch-move-btn ch-move-up" title="เลื่อนขึ้น">▲</button>
        <button class="ch-move-btn ch-move-dn" title="เลื่อนลง">▼</button>
      </div>
      <div class="ch-num">${i + 1}</div>
      <div class="ch-title" title="แตะสองครั้งหรือกดปุ่ม ✏ เพื่อแก้ชื่อ">${ch.title || 'บทที่ ' + (i+1)}</div>
      <button class="ch-edit-btn" title="แก้ไขชื่อบท">✏</button>
      <span class="ch-del" title="ลบบท">×</span>
    `;

    // ── ฟังก์ชัน inline edit ──
    const startEdit = () => {
      const titleEl = el.querySelector('.ch-title');
      if (!titleEl) return;
      const input = document.createElement('input');
      input.className = 'ch-title-input';
      input.value = ch.title || '';
      input.placeholder = 'ชื่อบท...';
      titleEl.replaceWith(input);
      input.focus();
      input.select();
      const save = () => {
        const newTitle = input.value.trim() || ('บทที่ ' + (i + 1));
        ch.title = newTitle;
        renderChapterList();
        updatePreview();
        updateStats();
        recordHistoryDebounced();
        if (ch.id === currentChapterId) {
          const ti = document.getElementById('chapterTitleInput');
          if (ti) ti.value = newTitle;
        }
      };
      input.addEventListener('blur', save);
      input.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter') { ev.preventDefault(); input.blur(); }
        if (ev.key === 'Escape') { input.value = ch.title || ''; input.blur(); }
      });
    };

    // คลิกเลือกบท
    el.addEventListener('click', (e) => {
      if (e.target.classList.contains('ch-del')) return;
      if (e.target.classList.contains('ch-drag')) return;
      if (e.target.classList.contains('ch-title-input')) return;
      if (e.target.classList.contains('ch-edit-btn')) return;
      if (e.target.classList.contains('ch-move-btn') || e.target.classList.contains('ch-move-up') || e.target.classList.contains('ch-move-dn')) return;
      selectChapter(ch.id);
    });

    // ดับเบิลคลิก ch-title → inline edit (desktop)
    el.querySelector('.ch-title').addEventListener('dblclick', (e) => {
      e.stopPropagation();
      startEdit();
    });

    // ปุ่ม ✏ → inline edit (mobile-friendly)
    el.querySelector('.ch-edit-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      startEdit();
    });

    // ปุ่มเลื่อนขึ้น
    el.querySelector('.ch-move-up').addEventListener('click', (e) => {
      e.stopPropagation();
      if (i === 0) return;
      const [moved] = chapters.splice(i, 1);
      chapters.splice(i - 1, 0, moved);
      renderChapterList();
      updatePreview();
      updateStats();
      recordHistoryDebounced();
      showToast('↑ เลื่อนบทขึ้นแล้ว');
    });

    // ปุ่มเลื่อนลง
    el.querySelector('.ch-move-dn').addEventListener('click', (e) => {
      e.stopPropagation();
      if (i === chapters.length - 1) return;
      const [moved] = chapters.splice(i, 1);
      chapters.splice(i + 1, 0, moved);
      renderChapterList();
      updatePreview();
      updateStats();
      recordHistoryDebounced();
      showToast('↓ เลื่อนบทลงแล้ว');
    });

    // ลบบท
    el.querySelector('.ch-del').addEventListener('click', (e) => {
      e.stopPropagation();
      deleteChapter(ch.id, e);
    });

    // ── Drag & Drop (desktop) ──
    el.addEventListener('dragstart', (e) => {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', ch.id);
      el.classList.add('dragging');
    });
    el.addEventListener('dragend', () => {
      el.classList.remove('dragging');
      list.querySelectorAll('.chapter-item').forEach(x => x.classList.remove('drag-over'));
    });
    el.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      list.querySelectorAll('.chapter-item').forEach(x => x.classList.remove('drag-over'));
      el.classList.add('drag-over');
    });
    el.addEventListener('dragleave', () => el.classList.remove('drag-over'));
    el.addEventListener('drop', (e) => {
      e.preventDefault();
      el.classList.remove('drag-over');
      const fromId = e.dataTransfer.getData('text/plain');
      const toId = ch.id;
      if (fromId === toId) return;
      const fromIdx = chapters.findIndex(c => c.id === fromId);
      const toIdx   = chapters.findIndex(c => c.id === toId);
      if (fromIdx < 0 || toIdx < 0) return;
      const [moved] = chapters.splice(fromIdx, 1);
      chapters.splice(toIdx, 0, moved);
      renderChapterList();
      updatePreview();
      updateStats();
      recordHistoryDebounced();
      showToast('↕ สลับตำแหน่งบทแล้ว');
    });

    // ── Touch Drag & Drop (mobile) ──
    let touchDragId = null;
    let touchPlaceholder = null;
    el.querySelector('.ch-drag').addEventListener('touchstart', (e) => {
      e.stopPropagation();
      touchDragId = ch.id;
      el.classList.add('dragging');
      touchPlaceholder = document.createElement('div');
      touchPlaceholder.style.cssText = 'height:' + el.offsetHeight + 'px;border:1.5px dashed var(--accent);border-radius:4px;margin-bottom:2px;background:rgba(139,69,19,0.04)';
    }, { passive: true });
    el.querySelector('.ch-drag').addEventListener('touchmove', (e) => {
      if (!touchDragId) return;
      const touch = e.touches[0];
      const target = document.elementFromPoint(touch.clientX, touch.clientY);
      const targetItem = target && target.closest('.chapter-item');
      list.querySelectorAll('.chapter-item').forEach(x => x.classList.remove('drag-over'));
      if (targetItem && targetItem !== el) targetItem.classList.add('drag-over');
    }, { passive: true });
    el.querySelector('.ch-drag').addEventListener('touchend', (e) => {
      if (!touchDragId) return;
      el.classList.remove('dragging');
      list.querySelectorAll('.chapter-item').forEach(x => x.classList.remove('drag-over'));
      const touch = e.changedTouches[0];
      const target = document.elementFromPoint(touch.clientX, touch.clientY);
      const targetItem = target && target.closest('.chapter-item');
      if (targetItem && targetItem.dataset.chId && targetItem.dataset.chId !== touchDragId) {
        const fromIdx = chapters.findIndex(c => c.id === touchDragId);
        const toIdx   = chapters.findIndex(c => c.id === targetItem.dataset.chId);
        if (fromIdx >= 0 && toIdx >= 0) {
          const [moved] = chapters.splice(fromIdx, 1);
          chapters.splice(toIdx, 0, moved);
          renderChapterList();
          updatePreview();
          updateStats();
          recordHistoryDebounced();
          showToast('↕ สลับตำแหน่งบทแล้ว');
        }
      }
      touchDragId = null;
    }, { passive: true });

    list.appendChild(el);
  });
}

function selectChapter(id) {
  currentChapterId = id;
  const ch = chapters.find(c => c.id === id);
  if (!ch) return;
  document.getElementById('chapterTitleInput').value = ch.title;
  weLoad(ch.content);
  document.getElementById('chapterNote').value = ch.note || '';
  // Chapter image
  const wrap = document.getElementById('chImgPreviewWrap');
  const drop = document.getElementById('chImgDrop');
  if (ch.imageData) {
    document.getElementById('chImgPreview').src = ch.imageData;
    document.getElementById('chImgSize').value = ch.imageSize || 100;
    document.getElementById('chImgSizeVal').textContent = (ch.imageSize || 100) + '%';
    wrap.style.display = 'block'; drop.style.display = 'none';
  } else {
    wrap.style.display = 'none'; drop.style.display = 'block';
  }
  renderChapterList();
  updatePreview();
  // After preview renders, jump to the first page of this chapter
  if (viewMode !== 'scroll') {
    setTimeout(() => {
      const zw = document.getElementById('zoomWrap');
      // Find page-label whose text starts with the chapter index
      const chIdx = chapters.findIndex(c => c.id === id);
      if (chIdx < 0) return;
      const labelText = `บทที่ ${chIdx + 1}`;
      const labels = Array.from(zw.querySelectorAll('.page-label'));
      const targetLabel = labels.find(l => l.textContent.trim().startsWith(labelText));
      if (!targetLabel) return;
      const units = collectPageUnits();
      const unitIdx = units.findIndex(u => u.label === targetLabel);
      if (unitIdx >= 0) {
        currentPageIndex = viewMode === 'spread' ? Math.floor(unitIdx / 2) * 2 : unitIdx;
        applyViewMode();
      }
    }, 50);
  }
}

function updateChapterTitle(val) {
  const ch = chapters.find(c => c.id === currentChapterId);
  if (ch) { ch.title = val; renderChapterList(); updatePreview(); updateStats(); }
  recordHistoryDebounced();
  if (typeof autoSaveDebounce === 'function') autoSaveDebounce();
}

// ═══════════════════════════════════════════════
// WYSIWYG EDITOR ENGINE
// ═══════════════════════════════════════════════

function weGetEditor() { return document.getElementById('chapterEditor'); }

// Convert editor HTML → plain markup string (for storage & preview)
function weToMarkup(html) {
  // Use a temp div to parse
  const d = document.createElement('div');
  d.innerHTML = html;
  // Convert each block to a line
  const lines = [];
  d.childNodes.forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      const t = node.textContent;
      if (t.trim()) lines.push(t);
    } else if (node.classList && node.classList.contains('we-pagebreak')) {
      lines.push('[PAGE_BREAK]');
    } else {
      lines.push(weNodeToMarkup(node));
    }
  });
  return lines.join('\n');
}

function weNodeToMarkup(node) {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent;
  if (node.classList && node.classList.contains('we-pagebreak')) return '[PAGE_BREAK]';
  let text = '';
  node.childNodes.forEach(c => { text += weNodeToMarkup(c); });
  const tag = node.tagName ? node.tagName.toLowerCase() : '';
  const style = node.getAttribute ? (node.getAttribute('style') || '') : '';
  if (tag === 'strong' || tag === 'b') return `**${text}**`;
  if (tag === 'em' || tag === 'i') return `_${text}_`;
  if (tag === 'u') return `__${text}__`;
  if (tag === 'mark') return `==${text}==`;
  if (tag === 'span') {
    const colorM = style.match(/color:\s*([#\w(),-]+)/);
    const sizeM = style.match(/font-size:\s*(\d+)px/);
    const fontM = style.match(/font-family:\s*'?([^',;]+)/);
    if (sizeM) return `<size:${sizeM[1]}>${text}</size>`;
    if (colorM && !sizeM) return `<color:${colorM[1]}>${text}</color>`;
    if (fontM) return `<font:${fontM[1].trim()}>${text}</font>`;
    // gold italic («»)
    if (style.includes('var(--gold)')) return `«${text}»`;
    return text;
  }
  // blockquote from execCommand('indent') — preserve as Thai indent prefix
  if (tag === 'blockquote') return '\u3000' + text;
  if (tag === 'code') return `\`${text}\``;
  if (tag === 'br') return '\n';
  // div/p with margin-left (from indent button)
  if ((tag === 'div' || tag === 'p') && style.match(/margin-left:\s*\d/)) {
    const indentLevels = Math.round(parseFloat(style.match(/margin-left:\s*([\d.]+)px/)?.[1] || 0) / 40);
    return '\u3000'.repeat(Math.max(1, indentLevels)) + text;
  }
  return text;
}

// Convert markup string → editor HTML
function weFromMarkup(markup) {
  const lines = markup.split('\n');
  return lines.map(line => {
    if (line.trim() === '[PAGE_BREAK]') {
      return `<div class="we-pagebreak" contenteditable="false">— ↵ ตัดหน้า —</div>`;
    }
    // Preserve lines that have only whitespace/indent (e.g. Thai \u3000) as non-empty paragraphs
    if (!line.trim()) return `<p><br></p>`;
    return `<p>${parseRichText(line)}</p>`;
  }).join('');
}

// Load chapter content into WYSIWYG editor
function weLoad(markup) {
  const ed = weGetEditor();
  if (!ed) return;
  ed.innerHTML = markup ? weFromMarkup(markup) : '';
  // Place cursor at end
}

// On editor input — sync to chapter data
function weOnInput() {
  const ed = weGetEditor();
  if (!ed) return;
  const markup = weToMarkup(ed.innerHTML);
  const ch = chapters.find(c => c.id === currentChapterId);
  if (ch) {
    ch.content = markup;
    _fastUpdatePageBodies(currentChapterId, markup);
    updateStats();
  }
  recordHistoryDebounced();
  if (typeof autoSaveDebounce === 'function') autoSaveDebounce();
  _scheduleFullRender();
}

// Apply rich-text format to current selection
function weFormat(type) {
  // Work on whichever contenteditable has active selection: chapterEditor OR page-body
  let sel = window.getSelection();

  // For 'size' and 'color': clicking the button can clear the selection.
  // Restore from _savedSel if needed.
  if ((type === 'size' || type === 'color') && window._savedSel) {
    try {
      sel.removeAllRanges();
      sel.addRange(window._savedSel);
    } catch(e) {}
  }

  if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
    showToast('กรุณาคลุมข้อความก่อน'); return;
  }
  const range = sel.getRangeAt(0);
  const anchorNode = sel.anchorNode;

  // Determine context: chapterEditor or page-body
  const ed = weGetEditor();
  const inEditor   = ed && ed.contains(anchorNode);
  const pageBodyEl = anchorNode?.parentElement?.closest('.page-body');
  const inPageBody = !!pageBodyEl;

  if (!inEditor && !inPageBody) {
    showToast('กรุณาคลุมข้อความก่อน'); return;
  }

  const selectedText = range.toString();
  if (!selectedText) { showToast('กรุณาคลุมข้อความก่อน'); return; }

  let node;
  switch(type) {
    case 'bold': {
      node = document.createElement('strong');
      node.style.fontWeight = '700';
      node.style.color = 'var(--accent)';
      break;
    }
    case 'italic': {
      node = document.createElement('em');
      break;
    }
    case 'underline': {
      node = document.createElement('u');
      break;
    }
    case 'highlight': {
      node = document.createElement('mark');
      node.style.cssText = 'background:rgba(201,162,39,0.25);border-radius:2px;padding:0 2px';
      break;
    }
    case 'color': {
      const color = document.getElementById('ifbColor')?.value || '#8b4513';
      node = document.createElement('span');
      node.style.color = color;
      document.getElementById('ifbColorSwatch').style.background = color;
      break;
    }
    case 'size': {
      const sz = parseInt(document.getElementById('ifbSize')?.value) || 15;
      // Use a robust approach: wrap with span but handle cross-element selections properly
      const frag = range.extractContents();
      const wrapper = document.createElement('span');
      wrapper.style.fontSize = sz + 'px';
      wrapper.appendChild(frag);
      range.insertNode(wrapper);
      // Collapse selection to end of inserted node
      range.setStartAfter(wrapper);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
      if (inPageBody) syncPageBodyToChapter(pageBodyEl, pageBodyEl.dataset.chId);
      else weOnInput();
      hideInlineFmtBar();
      return;
    }
    case 'quote': {
      node = document.createElement('span');
      node.style.cssText = 'font-style:italic;color:var(--gold)';
      node.textContent = `«${selectedText}»`;
      range.deleteContents();
      range.insertNode(node);
      sel.removeAllRanges();
      if (inPageBody) syncPageBodyToChapter(pageBodyEl, pageBodyEl.dataset.chId);
      else weOnInput();
      hideInlineFmtBar(); return;
    }
    case 'cmd': {
      node = document.createElement('code');
      node.style.cssText = 'font-family:monospace;background:rgba(139,69,19,0.1);border-radius:3px;padding:0 4px;font-size:0.88em';
      break;
    }
    case 'clear': {
      const text = selectedText;
      range.deleteContents();
      range.insertNode(document.createTextNode(text));
      sel.removeAllRanges();
      if (inPageBody) syncPageBodyToChapter(pageBodyEl, pageBodyEl.dataset.chId);
      else weOnInput();
      hideInlineFmtBar(); return;
    }
    default: return;
  }
  if (node) {
    try {
      range.surroundContents(node);
    } catch(e) {
      // partial selection across tags — extract and re-wrap
      const frag = range.extractContents();
      node.appendChild(frag);
      range.insertNode(node);
    }
    sel.removeAllRanges();
  }
  if (inPageBody) {
    syncPageBodyToChapter(pageBodyEl, pageBodyEl.dataset.chId);
  } else {
    weOnInput();
  }
  hideInlineFmtBar();
}

// Insert special elements at cursor
function weInsert(type) {
  const ed = weGetEditor();
  if (!ed) return;
  ed.focus();
  const sel = window.getSelection();
  const range = sel && sel.rangeCount > 0 ? sel.getRangeAt(0) : null;

  switch(type) {
    case 'quote': document.execCommand('insertText', false, '«»'); break;
    case 'dquote': document.execCommand('insertText', false, '\u201c\u201d'); break;
    case 'para': document.execCommand('insertParagraph', false); break;
    case 'break': {
      const br = document.createElement('p');
      br.textContent = '— ✦ —';
      br.style.textAlign = 'center';
      if (range) { range.collapse(false); range.insertNode(br); range.setStartAfter(br); range.collapse(true); sel.removeAllRanges(); sel.addRange(range); }
      break;
    }
    case 'pagebreak': {
      const pb = document.createElement('div');
      pb.className = 'we-pagebreak';
      pb.contentEditable = 'false';
      pb.textContent = '— ↵ ตัดหน้า —';
      const after = document.createElement('p');
      after.innerHTML = '<br>';
      if (range) {
        range.collapse(false);
        range.insertNode(after);
        range.insertNode(pb);
        range.setStart(after, 0); range.collapse(true);
        sel.removeAllRanges(); sel.addRange(range);
      }
      break;
    }
  }
  weOnInput();
}

// Inline format bar: use weFormat instead of applyInlineFmt for WYSIWYG
function applyInlineFmt(type) {
  weFormat(type);
}

// Apply a specific color to selection (called from format-bar color picker)
function weFormatColor(color) {
  const sel = window.getSelection();
  if (!sel || sel.isCollapsed) return;
  const anchorNode = sel.anchorNode;
  const ed = weGetEditor();
  const inEditor   = ed && ed.contains(anchorNode);
  const pageBodyEl = anchorNode?.parentElement?.closest('.page-body');
  if (!inEditor && !pageBodyEl) return;
  const range = sel.getRangeAt(0);
  const node = document.createElement('span');
  node.style.color = color;
  try { range.surroundContents(node); } catch(e) {
    const frag = range.extractContents();
    node.appendChild(frag);
    range.insertNode(node);
  }
  sel.removeAllRanges();
  if (pageBodyEl) syncPageBodyToChapter(pageBodyEl, pageBodyEl.dataset.chId);
  else weOnInput();
}

// Apply a specific font-size to selection (called from format-bar size input)
function weFormatSize(size) {
  const sz = parseInt(size);
  if (!sz || sz < 6) return;
  const sel = window.getSelection();
  if (!sel || sel.isCollapsed) { showToast('กรุณาคลุมข้อความก่อน'); return; }
  const anchorNode = sel.anchorNode;
  const ed = weGetEditor();
  const inEditor   = ed && ed.contains(anchorNode);
  const pageBodyEl = anchorNode?.parentElement?.closest('.page-body');
  if (!inEditor && !pageBodyEl) { showToast('กรุณาคลุมข้อความในหน้าหรือในแผงแก้ไขก่อน'); return; }
  const range = sel.getRangeAt(0);
  const frag = range.extractContents();
  const wrapper = document.createElement('span');
  wrapper.style.fontSize = sz + 'px';
  wrapper.appendChild(frag);
  range.insertNode(wrapper);
  range.setStartAfter(wrapper);
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
  if (pageBodyEl) syncPageBodyToChapter(pageBodyEl, pageBodyEl.dataset.chId);
  else weOnInput();
}

// ═══════════════════════════════════════════════
let _renderDebounceTimer = null;
function _scheduleFullRender() {
  clearTimeout(_renderDebounceTimer);
  _renderDebounceTimer = setTimeout(() => { updatePreview(); }, 900);
}

// Fast partial update: re-render only the page-body paragraphs for current chapter
function _fastUpdatePageBodies(chId, content) {
  const paras = content.split('\n').filter(p => p.trim() && p.trim() !== '[PAGE_BREAK]');
  document.querySelectorAll(`.page-body[data-ch-id="${chId}"]`).forEach(bodyEl => {
    const pi = parseInt(bodyEl.dataset.pi) || 0;
    // Collect existing <p> elements and update their innerHTML in-place
    const pEls = bodyEl.querySelectorAll('p:not([data-placeholder])');
    // Simple: rebuild innerHTML of body (fast, no layout measurement)
    const dropCapColor2 = window.dropCapColor || 'var(--accent)';
    const _dropCap = window.dropCap;
    const _dropCapFont = window.dropCapFont || 'Playfair Display';
    const _dropCapSize = window.dropCapSize || 48;
    const dropCapSpanStyle = _dropCap
      ? `font-family:'${_dropCapFont}',serif;font-size:${_dropCapSize}px;font-weight:700;line-height:0.75;float:left;margin:2px 6px 0 0;color:${dropCapColor2};display:block;`
      : null;
    // Find which paras belong to this page (use existing count as hint)
    // We only refresh innerHTML of existing paragraphs to avoid layout shift
    let pIdx = 0;
    pEls.forEach(pEl => {
      const para = paras[pIdx];
      if (para !== undefined) {
        const isSection = para.trim() === '— ✦ —' || para.trim() === '* * *';
        if (isSection) {
          pEl.style.textAlign = 'center';
          pEl.innerHTML = para;
        } else if (pIdx === 0 && dropCapSpanStyle && pi === 0) {
          const parsed = parseRichText(para);
          const m = parsed.match(/^(<[^>]+>)*(.)/);
          if (m && m[2]) {
            const prefix = m[1] || '';
            pEl.innerHTML = `${prefix}<span style="${dropCapSpanStyle}">${m[2]}</span>${parsed.slice(prefix.length + m[2].length)}`;
          } else { pEl.innerHTML = parsed; }
        } else {
          pEl.innerHTML = parseRichText(para);
        }
        pIdx++;
      }
    });
  });
}

function updateChapterContent(val) {
  const ch = chapters.find(c => c.id === currentChapterId);
  if (ch) {
    ch.content = val;
    // Instant visual update of existing page bodies (no re-layout)
    _fastUpdatePageBodies(currentChapterId, val);
    updateStats();
  }
  recordHistoryDebounced();
  if (typeof autoSaveDebounce === 'function') autoSaveDebounce();
  // Full re-render (with page-splitting) after user stops typing
  _scheduleFullRender();
}

// ── Tab key → ย่อหน้าแบบไทย (WYSIWYG editor) ──
document.addEventListener('DOMContentLoaded', () => {
  const ed = document.getElementById('chapterEditor');
  if (!ed) return;
  ed.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      document.execCommand('insertText', false, '\u3000'); // full-width Thai indent
    }
  });
});

function addChapter() {
  recordHistory();
  // Blur any active page-body so renderChapterPages() guard doesn't skip the new chapter
  if (document.activeElement && document.activeElement.classList.contains('page-body')) {
    document.activeElement.blur();
  }
  const newId = Date.now();
  chapters.push({ id: newId, title: 'บทใหม่', content: '', note: '', imageData: null, imageSize: 100 });
  _forceRenderChapterPages = true;
  selectChapter(newId);
  // Ensure the chapter list is visible (expand sidebar section if collapsed)
  const chapterSection = document.getElementById('chapterList')?.closest('.sidebar-section');
  if (chapterSection && chapterSection.classList.contains('collapsed')) {
    chapterSection.classList.remove('collapsed');
  }
  // On mobile, open left panel if hidden
  const sidebar = document.querySelector('.sidebar');
  if (sidebar && sidebar.classList.contains('collapsed-panel')) {
    togglePanel('left');
  }
  showToast('✅ เพิ่มบทใหม่แล้ว — กรุณาแก้ไขชื่อและเนื้อหา');
}

function deleteChapter(id, e) {
  e.stopPropagation();
  if (chapters.length === 1) { showToast('ต้องมีอย่างน้อย 1 บท'); return; }
  recordHistory();
  chapters = chapters.filter(c => c.id !== id);
  if (currentChapterId === id) selectChapter(chapters[0].id);
  else { renderChapterList(); updatePreview(); updateStats(); }
}

// ── Cover upload ──
function handleCoverUpload(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    coverImageData = e.target.result;
    document.getElementById('coverPreview').src = coverImageData;
    document.getElementById('coverPreview').style.display = 'block';
    document.getElementById('coverPlaceholder').style.display = 'none';
    document.getElementById('coverDrop').classList.add('has-image');
    const bg = document.getElementById('coverBg');
    bg.style.backgroundImage = `url(${coverImageData})`;
    bg.style.backgroundSize = 'cover';
    bg.style.backgroundPosition = 'center';
    // Apply current brightness inline
    const bv = document.getElementById('coverBrightness')?.value || 100;
    bg.style.filter = `brightness(${bv / 100})`;
    const ov = document.querySelector('.cover-overlay');
    const ovv = document.getElementById('coverOverlay')?.value || 100;
    if (ov) ov.style.opacity = ovv / 100;
  };
  reader.readAsDataURL(file);
}

// ── Cover brightness / overlay ──
function updateCoverBrightness(val) {
  document.getElementById('coverBrightnessVal').textContent = val + '%';
  document.documentElement.style.setProperty('--cover-brightness', val / 100);
  // Also set directly so html2canvas captures it
  const bg = document.getElementById('coverBg');
  if (bg) bg.style.filter = `brightness(${val / 100})`;
}
function updateCoverOverlay(val) {
  document.getElementById('coverOverlayVal').textContent = val + '%';
  document.documentElement.style.setProperty('--cover-overlay-opacity', val / 100);
  // Also set directly so html2canvas captures it
  const ov = document.querySelector('.cover-overlay');
  if (ov) ov.style.opacity = val / 100;
}

// ── Cover template ──
function setCoverTemplate(name, el) {
  coverTemplate = name;
  document.querySelectorAll('.cover-tpl').forEach(t => t.classList.remove('active'));
  if (el) el.classList.add('active');
  const tpl = coverTemplates[name];
  if (!coverImageData) {
    // Apply gradient to coverBg so it shows correctly
    const bg = document.getElementById('coverBg');
    if (bg) {
      bg.style.backgroundImage = '';
      bg.style.background = tpl.bg;
    }
    document.getElementById('pageCover').style.background = tpl.bg;
  }
  updatePreview();
}

// ── Chapter image ──
function handleChapterImage(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const ch = chapters.find(c => c.id === currentChapterId);
    if (!ch) return;
    ch.imageData = e.target.result;
    ch.imageSize = 100;
    ch.imagePosition = 'top';
    document.getElementById('chImgPreview').src = e.target.result;
    document.getElementById('chImgSize').value = 100;
    document.getElementById('chImgSizeVal').textContent = '100%';
    document.getElementById('chImgPreviewWrap').style.display = 'block';
    document.getElementById('chImgDrop').style.display = 'none';
    // Reset position buttons
    document.querySelectorAll('.ch-img-pos-btn').forEach(b=>b.classList.remove('active'));
    const topBtn = document.getElementById('imgpos-top');
    if (topBtn) topBtn.classList.add('active');
    updatePreview();
  };
  reader.readAsDataURL(file);
}
function updateChapterImageSize(val) {
  document.getElementById('chImgSizeVal').textContent = val + '%';
  const ch = chapters.find(c => c.id === currentChapterId);
  if (ch) { ch.imageSize = parseInt(val); updatePreview(); }
}
function removeChapterImage() {
  const ch = chapters.find(c => c.id === currentChapterId);
  if (ch) { ch.imageData = null; ch.imageSize = 100; }
  document.getElementById('chImgPreviewWrap').style.display = 'none';
  document.getElementById('chImgDrop').style.display = 'block';
  updatePreview();
}

// ── Body font ──
function setBodyFont(font, el) {
  bodyFont = font;
  document.querySelectorAll('.font-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  renderChapterPages();
}

// ── Divider helper ──
function getDividerHTML() {
  const style = document.getElementById('dividerStyle')?.value || 'line';
  const color = `var(--accent)`;
  switch(style) {
    case 'none':      return '';
    case 'line':      return `<div class="divider-line" style="background:${color}"></div>`;
    case 'double':    return `<div class="divider-double" style="border-color:${color}"></div>`;
    case 'dots':      return `<div class="divider-dots">· · ·</div>`;
    case 'asterism':  return `<div class="divider-asterism">⁂</div>`;
    case 'wave':      return `<div class="divider-wave">〜〜〜</div>`;
    case 'diamond':   return `<div class="divider-diamond">◆ ◇ ◆</div>`;
    case 'fleuron':   return `<div class="divider-fleuron">❧</div>`;
    // ── แนวใหม่ ──
    case 'sparkle':   return `<div class="divider-dots" style="color:var(--accent);letter-spacing:0.5em;font-size:13px">✦ ✧ ✦</div>`;
    case 'star':      return `<div class="divider-dots" style="color:var(--accent);letter-spacing:0.4em;font-size:14px">★ ☆ ★</div>`;
    case 'heart':     return `<div class="divider-dots" style="color:var(--accent);letter-spacing:0.5em;font-size:14px">♡ ♥ ♡</div>`;
    case 'sakura':    return `<div class="divider-dots" style="color:var(--accent);letter-spacing:0.4em;font-size:13px">🌸 · 🌸</div>`;
    case 'moon':      return `<div class="divider-dots" style="color:var(--accent);letter-spacing:0.5em;font-size:13px">☽ ✦ ☾</div>`;
    case 'sword':     return `<div class="divider-dots" style="color:var(--accent);letter-spacing:0.5em;font-size:13px">⚔ · · · ⚔</div>`;
    case 'dragon':    return `<div class="divider-dots" style="color:var(--accent);letter-spacing:0.3em;font-size:12px">— 龍 —</div>`;
    case 'rose':      return `<div class="divider-dots" style="color:var(--accent);letter-spacing:0.4em;font-size:13px">🌹 · · 🌹</div>`;
    case 'ribbon':    return `<div class="divider-dots" style="color:var(--accent);font-size:11px">—— 🎀 ——</div>`;
    case 'cross':     return `<div class="divider-dots" style="color:var(--accent);letter-spacing:0.5em;font-size:13px">✝ · · ✝</div>`;
    case 'butterfly': return `<div class="divider-dots" style="color:var(--accent);letter-spacing:0.4em;font-size:13px">🦋 · 🦋</div>`;
    case 'cat':       return `<div class="divider-dots" style="color:var(--accent);letter-spacing:0.4em;font-size:13px">≧^◡^≦</div>`;
    case 'thunder':   return `<div class="divider-dots" style="color:var(--accent);letter-spacing:0.4em;font-size:14px">⚡ · · ⚡</div>`;
    case 'custom_div':return customDividerHTML || `<div class="divider-line" style="background:${color}"></div>`;
    default:          return `<div class="divider-line" style="background:${color}"></div>`;
  }
}
let customDividerHTML = '';

// ── Preview update ──
function updatePreview() {
  const title = document.getElementById('bookTitle').value;
  const subtitle = document.getElementById('bookSubtitle').value;
  const author = document.getElementById('authorName').value;
  const pen = document.getElementById('penName').value;
  const pub = document.getElementById('publisher').value;
  const year = document.getElementById('pubYear').value;
  const genre = document.getElementById('genre').value;

  document.getElementById('coverGenre').textContent = genre;
  document.getElementById('coverTitleDisplay').textContent = title;
  document.getElementById('coverSubtitleDisplay').textContent = subtitle;
  document.getElementById('coverAuthorDisplay').textContent = pen || author;
  document.getElementById('coverPublisherDisplay').textContent = pub;

  updateTitlePage();

  // Special pages toggles
  const showPreface = document.getElementById('showPreface').checked;
  const showDedication = document.getElementById('showDedication').checked;
  document.getElementById('prefaceFields').style.display = showPreface ? 'block' : 'none';
  document.getElementById('dedicationFields').style.display = showDedication ? 'block' : 'none';

  // Cover template (no image)
  if (!coverImageData) {
    const tpl = coverTemplates[coverTemplate] || coverTemplates.dark;
    const bg = document.getElementById('coverBg');
    if (bg) { bg.style.backgroundImage = ''; bg.style.background = tpl.bg; }
    document.getElementById('pageCover').style.background = tpl.bg;
  }

  renderSpecialPages();
  renderChapterPages();
}

let tocStyle = 'classic';
let titlePageLayout = 'center'; // 'center' | 'left' | 'bottom'

function setTitlePageLayout(layout, el) {
  titlePageLayout = layout;
  document.querySelectorAll('#tplayout-center,#tplayout-left,#tplayout-bottom').forEach(b => b.classList.remove('active'));
  if (el) el.classList.add('active');
  updateTitlePage();
}

function updateTitlePage() {
  const title    = (document.getElementById('titlePageCustomTitle')?.value.trim()    ) || document.getElementById('bookTitle').value;
  const subtitle = (document.getElementById('titlePageCustomSubtitle')?.value.trim() ) || document.getElementById('bookSubtitle').value;
  const author   = (document.getElementById('titlePageCustomAuthor')?.value.trim()   ) || document.getElementById('authorName').value;
  const pen      = (document.getElementById('titlePageCustomPen')?.value.trim()      ) || document.getElementById('penName').value;
  const pub      = document.getElementById('publisher').value;
  const year     = document.getElementById('pubYear').value;
  const pubLine  = (document.getElementById('titlePageCustomPub')?.value.trim()      ) || `${pub} · ${year}`;
  const ornament = document.getElementById('titlePageOrnament')?.value ?? '✦ ✦ ✦';

  const tp = document.getElementById('pageTitlePage');
  if (!tp) return;

  // Apply layout class
  tp.classList.remove('tp-left','tp-bottom');
  if (titlePageLayout === 'left') tp.classList.add('tp-left');
  else if (titlePageLayout === 'bottom') tp.classList.add('tp-bottom');

  const ornEl = tp.querySelector('.title-page-ornament');
  if (ornEl) { ornEl.textContent = ornament; ornEl.style.display = ornament ? '' : 'none'; }
  const titleEl = tp.querySelector('.title-page-title');
  if (titleEl) titleEl.textContent = title;
  const subEl = tp.querySelector('.title-page-subtitle');
  if (subEl) { subEl.textContent = subtitle; subEl.style.display = subtitle ? '' : 'none'; }
  const authEl = tp.querySelector('#titlePageAuthor');
  if (authEl) authEl.textContent = author;
  const yearEl = tp.querySelector('#titlePageYear');
  if (yearEl) { yearEl.textContent = pen ? `(นามปากกา: ${pen})` : ''; yearEl.style.display = pen ? '' : 'none'; }
  const pubEl = tp.querySelector('#titlePagePublisher');
  if (pubEl) pubEl.textContent = pubLine;
}

function setTocStyle(style, el) {
  tocStyle = style;
  document.querySelectorAll('#toc-style-classic,#toc-style-modern,#toc-style-minimal,#toc-style-elegant,#toc-style-boxed,#toc-style-roman,#toc-style-split,#toc-style-ornate').forEach(b => b.classList.remove('active'));
  if (el) el.classList.add('active');
  renderSpecialPages();
  setTimeout(() => applyViewMode(), 0);
}

function renderSpecialPages() {
  // Show/hide TOC style picker
  const showTOCChk = document.getElementById('showTOC').checked;
  const tocStyleRow = document.getElementById('tocStyleRow');
  if (tocStyleRow) tocStyleRow.style.display = showTOCChk ? 'block' : 'none';

  // Remove existing special pages
  document.querySelectorAll('.special-page-wrap').forEach(el => el.remove());

  const showPreface = document.getElementById('showPreface').checked;
  const showDedication = document.getElementById('showDedication').checked;
  const titlePageNode = document.getElementById('pageTitlePage');

  let afterNode = titlePageNode;

  function insertSpecialPage(html) {
    const wrap = document.createElement('div');
    wrap.className = 'special-page-wrap';
    wrap.style.display = 'contents';
    wrap.innerHTML = html;
    afterNode.after(wrap);
    afterNode = wrap.lastElementChild || wrap;
    return wrap;
  }

  // ── Dedication (editable) ──
  if (showDedication) {
    const text = document.getElementById('dedicationText').value || 'สำหรับทุกคนที่เชื่อในเรื่องเล่า...';
    const wrap = insertSpecialPage(`
      <div class="page-label">คำอุทิศ</div>
      <div class="page page-inner page-dedication">
        <div class="dedication-label" contenteditable="true" spellcheck="false"
          class="special-editable" data-field="dedicationLabel"
          style="outline:none;cursor:text;border-radius:3px"
          data-ph="อุทิศแด่">อุทิศแด่</div>
        <div class="dedication-text special-editable" contenteditable="true" spellcheck="false"
          data-field="dedicationText" data-ph="เขียนคำอุทิศ..."
          style="outline:none;cursor:text">${text.replace(/\n/g,'<br>')}</div>
      </div>
    `);
    // Sync editable back to textarea
    wrap.querySelectorAll('[data-field="dedicationText"]').forEach(el => {
      el.addEventListener('input', () => {
        document.getElementById('dedicationText').value = el.innerText;
      });
      el.addEventListener('focus', () => { el.style.outline = '1.5px dashed rgba(139,69,19,0.45)'; });
      el.addEventListener('blur',  () => { el.style.outline = 'none'; });
    });
  }

  // ── Preface (editable) ──
  if (showPreface) {
    const ptitle = document.getElementById('prefaceTitle').value || 'คำนำ';
    const pcontent = document.getElementById('prefaceContent').value || '';
    const paras = pcontent.split('\n').filter(p => p.trim()).map(p => `<p style="margin-bottom:1em">${p}</p>`).join('');
    const wrap = insertSpecialPage(`
      <div class="page-label">คำนำ</div>
      <div class="page page-inner page-preface">
        <div class="preface-title special-editable" contenteditable="true" spellcheck="false"
          data-field="prefaceTitle" data-ph="หัวข้อคำนำ"
          style="outline:none;cursor:text">${ptitle}</div>
        <div class="preface-body special-editable" contenteditable="true" spellcheck="false"
          data-field="prefaceContent" data-ph="เขียนคำนำที่นี่..."
          style="outline:none;cursor:text">${paras || '<p style="color:#ccc;font-style:italic">คลิกเพื่อพิมพ์คำนำ...</p>'}</div>
      </div>
    `);
    wrap.querySelectorAll('[data-field="prefaceTitle"]').forEach(el => {
      el.addEventListener('input', () => {
        document.getElementById('prefaceTitle').value = el.innerText;
      });
      el.addEventListener('focus', () => { el.style.outline = '1.5px dashed rgba(139,69,19,0.45)'; });
      el.addEventListener('blur',  () => { el.style.outline = 'none'; });
    });
    wrap.querySelectorAll('[data-field="prefaceContent"]').forEach(el => {
      el.addEventListener('input', () => {
        document.getElementById('prefaceContent').value = el.innerText;
      });
      el.addEventListener('focus', () => { el.style.outline = '1.5px dashed rgba(139,69,19,0.45)'; });
      el.addEventListener('blur',  () => { el.style.outline = 'none'; });
    });
  }

  // ── TOC ──
  if (showTOCChk) {
    const CHARS_PER_PAGE = 1650;
    const FIXED_PAGES_BEFORE = 3;
    let runningPage = FIXED_PAGES_BEFORE + 1;
    const tocEntries = chapters.map((ch, i) => {
      const startPage = runningPage;
      const contentLen = (ch.content || '').length;
      const numPages = Math.max(1, Math.ceil((contentLen + 200) / CHARS_PER_PAGE));
      runningPage += numPages;
      return { ch, i, startPage };
    });

    const styleClassMap = { modern:'toc-modern', minimal:'toc-minimal', elegant:'toc-elegant', boxed:'toc-boxed', roman:'toc-roman', split:'toc-split', ornate:'toc-ornate' };
    const styleClass = styleClassMap[tocStyle] || '';
    const tocTitleText = tocStyle === 'minimal' ? 'CONTENTS' : tocStyle === 'split' ? 'สารบัญ' : 'สารบัญ';
    const ornateRule = tocStyle === 'ornate' ? `<div class="toc-ornate-rule">— ✦ · ✦ —</div>` : '';

    let entries = tocEntries.map(({ ch, i, startPage }) => `
      <div class="toc-entry" onclick="jumpToChapterInPreview(${i})" title="ไปบทที่ ${i+1}">
        <span class="toc-ch">บทที่ ${i+1}</span>
        <span class="toc-name">${ch.title || 'บทที่ '+(i+1)}<span class="toc-link-badge">↗</span></span>
        <span class="toc-dots"></span>
        <span class="toc-pg">${startPage}</span>
      </div>
    `).join('');

    insertSpecialPage(`
      <div class="page-label">สารบัญ</div>
      <div class="page page-inner page-toc ${styleClass}">
        <div class="page-header"><span></span><span></span></div>
        <div class="toc-title">${tocTitleText}</div>
        ${ornateRule}
        ${entries}
        ${showPageNum ? `<div class="page-number" style="font-size:${pageNumSize}px">${formatPageNumAdvanced(2)}</div>` : ''}
      </div>
    `);
  }

  // Refresh view
  setTimeout(() => applyViewMode(), 0);

  // Render custom special pages (editable)
  customSpecialPages.forEach(csp => {
    const paras = csp.content.split('\n').filter(p => p.trim()).map(p => `<p style="margin-bottom:1em">${p}</p>`).join('');
    const cspKey = csp.id + '_0';
    const wrap = insertSpecialPage(`
      <div class="page-label">${csp.title}</div>
      <div class="page page-inner page-preface" style="position:relative" data-free-img-key="${cspKey}">
        <div class="preface-title special-editable" contenteditable="true" spellcheck="false"
          data-csp-id="${csp.id}" data-csp-field="title" data-ph="หัวข้อ"
          style="outline:none;cursor:text;position:relative;z-index:2">${csp.title}</div>
        <div class="preface-body special-editable" contenteditable="true" spellcheck="false"
          data-csp-id="${csp.id}" data-csp-field="content" data-ph="คลิกเพื่อพิมพ์..."
          style="outline:none;cursor:text;position:relative;z-index:2">${paras || '<p style="color:#ccc;font-style:italic">คลิกเพื่อพิมพ์...</p>'}</div>
      </div>
    `);
    // Sync custom page editable
    wrap.querySelectorAll('[data-csp-id]').forEach(el => {
      const field = el.dataset.cspField;
      el.addEventListener('input', () => {
        const c = customSpecialPages.find(x => x.id === csp.id);
        if (c) c[field] = el.innerText;
        // sync sidebar input if exists
        const sideInp = document.querySelector(`[data-csp-sidebar="${csp.id}-${field}"]`);
        if (sideInp) sideInp.value = el.innerText;
      });
      el.addEventListener('focus', () => { el.style.outline = '1.5px dashed rgba(139,69,19,0.45)'; });
      el.addEventListener('blur',  () => { el.style.outline = 'none'; });
    });
    if (!freeImages[cspKey]) freeImages[cspKey] = [];
    const pageEl = document.querySelector(`[data-free-img-key="${cspKey}"]`);
    if (pageEl) {
      pageEl.addEventListener('contextmenu', (e) => openCtxMenu(e, pageEl));
      enablePageDrop(pageEl);
      restoreFreeImages(pageEl, cspKey);
    }
  });
}

let _forceRenderChapterPages = false;
function renderChapterPages() {
  // Don't re-render if user is actively typing in a page-body (unless forced)
  if (!_forceRenderChapterPages && document.activeElement && document.activeElement.classList.contains('page-body')) {
    // Just update stats silently
    updateStats();
    return;
  }
  _forceRenderChapterPages = false;
  const container = document.getElementById('chapterPages');
  container.innerHTML = '';
  const showHeader = document.getElementById('showHeader').checked;
  const showPageNum = document.getElementById('showPageNum').checked;
  const mv = parseInt(document.getElementById('marginV').value) || 56;
  const mh = parseInt(document.getElementById('marginH').value) || 52;
  const fs = parseInt(document.getElementById('fontSize').value) || 15;
  const lh = (document.getElementById('lineHeight').value / 100);
  const bookTitle = document.getElementById('bookTitle').value;
  const penName = document.getElementById('penName').value || document.getElementById('authorName').value;
  const dividerHTML = getDividerHTML();

  // Estimate chars per page based on settings
  // Thai chars average ~0.95 of font size width; Latin ~0.55
  // Use 0.65 as blended factor for Thai-heavy text
  const contentW = 559 - 2 * mh;
  const headerH = showHeader ? 32 : 0;
  const footerH = showPageNum ? 32 : 0;
  // Reserve: top padding + bottom padding + 8px extra bottom
  const contentH = 794 - mv - (mv + 8) - headerH - footerH;
  // Characters per line: Thai text is wider than Latin
  const charsPerLine = Math.max(10, Math.floor(contentW / (fs * 0.65)));
  // Lines per page: use actual pixel line height
  const lineHeightPx = fs * lh;
  const linesPerPage = Math.max(5, Math.floor(contentH / lineHeightPx));
  // chars per page = lines * chars per line, but paragraphs each start a new line
  // Add paragraph overhead: each para costs 1 extra line (paragraph break)
  const CHARS_PER_PAGE = Math.max(300, charsPerLine * linesPerPage);

  let pageNum = 3; // cover=1, title=2, chapters start at 3

  // ── Helper: build page-body innerHTML for a given list of paragraphs ──
  function buildBodyHTML(pgParas, isFirstPage, pageKey, pageFs, pageLh, pageAlign, pageFont, pageDropCap, pageAccent) {
    const _dcColor = dropCapColor || pageAccent || 'var(--accent)';
    const dropCapSpanStyle = pageDropCap
      ? `font-family:'${dropCapFont}',serif;font-size:${dropCapSize}px;font-weight:700;line-height:0.75;float:left;margin:2px 6px 0 0;color:${_dcColor};display:block;`
      : null;
    let bodyHtml = `<div class="page-body page-body-${pageKey}" data-ch-id="" data-pi="" contenteditable="false" spellcheck="false" style="font-size:${pageFs}px;line-height:${pageLh};text-align:${pageAlign};font-family:'${pageFont}',sans-serif;outline:none;cursor:text;overflow:hidden;">`;
    if (pgParas.length === 0 && isFirstPage) {
      bodyHtml += `<p style="color:#aaa;font-style:italic" data-placeholder="true">คลิกเพื่อพิมพ์เนื้อหาได้เลย...</p>`;
    } else {
      pgParas.forEach((p, pIdx) => {
        const isSection = p.trim() === '— ✦ —' || p.trim() === '* * *';
        if (isSection) {
          bodyHtml += `<div style="text-align:center;color:var(--gold);margin:16px 0;letter-spacing:0.4em">${p}</div>`;
        } else if (pIdx === 0 && dropCapSpanStyle) {
          const parsed = parseRichText(p);
          const firstCharMatch = parsed.match(/^(<[^>]+>)*(.)/);
          if (firstCharMatch && firstCharMatch[2]) {
            const prefix = firstCharMatch[1] || '';
            const firstChar = firstCharMatch[2];
            const rest = parsed.slice(prefix.length + firstChar.length);
            bodyHtml += `<p style="text-indent:0">${prefix}<span style="${dropCapSpanStyle}">${firstChar}</span>${rest}</p>`;
          } else {
            bodyHtml += `<p style="text-indent:0">${parsed}</p>`;
          }
        } else {
          bodyHtml += `<p>${parseRichText(p)}</p>`;
        }
      });
    }
    bodyHtml += '</div>';
    return bodyHtml;
  }

  // ── DOM-based paragraph height probe (accurate Thai text measurement) ──
  // สร้าง hidden probe element ครั้งเดียวต่อ render cycle เพื่อวัดความสูงจริงของแต่ละย่อหน้า
  let _probeEl = null;
  function _getProbe(contentW, pageFs, pageLh, pageAlign, pageFont) {
    if (!_probeEl) {
      _probeEl = document.createElement('div');
      _probeEl.style.cssText = [
        'position:absolute', 'visibility:hidden', 'pointer-events:none',
        'z-index:-9999', 'top:-9999px', 'left:-9999px'
      ].join(';');
      document.body.appendChild(_probeEl);
    }
    _probeEl.style.width     = contentW + 'px';
    _probeEl.style.fontSize  = pageFs + 'px';
    _probeEl.style.lineHeight = pageLh;
    _probeEl.style.textAlign = pageAlign || 'justify';
    _probeEl.style.fontFamily = `'${pageFont}', sans-serif`;
    _probeEl.style.padding   = '0';
    _probeEl.style.margin    = '0';
    _probeEl.style.wordBreak = 'break-word';
    _probeEl.style.overflowWrap = 'break-word';
    return _probeEl;
  }

  // วัดความสูงย่อหน้าจริงจาก DOM — แม่นยำสำหรับภาษาไทย
  function measureParaHeight(text, contentW, pageFs, pageLh, pageAlign, pageFont) {
    const probe = _getProbe(contentW, pageFs, pageLh, pageAlign, pageFont);
    // สร้าง <p> เดียวแบบเดียวกับที่ render จริง
    probe.innerHTML = `<p style="margin:0 0 ${(pageFs*0.35).toFixed(1)}px;padding:0">${parseRichText(text)}</p>`;
    return probe.offsetHeight + 2; // +2px safety
  }

  // วัด header บทด้วย DOM จริง (chapter-num + title + divider)
  function measureChapterHeaderH(ch, pageMv, pageMh, pageFs, pageLh, pageAlign, pageFont, divHTML) {
    const probe = document.createElement('div');
    probe.style.cssText = [
      'position:absolute','visibility:hidden','pointer-events:none',
      'z-index:-9999','top:-9999px','left:-9999px',
      `width:${559 - 2*pageMh}px`,
      `font-size:${pageFs}px`,
      `font-family:'${pageFont}',sans-serif`
    ].join(';');
    probe.innerHTML = `
      <div style="font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;margin-bottom:24px">บทที่ X</div>
      <div style="font-family:'Playfair Display',serif;font-size:22px;font-weight:700;margin-bottom:6px">${ch.title||'บท'}</div>
      ${divHTML}
    `;
    document.body.appendChild(probe);
    const h = probe.offsetHeight;
    document.body.removeChild(probe);
    return h + 16; // +16px buffer
  }

  chapters.forEach((ch, ci) => {
    const rawParagraphs = ch.content.split('\n').filter(p => p.trim());

    const PAGE_H = 794;
    const headerH = showHeader ? 32 : 0;
    const footerH = showPageNum ? 32 : 0;

    const pageGroups = [[]];
    let usedH = 0;

    // วัด chapter header จริง (ครั้งแรกเท่านั้น)
    const _p0Override = perPageLayouts[`${ch.id}_0`];
    const _p0Preset   = _p0Override ? layoutPresets[_p0Override] : null;
    const _p0Mv = _p0Preset ? _p0Preset.marginV : mv;
    const _p0Mh = _p0Preset ? _p0Preset.marginH : mh;
    const _p0Fs = _p0Preset ? _p0Preset.fontSize : fs;
    const _p0Lh = _p0Preset ? _p0Preset.lineHeight / 100 : lh;
    const _p0Al = _p0Preset ? _p0Preset.textAlign : textAlign;
    const _p0Fn = _p0Preset ? _p0Preset.font : bodyFont;
    const chapterHeaderH = measureChapterHeaderH(ch, _p0Mv, _p0Mh, _p0Fs, _p0Lh, _p0Al, _p0Fn, dividerHTML);

    rawParagraphs.forEach((p) => {
      if (p.trim() === '[PAGE_BREAK]') {
        if (pageGroups[pageGroups.length - 1].length > 0) {
          pageGroups.push([]);
          usedH = 0;
        }
        return;
      }

      const curPgIdx = pageGroups.length - 1;
      const isFirstPage = curPgIdx === 0;
      const pageKey = `${ch.id}_${curPgIdx}`;
      const pageOverride = perPageLayouts[pageKey];
      const overridePreset = pageOverride ? layoutPresets[pageOverride] : null;
      const pageMv = overridePreset ? overridePreset.marginV : mv;
      const pageMh = overridePreset ? overridePreset.marginH : mh;
      const pageFs = overridePreset ? overridePreset.fontSize : fs;
      const pageLh = overridePreset ? overridePreset.lineHeight / 100 : lh;
      const pageAl = overridePreset ? overridePreset.textAlign : textAlign;
      const pageFn = overridePreset ? overridePreset.font : bodyFont;

      const contentW = 559 - 2 * pageMh;
      const availH = PAGE_H - pageMv - (pageMv + 8) - headerH - footerH
                     - (isFirstPage ? chapterHeaderH : 0)
                     - 8; // 8px safety buffer

      const paraH = measureParaHeight(p, contentW, pageFs, pageLh, pageAl, pageFn);

      if (usedH + paraH > availH && pageGroups[curPgIdx].length > 0) {
        pageGroups.push([p]);
        usedH = paraH;
      } else {
        pageGroups[curPgIdx].push(p);
        usedH += paraH;
      }
    });
    if (rawParagraphs.length === 0) pageGroups[0] = [];

    pageGroups.forEach((pgParas, pi) => {
      const isFirstPage = pi === 0;

      // Label (only on first page of chapter)
      if (isFirstPage) {
        const label = document.createElement('div');
        label.className = 'page-label';
        label.textContent = `บทที่ ${ci + 1}: ${ch.title}`;
        container.appendChild(label);
      } else {
        // continuation label
        const label = document.createElement('div');
        label.className = 'page-label';
        label.textContent = `บทที่ ${ci + 1} (ต่อ) หน้า ${pi + 1}`;
        container.appendChild(label);
      }

      const page = document.createElement('div');
      page.className = 'page page-inner';

      // Check per-page layout override
      const pageKey = `${ch.id}_${pi}`;
      const pageOverride = perPageLayouts[pageKey];
      const overridePreset = pageOverride ? layoutPresets[pageOverride] : null;
      const pageMv = overridePreset ? overridePreset.marginV : mv;
      const pageMh = overridePreset ? overridePreset.marginH : mh;
      const pageFs = overridePreset ? overridePreset.fontSize : fs;
      const pageLh = overridePreset ? overridePreset.lineHeight / 100 : lh;
      const pageAlign = overridePreset ? overridePreset.textAlign : textAlign;
      const pageFont = overridePreset ? overridePreset.font : bodyFont;
      const pageDropCap = overridePreset ? overridePreset.dropCap : dropCap;
      const pageAccent = overridePreset ? overridePreset.accent : null;

      page.style.padding = `${pageMv}px ${pageMh}px ${pageMv + 8}px`;
      page.dataset.freeImgKey = pageKey;

      let html = '';
      if (showHeader) {
        html += `<div class="page-header"><span>${penName}</span><span>${bookTitle}</span></div>`;
      }

      if (isFirstPage) {
        html += `<div class="page-chapter-num" style="color:${pageAccent || 'var(--accent)'}">บทที่ ${ci + 1}</div>`;
        html += `<div class="page-chapter-title" contenteditable="true" spellcheck="false" data-ch-id="${ch.id}" style="font-family:'Playfair Display',serif;color:${pageAccent || 'var(--ink)'};" title="คลิกเพื่อแก้ชื่อบท">${ch.title || 'บทที่ ' + (ci+1)}</div>`;
        html += dividerHTML;
        if (ch.imageData) {
          const sz = ch.imageSize || 100;
          const imgPos = ch.imagePosition || 'top';
          let imgStyle = `width:${sz}%; border-radius:4px;`;
          let wrapStyle = 'width:100%; margin:12px 0; text-align:center;';
          if (imgPos === 'left') { imgStyle += 'display:inline-block;'; wrapStyle = 'float:left;width:45%;margin:0 12px 8px 0;'; }
          else if (imgPos === 'right') { imgStyle += 'display:inline-block;'; wrapStyle = 'float:right;width:45%;margin:0 0 8px 12px;'; }
          else if (imgPos === 'center') { wrapStyle = 'width:100%; margin:20px 0; text-align:center; display:flex; align-items:center; justify-content:center; flex:1'; }
          html += `<div style="${wrapStyle}"><img src="${ch.imageData}" style="${imgStyle}"></div>`;
        }
      }

      // Build body HTML using shared helper, then patch data attributes
      let bodyHtml = buildBodyHTML(pgParas, isFirstPage, pageKey, pageFs, pageLh, pageAlign, pageFont, pageDropCap, pageAccent);
      // Patch: set contenteditable=true and correct data attributes
      bodyHtml = bodyHtml.replace('contenteditable="false"', 'contenteditable="true"')
        .replace('data-ch-id=""', `data-ch-id="${ch.id}"`)
        .replace('data-pi=""', `data-pi="${pi}"`)
        .replace('overflow:hidden;', '');
      html += bodyHtml;

      if (showPageNum) {
        const hideNum = shouldHidePageNum(isFirstPage, false, false, false);
        if (!hideNum) {
          const numStr = formatPageNum(pageNum);
          html += `<div class="page-number" style="font-size:${pageNumSize}px">${numStr}</div>`;
        }
      }

      page.innerHTML = html;

      // Wire chapter title inline edit → sync back to chapter data
      const chTitleEl = page.querySelector('.page-chapter-title[contenteditable]');
      if (chTitleEl) {
        chTitleEl.addEventListener('blur', () => {
          const newTitle = chTitleEl.textContent.trim();
          if (newTitle && newTitle !== ch.title) {
            ch.title = newTitle;
            renderChapterList();
            const ti = document.getElementById('chapterTitleInput');
            if (ch.id === currentChapterId && ti) ti.value = newTitle;
            recordHistoryDebounced();
            showToast('✏ แก้ชื่อบทแล้ว');
          }
        });
        chTitleEl.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') { e.preventDefault(); chTitleEl.blur(); }
          if (e.key === 'Escape') { chTitleEl.textContent = ch.title || ''; chTitleEl.blur(); }
        });
      }

      // Add page layout pill button (after innerHTML so it's not destroyed)
      const pill = document.createElement('div');
      pill.className = 'page-layout-pill';
      pill.textContent = pageOverride ? `🎨 ${pageOverride}` : '🎨 Pattern';
      pill.title = 'เลือก Pattern สำหรับหน้านี้';
      pill.onclick = (e) => openPerPagePopup(e, ch.id, pi);
      page.appendChild(pill);

      // Wire contenteditable page-body → sync back to chapter state
      const bodyEl = page.querySelector('.page-body');
      if (bodyEl) {
        // Tab key → insert Thai indent (ideographic space) instead of moving focus
        bodyEl.addEventListener('keydown', (e) => {
          if (e.key === 'Tab') {
            e.preventDefault();
            const indent = '\u3000'; // full-width space (Thai indent)
            document.execCommand('insertText', false, indent);
          }
        });
        // Remove placeholder on focus
        bodyEl.addEventListener('focus', () => {
          const ph = bodyEl.querySelector('[data-placeholder]');
          if (ph) ph.remove();
          bodyEl.style.boxShadow = 'none';
          // Track active page-body for inline fmt bar
          window._activePageBody = bodyEl;
        });
        // Debounced sync on input
        let _syncTimer;
        bodyEl.addEventListener('input', () => {
          clearTimeout(_syncTimer);
          _syncTimer = setTimeout(() => syncPageBodyToChapter(bodyEl, ch.id), 800);
        });
        // Show inline format bar on text selection (same as chapterEditor)
        bodyEl.addEventListener('mouseup', () => showInlineFmtBarOnSelect(bodyEl));
        bodyEl.addEventListener('keyup',   () => showInlineFmtBarOnSelect(bodyEl));
        // Show subtle edit ring on hover
        bodyEl.addEventListener('mouseenter', () => {
          if (document.activeElement !== bodyEl)
            bodyEl.style.outline = '1.5px dashed rgba(139,69,19,0.2)';
        });
        bodyEl.addEventListener('mouseleave', () => {
          if (document.activeElement !== bodyEl)
            bodyEl.style.outline = 'none';
        });
        bodyEl.addEventListener('blur', () => {
          bodyEl.style.outline = 'none';
          syncPageBodyToChapter(bodyEl, ch.id);
        });
      }

      // Wire dblclick on each paragraph → jump to editor position
      page.querySelectorAll('.page-body p').forEach((pEl, pIdx) => {
        pEl.addEventListener('dblclick', () => {
          // Switch to editor tab
          const editorTab = document.querySelector('.panel-tab');
          if (editorTab) switchTab('editor', editorTab);
          // Select the chapter
          selectChapter(ch.id);
          // Try to position cursor at this paragraph in textarea
          setTimeout(() => {
            const ta = document.getElementById('chapterEditor');
            if (!ta) return;
            const paraText = pgParas[pIdx] || '';
            const pos = ta.value.indexOf(paraText);
            if (pos >= 0) {
              ta.focus();
              ta.setSelectionRange(pos, pos + paraText.length);
              ta.scrollTop = ta.scrollHeight * (pos / ta.value.length);
            }
          }, 60);
        });
      });

      // Drop cap: handled by per-page CSS class now

      // Right-click context menu on page
      page.addEventListener('contextmenu', (e) => openCtxMenu(e, page));

      // Enable drag-and-drop of images onto page
      enablePageDrop(page);

      // Restore any previously placed free images
      restoreFreeImages(page, pageKey);

      container.appendChild(page);
      pageNum++;
    });
  });

  // After rendering, refresh view mode + apply borders
  // Clean up the DOM probe element used for height measurement
  if (_probeEl && _probeEl.parentNode) {
    _probeEl.parentNode.removeChild(_probeEl);
    _probeEl = null;
  }
  setTimeout(() => {
    applyViewMode();
    const total = document.getElementById('zoomWrap').querySelectorAll('.page').length;
    document.getElementById('pageCountInfo').textContent = `${total} หน้า`;
    applyPageBorders();
    applyPaperTexture();
    reapplyPaperMode();
  }, 0);
}

// ── Typography ──
function updateFontSize(val) {
  document.getElementById('fontSizeVal').textContent = val + 'px';
  renderChapterPages();
}

function updateLineHeight(val) {
  document.getElementById('lineHeightVal').textContent = (val / 100).toFixed(2);
  renderChapterPages();
}

function setAccent(color, light, el) {
  document.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
  if (el) el.classList.add('active');
  document.documentElement.style.setProperty('--accent', color);
  document.documentElement.style.setProperty('--accent-light', light);
  renderChapterPages();
}

function setTextAlign(val) {
  textAlign = val;
  renderChapterPages();
}

function toggleDropCap() {
  dropCap = document.getElementById('showDropCap').checked;
  renderChapterPages();
}

function updateMargins() {
  const mv = document.getElementById('marginV').value;
  const mh = document.getElementById('marginH').value;
  document.getElementById('marginVVal').textContent = mv + 'px';
  document.getElementById('marginHVal').textContent = mh + 'px';
  renderChapterPages();
}

// ── Editor helpers (WYSIWYG) ──
function insertText(before, after) { weInsert('quote'); } // legacy fallback
function insertPara() { weInsert('para'); }
function insertBreak() { weInsert('break'); }
function insertPageBreak() { weInsert('pagebreak'); showToast('📄 แทรกตัดหน้าใหม่แล้ว'); }
function insertItalic() { weFormat('italic'); }
function insertBold() { weFormat('bold'); }
function insertHighlight() { weFormat('highlight'); }
function insertCmd() { weFormat('cmd'); }
function rbInsert(type) {
  if (type === 'break') weInsert('break');
  else if (type === 'para') weInsert('para');
}

// ── Tabs ──
function switchTab(name, el) {
  document.querySelectorAll('.panel-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('tab-' + name).classList.add('active');
}

// ── Stats ──
function updateStats() {
  let totalWords = 0, totalChars = 0;
  let statsHtml = '';
  const WORDS_PER_A5_PAGE = 350; // มาตรฐาน A5 นิยาย ~300-400 คำ/หน้า
  const READING_WPM = 250; // ความเร็วอ่านภาษาไทย ~200-280 wpm

  chapters.forEach((ch, i) => {
    const words = ch.content.trim() ? ch.content.trim().split(/\s+/).length : 0;
    const chars = ch.content.length;
    const estPages = Math.ceil(words / WORDS_PER_A5_PAGE) || 1;
    totalWords += words;
    totalChars += chars;
    statsHtml += `<div style="display:flex;justify-content:space-between;align-items:center;padding:2px 0;border-bottom:1px solid var(--border)">
      <strong style="font-size:11px">${ch.title || 'บทที่'+(i+1)}</strong>
      <span style="color:var(--ink-faint);font-size:11px">${words.toLocaleString()} คำ &bull; ~${estPages} หน้า</span>
    </div>`;
  });

  const totalPages = Math.ceil(totalWords / WORDS_PER_A5_PAGE) + 2;
  const readMinutes = Math.ceil(totalWords / READING_WPM);
  const readHours = Math.floor(readMinutes / 60);
  const readMins = readMinutes % 60;
  const readTimeStr = readHours > 0 ? `${readHours} ชม. ${readMins} นาที` : `${readMins} นาที`;
  const avgWordsPerPage = chapters.length > 0 ? Math.round(totalWords / Math.max(1, totalPages - 2)) : 0;

  let wppHint = '';
  if (avgWordsPerPage > 0) {
    if (avgWordsPerPage < 250) wppHint = '<span style="color:#f59e0b">⚠ น้อยเกินไป</span>';
    else if (avgWordsPerPage <= 420) wppHint = '<span style="color:#10b981">✓ เหมาะสม</span>';
    else wppHint = '<span style="color:#f59e0b">⚠ หนาแน่นเกินไป</span>';
  }

  document.getElementById('statChapters').textContent = chapters.length;
  document.getElementById('statWords').textContent = totalWords.toLocaleString();
  document.getElementById('statChars').textContent = totalChars.toLocaleString();
  document.getElementById('statPages').textContent = totalPages;
  document.getElementById('statReadTime').textContent = totalWords > 0 ? readTimeStr : '—';
  document.getElementById('statWordsPerPage').textContent = avgWordsPerPage > 0 ? avgWordsPerPage.toLocaleString() : '—';
  document.getElementById('statWordsPerPageHint').innerHTML = wppHint;
  document.getElementById('chapterStats').innerHTML = statsHtml || '<div style="color:var(--ink-faint);font-style:italic;font-size:11px">ยังไม่มีบท...</div>';
}

// ── Toast ──
// ── Robust download helper (works on Android content:// URLs) ──
function _downloadBlob(blob, filename) {
  try {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 2000);
  } catch(e) {
    // Fallback: open in new window (Android WebView fallback)
    try {
      const reader = new FileReader();
      reader.onload = function() {
        const win = window.open('about:blank', '_blank');
        if (win) {
          win.document.write(`<html><body style="margin:0;background:#1a1612;color:#fff;font-family:sans-serif;padding:20px">
            <h3 style="color:#c9a227">⚠️ ดาวน์โหลดไม่สำเร็จอัตโนมัติ</h3>
            <p>เบราว์เซอร์นี้อาจไม่รองรับการดาวน์โหลดไฟล์โดยตรง</p>
            <p>วิธีแก้: <strong>เปิดไฟล์นี้ใน Chrome บนเครื่อง PC</strong> แล้ว Export อีกครั้ง</p>
          </body></html>`);
        } else {
          showToast('❌ กรุณาเปิดในเบราว์เซอร์ Chrome บน PC เพื่อ Export');
        }
      };
      reader.readAsDataURL(blob);
    } catch(e2) {
      showToast('❌ Export ไม่สำเร็จ: กรุณาเปิดใน Chrome บน PC');
    }
  }
}

function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) { console.log('[Toast]', msg); return; }
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

// ── Export PDF (html2canvas method for correct Thai font) ──
async function exportPDF() {
  showToast('⏳ กำลังสร้าง PDF... อาจใช้เวลาสักครู่');
  // Clean up any ghost measurement elements that may have leaked
  document.querySelectorAll('.page.page-inner[style*="-9999px"]').forEach(el => el.remove());
  try {
    if (!window.html2canvas) {
      await new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        s.onload = resolve; s.onerror = () => reject(new Error('โหลด html2canvas ไม่ได้ — ต้องใช้ Internet'));
        document.head.appendChild(s);
      });
    }

    if (!window.jspdf) {
      await new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        s.onload = resolve; s.onerror = () => reject(new Error('โหลด jsPDF ไม่ได้ — ต้องใช้ Internet'));
        document.head.appendChild(s);
      });
    }

    const { jsPDF } = window.jspdf;
    if (!jsPDF) throw new Error('โหลด jsPDF ไม่ได้');
    const title = document.getElementById('bookTitle').value || 'ebook';
    const safeTitle = title.replace(/[^a-zA-Z0-9ก-๙]/g, '_');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a5' });
    const W = 148, H = 210;

    // Collect all page elements
    const pageCover = document.getElementById('pageCover');
    const pageTitlePage = document.getElementById('pageTitlePage');
    const specialPages = Array.from(document.querySelectorAll('.special-page-wrap .page'));
    const chapterPageEls = Array.from(document.querySelectorAll('#chapterPages .page'));
    const allPageEls = [pageCover, pageTitlePage, ...specialPages, ...chapterPageEls].filter(Boolean);

    // Force all pages visible (hide via display:none breaks html2canvas)
    const prevDisplay = allPageEls.map(p => p.style.display);
    allPageEls.forEach(p => { p.style.display = 'flex'; });
    // Also unhide any page-label elements temporarily
    const prevLabelDisplay = [];
    document.querySelectorAll('.page-label').forEach(l => { prevLabelDisplay.push([l, l.style.display]); l.style.display = 'none'; });

    let first = true;
    // Temporarily reset zoom transform so html2canvas captures at 1:1
    const zoomWrap = document.getElementById('zoomWrap');
    const prevTransform = zoomWrap ? zoomWrap.style.transform : '';
    if (zoomWrap) zoomWrap.style.transform = 'none';

    for (const pageEl of allPageEls) {
      const rect = pageEl.getBoundingClientRect();
      const canvas = await html2canvas(pageEl, {
        scale: 2, useCORS: true, allowTaint: true,
        backgroundColor: '#fffef9', logging: false,
        width: 559, height: 794,
        windowWidth: 559, windowHeight: 794,
        scrollX: -window.scrollX,
        scrollY: -window.scrollY,
        x: 0, y: 0,
        ignoreElements: el => el.classList?.contains('page-label') ||
                               el.classList?.contains('page-layout-pill') ||
                               el.id === 'inlineFmtBar'
      });
      const imgData = canvas.toDataURL('image/jpeg', 0.92);
      if (!first) pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, 0, W, H);
      first = false;
    }

    // Restore zoom transform
    if (zoomWrap) zoomWrap.style.transform = prevTransform;

    // Restore display states
    allPageEls.forEach((p, i) => { p.style.display = prevDisplay[i]; });
    prevLabelDisplay.forEach(([l, d]) => { l.style.display = d; });

    // Download
    pdf.save(`${safeTitle}_A5.pdf`);
    showToast('✅ Export PDF เรียบร้อย!');
  } catch(e) {
    console.error('PDF export error:', e);
    showToast('❌ PDF error: ' + (e.message || e));
  }
}

// ── Pure-JS DOCX XML writer (fallback when docx library unavailable) ──
async function exportDOCX_fallback() {
  const title = document.getElementById('bookTitle').value || 'Untitled';
  const author = document.getElementById('authorName').value || '';
  const pen = document.getElementById('penName').value || author;
  const pub = document.getElementById('publisher').value || '';
  const year = document.getElementById('pubYear').value || '';

  const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

  // ── Strip/convert markup tags to plain text for DOCX runs ──
  function stripMarkupToRuns(text, baseOpts = {}) {
    // Returns array of run objects: { text, bold, italic, color, sz }
    const defaultSz = baseOpts.sz || 24;
    const runs = [];
    // Parse inline markup into segments
    // Supported: **bold**, _italic_, <color:#hex>text</color>, <size:N>text</size>, <font:...>text</font>, ==highlight==, `code`, «text»
    // Strategy: walk through with regex to split into tagged/untagged segments
    const segments = [];
    let remaining = text;
    const tagRe = /(\*\*(.+?)\*\*|__(.+?)__|_(.+?)_|==(.+?)==|`(.+?)`|<color:(#[0-9a-fA-F]{3,6})>(.+?)<\/color>|<size:(\d+)>(.+?)<\/size>|<font:[^>]+>(.+?)<\/font>|«(.+?)»)/;
    while (remaining.length > 0) {
      const m = tagRe.exec(remaining);
      if (!m) { segments.push({ text: remaining, bold: false, italic: false }); break; }
      if (m.index > 0) segments.push({ text: remaining.slice(0, m.index), bold: false, italic: false });
      const full = m[0];
      if (full.startsWith('**')) segments.push({ text: m[2], bold: true, italic: false });
      else if (full.startsWith('__')) segments.push({ text: m[3], underline: true });
      else if (full.startsWith('_')) segments.push({ text: m[4], italic: true });
      else if (full.startsWith('==')) segments.push({ text: m[5] });
      else if (full.startsWith('`')) segments.push({ text: m[6] });
      else if (full.startsWith('<color:')) segments.push({ text: m[8], color: m[7].replace('#','') });
      else if (full.startsWith('<size:')) segments.push({ text: m[10], sz: Math.round(parseInt(m[9]) * 2) }); // OOXML half-points
      else if (full.startsWith('<font:')) segments.push({ text: m[11] });
      else if (full.startsWith('«')) segments.push({ text: '«' + m[12] + '»', italic: true });
      else segments.push({ text: full });
      remaining = remaining.slice(m.index + full.length);
    }
    return segments.map(seg => {
      const bold = (baseOpts.bold || seg.bold) ? '<w:b/>' : '';
      const italic = (baseOpts.italic || seg.italic) ? '<w:i/>' : '';
      const underline = seg.underline ? '<w:u w:val="single"/>' : '';
      const color = (seg.color || baseOpts.color) ? `<w:color w:val="${seg.color || baseOpts.color}"/>` : '';
      const sz = seg.sz || defaultSz;
      return `<w:r><w:rPr>${bold}${italic}${underline}${color}<w:sz w:val="${sz}"/><w:szCs w:val="${sz}"/><w:rFonts w:ascii="Sarabun" w:hAnsi="Sarabun" w:cs="Sarabun"/></w:rPr><w:t xml:space="preserve">${esc(seg.text)}</w:t></w:r>`;
    }).join('');
  }

  let bodyXml = '';
  const p = (text, opts = {}) => {
    const jc = opts.center ? '<w:jc w:val="center"/>' : '';
    const before = opts.before ? `<w:spacing w:before="${opts.before}"/>` : '';
    const runsXml = stripMarkupToRuns(text, opts);
    return `<w:p><w:pPr>${jc}${before}</w:pPr>${runsXml}</w:p>`;
  };
  const pageBreak = () => `<w:p><w:r><w:br w:type="page"/></w:r></w:p>`;

  bodyXml += p(title, { bold: true, sz: 52, center: true, before: 2400 });
  bodyXml += p(document.getElementById('bookSubtitle').value || '', { italic: true, sz: 26, center: true, color: '888880', before: 200 });
  bodyXml += p('โดย  ' + pen, { sz: 24, center: true, before: 600 });
  bodyXml += p(pub + '  ·  ' + year, { sz: 18, center: true, color: 'aaaaaa', before: 3200 });
  bodyXml += pageBreak();

  bodyXml += p('✦  ✦  ✦', { sz: 24, center: true, color: 'c9a227', before: 2000 });
  bodyXml += p(title, { bold: true, sz: 44, center: true, before: 400 });
  bodyXml += p('โดย  ' + author, { sz: 22, center: true, before: 400 });
  if (pen !== author) bodyXml += p('(นามปากกา: ' + pen + ')', { italic: true, sz: 18, center: true, color: '888880', before: 100 });
  bodyXml += pageBreak();

  chapters.forEach((ch, i) => {
    bodyXml += p('บทที่ ' + (i+1), { bold: true, sz: 18, color: '8b4513', before: 480 });
    bodyXml += p(ch.title || 'บทที่ ' + (i+1), { bold: true, sz: 32, before: 100 });
    const paras = ch.content.split('\n').filter(x => x.trim() && x.trim() !== '[PAGE_BREAK]');
    if (!paras.length) bodyXml += p('(ยังไม่มีเนื้อหา)', { italic: true, color: 'aaaaaa' });
    else paras.forEach(para => { bodyXml += p(para, { sz: 24 }); });
    if (i < chapters.length - 1) bodyXml += pageBreak();
  });

  const docXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:body>
${bodyXml}
<w:sectPr>
  <w:pgSz w:w="8391" w:h="11906"/>
  <w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134"/>
</w:sectPr>
</w:body>
</w:document>`;

  const relsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;
  const wordRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"></Relationships>`;
  const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`;

  // Use JSZip if available (loaded with jspdf area) or manual Blob trick
  const enc = new TextEncoder();
  // Simple ZIP builder
  function makeZip(files) {
    const parts = [];
    const centralDir = [];
    let offset = 0;
    const crc32 = (buf) => {
      let crc = 0xFFFFFFFF;
      const t = new Uint32Array(256);
      for (let i = 0; i < 256; i++) { let c = i; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[i] = c; }
      for (let i = 0; i < buf.length; i++) crc = t[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
      return (crc ^ 0xFFFFFFFF) >>> 0;
    };
    for (const [name, content] of files) {
      const data = enc.encode(content);
      const crc = crc32(data);
      const nameBytes = enc.encode(name);
      const local = new Uint8Array(30 + nameBytes.length + data.length);
      const dv = new DataView(local.buffer);
      dv.setUint32(0, 0x04034b50, true); dv.setUint16(4, 20, true); dv.setUint16(6, 0, true);
      dv.setUint16(8, 0, true); dv.setUint16(10, 0, true); dv.setUint16(12, 0, true);
      dv.setUint32(14, crc, true); dv.setUint32(18, data.length, true); dv.setUint32(22, data.length, true);
      dv.setUint16(26, nameBytes.length, true); dv.setUint16(28, 0, true);
      local.set(nameBytes, 30); local.set(data, 30 + nameBytes.length);
      parts.push(local);
      const cd = new Uint8Array(46 + nameBytes.length);
      const cdv = new DataView(cd.buffer);
      cdv.setUint32(0, 0x02014b50, true); cdv.setUint16(4, 20, true); cdv.setUint16(6, 20, true);
      cdv.setUint16(8, 0, true); cdv.setUint16(10, 0, true); cdv.setUint16(12, 0, true);
      cdv.setUint16(14, 0, true); cdv.setUint32(16, crc, true); cdv.setUint32(20, data.length, true);
      cdv.setUint32(24, data.length, true); cdv.setUint16(28, nameBytes.length, true);
      cdv.setUint16(30, 0, true); cdv.setUint16(32, 0, true); cdv.setUint16(34, 0, true);
      cdv.setUint16(36, 0, true); cdv.setUint32(38, 0, true); cdv.setUint32(42, offset, true);
      cd.set(nameBytes, 46); centralDir.push(cd);
      offset += local.length;
    }
    const cdSize = centralDir.reduce((a, b) => a + b.length, 0);
    const eocd = new Uint8Array(22);
    const edv = new DataView(eocd.buffer);
    edv.setUint32(0, 0x06054b50, true); edv.setUint16(4, 0, true); edv.setUint16(6, 0, true);
    edv.setUint16(8, files.length, true); edv.setUint16(10, files.length, true);
    edv.setUint32(12, cdSize, true); edv.setUint32(16, offset, true); edv.setUint16(20, 0, true);
    const all = [...parts, ...centralDir, eocd];
    const total = all.reduce((a, b) => a + b.length, 0);
    const out = new Uint8Array(total); let pos = 0;
    for (const a of all) { out.set(a, pos); pos += a.length; }
    return out;
  }

  const zipData = makeZip([
    ['[Content_Types].xml', contentTypesXml],
    ['_rels/.rels', relsXml],
    ['word/document.xml', docXml],
    ['word/_rels/document.xml.rels', wordRelsXml],
  ]);
  const blob = new Blob([zipData], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
  const safeTitle = title.replace(/[^a-zA-Z0-9ก-๙]/g, '_');
  _downloadBlob(blob, `${safeTitle}_A5.docx`);
  showToast('✅ บันทึก .docx เรียบร้อย! (basic XML mode)');
}

// ── Export DOCX (always uses pure-JS XML writer — no external lib needed) ──
async function exportDOCX() {
  showToast('⏳ กำลังสร้าง .docx...');
  try {
    await exportDOCX_fallback();
  } catch(e) {
    console.error('DOCX export error:', e);
    showToast('❌ DOCX error: ' + (e.message || e));
  }
}


// ── View Mode ──
function setViewMode(mode, btnEl) {
  viewMode = mode;
  document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');
  // Sync ribbon view buttons
  document.querySelectorAll('.rb[id^="rb-scroll"], .rb[id^="rb-single"], .rb[id^="rb-spread"]').forEach(b => b.classList.remove('active'));
  const rbMap = { scroll: 'rb-scroll', single: 'rb-single', spread: 'rb-spread' };
  if (rbMap[mode]) { const rb = document.getElementById(rbMap[mode]); if (rb) rb.classList.add('active'); }
  const area = document.getElementById('previewArea');
  area.className = 'preview-area mode-' + mode;
  currentPageIndex = 0;
  applyViewMode();
}

function applyViewMode() {
  const navBar = document.getElementById('pageNavBar');
  const zw = document.getElementById('zoomWrap');

  // collectPageUnits already unwraps spread-pairs; collect fresh units
  allPages = collectPageUnits();

  if (viewMode === 'scroll') {
    zw.querySelectorAll('.page-label').forEach(el => el.style.display = '');
    zw.querySelectorAll('.page').forEach(el => el.style.display = '');
    navBar.classList.add('hidden');
    document.getElementById('pageCountInfo').textContent = `${allPages.length} หน้า`;
    buildPageDropdown();
    return;
  }

  if (viewMode === 'single') {
    zw.querySelectorAll('.page-label').forEach(el => el.style.display = 'none');
    zw.querySelectorAll('.page').forEach(el => el.style.display = 'none');

    const u = allPages[currentPageIndex];
    if (u) {
      if (u.label) u.label.style.display = '';
      u.pages.forEach(p => p.style.display = '');
    }
    navBar.classList.remove('hidden');
    updateNavBar();
    updateRightPanelContext();
    return;
  }

  if (viewMode === 'spread') {
    zw.querySelectorAll('.page-label').forEach(el => el.style.display = 'none');
    zw.querySelectorAll('.page').forEach(el => el.style.display = 'none');

    // Clean up any old spread-pairs first
    zw.querySelectorAll('.spread-pair').forEach(sp => sp.replaceWith(...Array.from(sp.childNodes)));

    const left = allPages[currentPageIndex];
    const right = allPages[currentPageIndex + 1];
    [left, right].forEach(u => { if (u) u.pages.forEach(p => p.style.display = ''); });

    if (left && right && left.pages[0] && right.pages[0]) {
      const pair = document.createElement('div');
      pair.className = 'spread-pair';
      left.pages[0].after(pair);
      pair.appendChild(left.pages[0]);
      pair.appendChild(right.pages[0]);
    }
    navBar.classList.remove('hidden');
    updateNavBar();
    updateRightPanelContext();
    return;
  }
}

function collectPageUnits() {
  // Returns array of {label, pages[]} for each page block in render order
  // First unwrap any lingering spread-pair elements so we see raw pages
  const zw = document.getElementById('zoomWrap');
  zw.querySelectorAll('.spread-pair').forEach(sp => sp.replaceWith(...Array.from(sp.childNodes)));

  const flatNodes = [];
  function flatten(parent) {
    Array.from(parent.children).forEach(el => {
      if (el.id === 'chapterPages' || el.classList.contains('special-page-wrap')) {
        flatten(el);
      } else {
        flatNodes.push(el);
      }
    });
  }
  flatten(zw);

  const units = [];
  let i = 0;
  while (i < flatNodes.length) {
    const el = flatNodes[i];
    if (el.classList.contains('page-label')) {
      const label = el;
      const pages = [];
      let j = i + 1;
      while (j < flatNodes.length && !flatNodes[j].classList.contains('page-label')) {
        if (flatNodes[j].classList.contains('page')) pages.push(flatNodes[j]);
        j++;
      }
      units.push({ label, pages });
      i = j;
    } else if (el.classList.contains('page')) {
      units.push({ label: null, pages: [el] });
      i++;
    } else {
      i++;
    }
  }
  return units;
}

function updateNavBar() {
  const total = allPages.length;
  const spread = viewMode === 'spread';
  const navInfo = document.getElementById('navInfo');
  const navPrev = document.getElementById('navPrev');
  const navNext = document.getElementById('navNext');
  if (spread) {
    navInfo.textContent = `หน้า ${currentPageIndex + 1}–${Math.min(currentPageIndex + 2, total)} / ${total}`;
  } else {
    navInfo.textContent = `หน้า ${currentPageIndex + 1} / ${total}`;
  }
  document.getElementById('pageCountInfo').textContent = `${total} หน้า`;
  navPrev.disabled = currentPageIndex <= 0;
  navNext.disabled = spread ? currentPageIndex + 2 >= total : currentPageIndex + 1 >= total;
  // Update jump input
  const ji = document.getElementById('navJumpInput');
  if (ji) { ji.value = currentPageIndex + 1; ji.max = total; }
  buildPageDropdown();
}

function navPage(dir) {
  const total = allPages.length;
  const step = viewMode === 'spread' ? 2 : 1;
  currentPageIndex = Math.max(0, Math.min(currentPageIndex + dir * step, total - 1));
  applyViewMode();
}

// ── Zoom ──
function adjustZoom(delta) {
  zoomLevel = Math.max(40, Math.min(150, zoomLevel + delta));
  document.getElementById('zoomVal').textContent = zoomLevel + '%';
  document.getElementById('zoomWrap').style.transform = `scale(${zoomLevel / 100})`;
}

// ── Collapsible sidebar sections ──
function toggleSection(titleEl) {
  titleEl.closest('.sidebar-section').classList.toggle('collapsed');
}

// ── Toggle Cover Info (sidebar fields + cover text on page) ──
let coverTextVisible = true;
function toggleCoverInfo(el) {
  const fields = document.getElementById('coverInfoFields');
  const icon = document.getElementById('coverInfoToggleIcon');
  const hidden = fields.classList.toggle('hidden');
  icon.textContent = hidden ? '▶ แสดง' : '▼ ซ่อน';
}

function toggleCoverText(checkbox) {
  coverTextVisible = checkbox.checked;
  const content = document.querySelector('.cover-content');
  const publisher = document.getElementById('coverPublisherDisplay');
  if (content) content.style.opacity = coverTextVisible ? '1' : '0';
  if (publisher) publisher.style.opacity = coverTextVisible ? '1' : '0';
  showToast(coverTextVisible ? '👁 แสดงข้อความบนปก' : '🙈 ซ่อนข้อความบนปกแล้ว');
}

// ── Layout Presets (extended) ──
const layoutPresets = {
  novel:     { fontSize:15, lineHeight:185, marginV:56, marginH:52, textAlign:'justify', dropCap:true,  font:'Sarabun',        accent:'#8b4513', accentLight:'#c4773a', desc:'นิยายมาตรฐาน: Drop Cap, indent, justify — อ่านสบาย' },
  romance:   { fontSize:15, lineHeight:200, marginV:60, marginH:56, textAlign:'justify', dropCap:true,  font:'Charm',          accent:'#c0696e', accentLight:'#e08888', desc:'โรแมนซ์: ฟอนต์ Charm บรรทัดโปร่ง หวานนุ่ม' },
  fantasy:   { fontSize:14, lineHeight:180, marginV:52, marginH:48, textAlign:'justify', dropCap:false, font:'Noto Serif Thai', accent:'#5a3e1b', accentLight:'#8b6340', desc:'แฟนตาซี: Noto Serif Thai หนักแน่น ขอบแน่น' },
  thriller:  { fontSize:13, lineHeight:170, marginV:44, marginH:40, textAlign:'justify', dropCap:false, font:'Sarabun',        accent:'#2c3e50', accentLight:'#4a6070', desc:'Thriller: ตัวเล็กแน่น ขอบแคบ อ่านเร็ว เร้าใจ' },
  literary:  { fontSize:15, lineHeight:210, marginV:64, marginH:64, textAlign:'justify', dropCap:true,  font:'Prompt',         accent:'#6b8c5a', accentLight:'#8aaa78', desc:'วรรณกรรม: Prompt ขอบกว้าง บรรทัดห่าง สง่างาม' },
  scifi:     { fontSize:14, lineHeight:175, marginV:52, marginH:48, textAlign:'left',    dropCap:false, font:'Mitr',           accent:'#2e5c8a', accentLight:'#4a80b0', desc:'Sci-Fi: Mitr ชิดซ้าย ไม่ Drop Cap ทันสมัย' },
  dialogue:  { fontSize:14, lineHeight:200, marginV:56, marginH:52, textAlign:'left',    dropCap:false, font:'Sarabun',        accent:'#7a5c2e', accentLight:'#a07840', desc:'บทสนทนา: ชิดซ้าย บรรทัดห่าง ไม่ indent อ่านง่าย' },
  poetry:    { fontSize:15, lineHeight:220, marginV:64, marginH:72, textAlign:'center',  dropCap:false, font:'Kanit',          accent:'#9b6b9b', accentLight:'#bb88bb', desc:'กลอน: Kanit กึ่งกลาง บรรทัดห่างมาก ขอบกว้าง' },
  children:  { fontSize:18, lineHeight:240, marginV:60, marginH:60, textAlign:'justify', dropCap:false, font:'Mitr',           accent:'#c08020', accentLight:'#e0a040', desc:'หนังสือเด็ก: ตัวใหญ่ 18px บรรทัดห่างมาก อ่านง่าย' },
  magazine:  { fontSize:14, lineHeight:175, marginV:48, marginH:44, textAlign:'justify', dropCap:false, font:'Prompt',         accent:'#2c3e50', accentLight:'#4a6070', desc:'นิตยสาร/บทความ: ไม่ indent ขอบปกติ ทันสมัย' },
  wide:      { fontSize:15, lineHeight:185, marginV:40, marginH:32, textAlign:'justify', dropCap:false, font:'Sarabun',        accent:'#8b4513', accentLight:'#c4773a', desc:'Wide: ขอบแคบ เนื้อที่กว้างขึ้น' },
  compact:   { fontSize:13, lineHeight:170, marginV:64, marginH:64, textAlign:'justify', dropCap:false, font:'Sarabun',        accent:'#333333', accentLight:'#666666', desc:'Compact: ตัวเล็ก ขอบกว้าง หน้าเยอะขึ้น' },
  // ── แนวใหม่ ──
  anime:     { fontSize:14, lineHeight:190, marginV:52, marginH:48, textAlign:'left',    dropCap:false, font:'Kanit',          accent:'#7c3aed', accentLight:'#a855f7', desc:'อนิเมะ: Kanit ชิดซ้าย สีม่วงสดใส บรรทัดโปร่ง' },
  yaoi:      { fontSize:14, lineHeight:205, marginV:58, marginH:54, textAlign:'justify', dropCap:false, font:'Charm',          accent:'#be185d', accentLight:'#ec4899', desc:'วาย: Charm สีชมพูเข้ม บรรทัดห่าง โรแมนติก' },
  sweetgirl: { fontSize:15, lineHeight:210, marginV:60, marginH:58, textAlign:'justify', dropCap:true,  font:'Charm',          accent:'#d946ef', accentLight:'#f0abfc', desc:'สาวน่ารัก: Charm สีม่วงชมพู Drop Cap หวาน' },
  fancy:     { fontSize:15, lineHeight:200, marginV:62, marginH:58, textAlign:'justify', dropCap:true,  font:'Noto Serif Thai', accent:'#b45309', accentLight:'#d97706', desc:'แฟนซี: Noto Serif สีทอง Drop Cap หรูหรา' },
  kidsfun:   { fontSize:20, lineHeight:260, marginV:56, marginH:52, textAlign:'left',    dropCap:false, font:'Mitr',           accent:'#059669', accentLight:'#34d399', desc:'เด็กสนุก: ตัวใหญ่ สีเขียว อ่านง่าย สดใส' },
  horror:    { fontSize:13, lineHeight:165, marginV:48, marginH:44, textAlign:'justify', dropCap:false, font:'Noto Serif Thai', accent:'#7f1d1d', accentLight:'#b91c1c', desc:'สยองขวัญ: Noto Serif แดงเลือด ตัวแน่น' },
  shortstory:{ fontSize:15, lineHeight:195, marginV:60, marginH:60, textAlign:'justify', dropCap:true,  font:'Prompt',         accent:'#065f46', accentLight:'#059669', desc:'เรื่องสั้น: Prompt เขียวเข้ม Drop Cap สง่า' },
  bl_classic:{ fontSize:14, lineHeight:200, marginV:56, marginH:52, textAlign:'justify', dropCap:false, font:'Sarabun',        accent:'#1e3a5f', accentLight:'#2563eb', desc:'BL Classic: สีน้ำเงินเข้ม ฟอนต์สะอาด' },
  wuxia:     { fontSize:14, lineHeight:180, marginV:52, marginH:48, textAlign:'justify', dropCap:false, font:'Noto Serif Thai', accent:'#431407', accentLight:'#9a3412', desc:'กำลังภายใน: Noto Serif แดงเลือดมังกร หนักแน่น' },
  isekai:    { fontSize:14, lineHeight:190, marginV:54, marginH:50, textAlign:'left',    dropCap:false, font:'Kanit',          accent:'#1d4ed8', accentLight:'#3b82f6', desc:'Isekai: Kanit ฟ้าสว่าง ชิดซ้าย อนิเมะสไตล์' },
  // ── ชุดใหม่ ──
  cozy:      { fontSize:15, lineHeight:200, marginV:58, marginH:56, textAlign:'justify', dropCap:true,  font:'Sarabun',        accent:'#065f46', accentLight:'#059669', desc:'Cozy: บรรยากาศอบอุ่น ขอบกว้าง drop cap สบายตา' },
  light_novel:{ fontSize:14, lineHeight:195, marginV:52, marginH:48, textAlign:'left',   dropCap:false, font:'Kanit',          accent:'#7c3aed', accentLight:'#a78bfa', desc:'Light Novel: Kanit ชิดซ้าย อ่านเร็ว สไตล์ญี่ปุ่น' },
  manhwa:    { fontSize:14, lineHeight:185, marginV:50, marginH:46, textAlign:'left',    dropCap:false, font:'Mitr',           accent:'#0891b2', accentLight:'#38bdf8', desc:'Manhwa: Mitr สีฟ้า ขอบแคบ อ่านเร็ว' },
  elegant_serif:{ fontSize:15, lineHeight:205, marginV:64, marginH:62, textAlign:'justify', dropCap:true, font:'Noto Serif Thai', accent:'#1e1b4b', accentLight:'#4338ca', desc:'Elegant Serif: Noto Serif ขอบกว้าง สีกรมท่า หรูหรา' },
  flash_fiction:{ fontSize:15, lineHeight:190, marginV:60, marginH:68, textAlign:'center',  dropCap:false, font:'Prompt',       accent:'#be185d', accentLight:'#f43f5e', desc:'Flash Fiction: Prompt กึ่งกลาง ขอบกว้างมาก สั้นกระชับ' },
  academic:  { fontSize:14, lineHeight:175, marginV:56, marginH:56, textAlign:'justify', dropCap:false, font:'Sarabun',        accent:'#1e3a5f', accentLight:'#1d4ed8', desc:'วิชาการ: Sarabun ขอบสมมาตร บรรทัดเรียบร้อย' },
  dramatic:  { fontSize:14, lineHeight:185, marginV:52, marginH:48, textAlign:'justify', dropCap:true,  font:'Noto Serif Thai', accent:'#7f1d1d', accentLight:'#dc2626', desc:'Dramatic: Noto Serif สีแดง drop cap เข้มข้น' },
};

function applyLayoutCard(name, cardEl) {
  const preset = layoutPresets[name];
  if (!preset) return;
  recordHistory();
  document.querySelectorAll('.layout-card').forEach(b => b.classList.remove('active'));
  if (cardEl) cardEl.classList.add('active');

  const fsEl = document.getElementById('fontSize');
  if (fsEl) { fsEl.value = preset.fontSize; document.getElementById('fontSizeVal').textContent = preset.fontSize + 'px'; }
  const lhEl = document.getElementById('lineHeight');
  if (lhEl) { lhEl.value = preset.lineHeight; document.getElementById('lineHeightVal').textContent = (preset.lineHeight/100).toFixed(2); }
  const mvEl = document.getElementById('marginV');
  if (mvEl) { mvEl.value = preset.marginV; document.getElementById('marginVVal').textContent = preset.marginV + 'px'; }
  const mhEl = document.getElementById('marginH');
  if (mhEl) { mhEl.value = preset.marginH; document.getElementById('marginHVal').textContent = preset.marginH + 'px'; }

  textAlign = preset.textAlign;
  document.querySelectorAll('input[name=align]').forEach(r => r.checked = r.value === textAlign);
  dropCap = preset.dropCap;
  document.getElementById('showDropCap').checked = dropCap;
  bodyFont = preset.font;
  document.querySelectorAll('.font-btn').forEach(b => b.classList.toggle('active', b.textContent.trim().startsWith(preset.font)));
  document.documentElement.style.setProperty('--accent', preset.accent);
  document.documentElement.style.setProperty('--accent-light', preset.accentLight);

  document.getElementById('layoutDesc').textContent = preset.desc;
  renderChapterPages();
  showToast('✅ ' + (cardEl?.querySelector('.lc-name')?.textContent || name));
}

// keep old applyLayout pointing to new function for backward compat
function applyLayout(name, btnEl) { applyLayoutCard(name, document.getElementById('lcard-' + name)); }



// ── Jump to page by number ──
function jumpToPage() {
  const n = parseInt(document.getElementById('navJumpInput').value) - 1;
  if (isNaN(n) || n < 0 || n >= allPages.length) { showToast('❌ หน้าไม่ถูกต้อง'); return; }
  const step = viewMode === 'spread' ? 2 : 1;
  currentPageIndex = viewMode === 'spread' ? Math.floor(n / 2) * 2 : n;
  applyViewMode();
}

function jumpToPageByLabel(val) {
  if (!val) return;
  const idx = parseInt(val);
  if (!isNaN(idx) && idx >= 0 && idx < allPages.length) {
    currentPageIndex = viewMode === 'spread' ? Math.floor(idx / 2) * 2 : idx;
    applyViewMode();
  }
  document.getElementById('pageSelectDropdown').value = '';
}

function buildPageDropdown() {
  const sel = document.getElementById('pageSelectDropdown');
  const tsel = document.getElementById('toolbarPageSelect');
  if (!sel) return;
  const opts = '<option value="">— เลือกหน้า —</option>' + allPages.map((u, i) => {
    const labelText = u.label ? u.label.textContent.trim() : `หน้า ${i + 1}`;
    const short = labelText.length > 30 ? labelText.substring(0, 30) + '…' : labelText;
    return `<option value="${i}">${i + 1}. ${short}</option>`;
  }).join('');
  sel.innerHTML = opts;
  if (tsel) {
    tsel.innerHTML = '<option value="">ไปหน้า...</option>' + allPages.map((u, i) => {
      const labelText = u.label ? u.label.textContent.trim().substring(0, 22) : `หน้า ${i + 1}`;
      return `<option value="${i}">${i + 1}. ${labelText}</option>`;
    }).join('');
  }
}

function toolbarJumpToPage(val) {
  if (!val) return;
  const idx = parseInt(val);
  if (!isNaN(idx) && idx >= 0 && idx < allPages.length) {
    currentPageIndex = viewMode === 'spread' ? Math.floor(idx / 2) * 2 : idx;
    // Switch to single if in scroll
    if (viewMode === 'scroll') { setViewMode('single', document.getElementById('vbSingle')); }
    else applyViewMode();
  }
  document.getElementById('toolbarPageSelect').value = '';
}

// ── Wrap selected text in editor with style markers ──
function wrapSelectedText(style) {
  const ta = document.getElementById('chapterEditor');
  const s = ta.selectionStart, e = ta.selectionEnd;
  const sel = ta.value.substring(s, e);
  if (!sel) { showToast('กรุณาคลุมข้อความก่อน'); return; }
  let wrapped;
  switch(style) {
    case 'quote': wrapped = `«${sel}»`; break;
    case 'boldem': wrapped = `**${sel}**`; break;
    case 'highlight': wrapped = `==${sel}==`; break;
    case 'cmd': wrapped = `\`${sel}\``; break;
    case 'em': wrapped = `_${sel}_`; break;
    default: wrapped = sel;
  }
  ta.value = ta.value.substring(0, s) + wrapped + ta.value.substring(e);
  ta.selectionStart = s; ta.selectionEnd = s + wrapped.length;
  ta.focus();
  updateChapterContent(ta.value);
}


let inlineFmtBarTimer;
function showInlineFmtBarOnSelect(sourceEl) {
  clearTimeout(inlineFmtBarTimer);
  inlineFmtBarTimer = setTimeout(() => {
    const sel = window.getSelection();
    const bar = document.getElementById('inlineFmtBar');
    if (!bar) return;
    if (sel && !sel.isCollapsed && sel.toString().length > 0) {
      // Check selection is inside chapterEditor OR any page-body
      const ed = weGetEditor();
      const anchorNode = sel.anchorNode;
      const inEditor = ed && ed.contains(anchorNode);
      const inPageBody = anchorNode && anchorNode.parentElement && anchorNode.parentElement.closest('.page-body');
      if (!inEditor && !inPageBody) { hideInlineFmtBar(); return; }
      // Save selection range so size/color buttons can restore it after focus shifts
      window._savedSel = sel.rangeCount > 0 ? sel.getRangeAt(0).cloneRange() : null;
      // Position bar near selection
      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      bar.classList.add('show');
      const barW = bar.offsetWidth || 360;
      let left = rect.left + rect.width / 2 - barW / 2;
      let top = rect.top - 44;
      if (top < 56) top = rect.bottom + 8;
      left = Math.max(8, Math.min(window.innerWidth - barW - 8, left));
      top  = Math.max(8, Math.min(window.innerHeight - 60, top));
      bar.style.top  = top  + 'px';
      bar.style.left = left + 'px';
    } else {
      hideInlineFmtBar();
    }
  }, 80);
}

function hideInlineFmtBar() {
  document.getElementById('inlineFmtBar')?.classList.remove('show');
}

// Hide inline fmt bar when clicking outside editor/page-body or bar
document.addEventListener('mousedown', (e) => {
  const bar = document.getElementById('inlineFmtBar');
  const ed  = document.getElementById('chapterEditor');
  if (!bar) return;
  if (bar.contains(e.target)) return; // clicked inside bar — let button work
  if (ed && ed.contains(e.target)) return; // still inside editor
  if (e.target.closest('.page-body')) return; // clicked in a page-body
  hideInlineFmtBar();
}, true);

// ── Rich-text parser: convert markdown-ish markup to HTML ──
function parseRichText(text) {
  // Handle properly-closed inline tags ([\s\S]+? allows multiline content within a single para call)
  let out = text
    .replace(/\*\*(.+?)\*\*/g, '<strong style="font-weight:700;color:var(--accent)">$1</strong>')
    .replace(/__(.+?)__/g, '<span style="text-decoration:underline">$1</span>')
    .replace(/_(.+?)_/g, '<em>$1</em>')
    .replace(/==(.+?)==/g, '<mark style="background:rgba(201,162,39,0.25);border-radius:2px;padding:0 2px">$1</mark>')
    .replace(/`(.+?)`/g, '<code style="font-family:monospace;background:rgba(139,69,19,0.1);border-radius:3px;padding:0 4px;font-size:0.88em">$1</code>')
    .replace(/<color:(#[0-9a-fA-F]{3,6})>([\s\S]+?)<\/color>/g, '<span style="color:$1">$2</span>')
    .replace(/<size:(\d+)>([\s\S]+?)<\/size>/g, '<span style="font-size:$1px">$2</span>')
    .replace(/<font:([^>]+)>([\s\S]+?)<\/font>/g, '<span style="font-family:\'$1\',sans-serif">$2</span>')
    .replace(/«(.+?)»/g, '<span style="font-style:italic;color:var(--gold)">«$1»</span>');
  // Strip any remaining unclosed/malformed markup tags
  out = out.replace(/<size:\d+>/g, '').replace(/<\/size>/g, '');
  out = out.replace(/<color:#[0-9a-fA-F]{3,6}>/g, '').replace(/<\/color>/g, '');
  out = out.replace(/<font:[^>]+>/g, '').replace(/<\/font>/g, '');
  return out;
}

// ── Sync field from context panel to main sidebar ──
function syncField(fieldId, val) {
  const el = document.getElementById(fieldId);
  if (el) { el.value = val; }
  // Also sync reverse: other ctx fields with same fieldId
  ['ctx-bookTitle','ctx-penName','ctx-genre','ctx-bookSubtitle',
   'ctx2-bookTitle','ctx2-authorName','ctx2-publisher','ctx2-pubYear'].forEach(ctxId => {
    const mapped = ctxId.replace(/^ctx2?-/, '');
    if (mapped === fieldId) {
      const ctxEl = document.getElementById(ctxId);
      if (ctxEl && ctxEl.value !== val) ctxEl.value = val;
    }
  });
  updatePreview();
  if (typeof autoSaveDebounce === 'function') autoSaveDebounce();
}

// ── Update right panel context based on current page ──
function updateRightPanelContext() {
  if (viewMode === 'scroll') return; // don't switch in scroll mode
  const u = allPages[currentPageIndex];
  if (!u) return;
  const labelText = u.label ? u.label.textContent.trim() : '';
  const pageEl = u.pages[0];

  // Determine context type
  let ctx = 'chapter';
  if (pageEl && pageEl.classList.contains('page-cover')) ctx = 'cover';
  else if (pageEl && pageEl.classList.contains('page-title-page')) ctx = 'title';
  else if (pageEl && (pageEl.classList.contains('page-toc') ||
           pageEl.classList.contains('page-preface') ||
           pageEl.classList.contains('page-dedication'))) ctx = 'special';

  // Show correct context panel
  document.querySelectorAll('.ctx-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('ctx-' + ctx)?.classList.add('active');

  // Switch to editor tab automatically
  const editorTab = document.getElementById('ptabEditor');
  if (editorTab && !editorTab.classList.contains('active')) {
    switchTab('editor', editorTab);
  }

  if (ctx === 'cover') {
    // Sync cover fields
    ['bookTitle','penName','genre','bookSubtitle'].forEach(id => {
      const src = document.getElementById(id);
      const dst = document.getElementById('ctx-' + id);
      if (src && dst) dst.value = src.value;
    });
  } else if (ctx === 'title') {
    ['bookTitle','authorName','publisher','pubYear'].forEach(id => {
      const src = document.getElementById(id);
      const dst = document.getElementById('ctx2-' + id);
      if (src && dst) dst.value = src.value;
    });
  } else if (ctx === 'special') {
    document.getElementById('ctxSpecialNum').textContent = currentPageIndex + 1;
    const nameMap = { 'page-toc': 'สารบัญ', 'page-preface': 'คำนำ', 'page-dedication': 'คำอุทิศ' };
    const cls = pageEl ? Array.from(pageEl.classList).find(c => nameMap[c]) : null;
    document.getElementById('ctxSpecialName').textContent = cls ? nameMap[cls] : 'หน้าพิเศษ';
  } else if (ctx === 'chapter') {
    // Find which chapter this page belongs to
    const chIdx = labelText.match(/บทที่\s*(\d+)/)?.[1];
    if (chIdx) {
      const ch = chapters[parseInt(chIdx) - 1];
      if (ch && ch.id !== currentChapterId) {
        // silently load chapter into editor without page-jumping
        currentChapterId = ch.id;
        document.getElementById('chapterTitleInput').value = ch.title;
        weLoad(ch.content);
        document.getElementById('chapterNote').value = ch.note || '';
        const wrap = document.getElementById('chImgPreviewWrap');
        const drop = document.getElementById('chImgDrop');
        if (ch.imageData) {
          document.getElementById('chImgPreview').src = ch.imageData;
          document.getElementById('chImgSize').value = ch.imageSize || 100;
          document.getElementById('chImgSizeVal').textContent = (ch.imageSize || 100) + '%';
          wrap.style.display = 'block'; drop.style.display = 'none';
        } else {
          wrap.style.display = 'none'; drop.style.display = 'block';
        }
        renderChapterList();
      }
    }
    // Show badge
    const badge = document.getElementById('ctxChapterBadge');
    if (badge) {
      badge.style.display = 'flex';
      document.getElementById('ctxChapterNum').textContent = currentPageIndex + 1;
      const chTitle = labelText.replace(/\s*\(ต่อ\).*$/, '');
      document.getElementById('ctxChapterName').textContent = chTitle.substring(0, 22);
    }
    // Update page text preview
    const pageEl2 = u.pages[0];
    updatePageTextPreview(pageEl2);
  }
}


(function() {
  function initResize(handleId, panelSel, cssVar, side) {
    const handle = document.getElementById(handleId);
    if (!handle) return;
    let dragging = false;
    let startX = 0;
    let startW = 0;

    handle.addEventListener('mousedown', (e) => {
      if (e.target.classList.contains('panel-collapse-btn')) return;
      dragging = true;
      startX = e.clientX;
      const panel = document.querySelector(panelSel);
      startW = panel.getBoundingClientRect().width;
      handle.classList.add('dragging');
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    });

    document.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      const panel = document.querySelector(panelSel);
      const minW = parseInt(getComputedStyle(panel).minWidth) || 160;
      const maxW = parseInt(getComputedStyle(panel).maxWidth) || 520;
      let delta = side === 'left' ? e.clientX - startX : startX - e.clientX;
      let newW = Math.max(minW, Math.min(maxW, startW + delta));
      document.documentElement.style.setProperty(cssVar, newW + 'px');
    });

    document.addEventListener('mouseup', () => {
      if (!dragging) return;
      dragging = false;
      handle.classList.remove('dragging');
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    });
  }

  window.addEventListener('DOMContentLoaded', () => {
    initResize('leftResizeHandle', '.sidebar', '--sidebar-w', 'left');
    initResize('rightResizeHandle', '.right-panel', '--rightpanel-w', 'right');
  });
})();

// ── Panel collapse toggle ──
const _panelOrigW = {};
function togglePanelCollapse(side) {
  if (side === 'left') {
    const panel = document.querySelector('.sidebar');
    const btn = document.getElementById('leftCollapseBtn');
    if (panel.classList.contains('collapsed-panel')) {
      const prev = _panelOrigW['left'] || '280px';
      document.documentElement.style.setProperty('--sidebar-w', prev);
      panel.classList.remove('collapsed-panel');
      btn.textContent = '◀';
      btn.title = 'ซ่อนแผงซ้าย';
    } else {
      _panelOrigW['left'] = getComputedStyle(panel).width;
      panel.classList.add('collapsed-panel');
      btn.textContent = '▶';
      btn.title = 'แสดงแผงซ้าย';
    }
  } else {
    const panel = document.querySelector('.right-panel');
    const btn = document.getElementById('rightCollapseBtn');
    if (panel.classList.contains('collapsed-panel')) {
      const prev = _panelOrigW['right'] || '260px';
      document.documentElement.style.setProperty('--rightpanel-w', prev);
      panel.classList.remove('collapsed-panel');
      btn.textContent = '▶';
      btn.title = 'ซ่อนแผงขวา';
    } else {
      _panelOrigW['right'] = getComputedStyle(panel).width;
      panel.classList.add('collapsed-panel');
      btn.textContent = '◀';
      btn.title = 'แสดงแผงขวา';
    }
  }
}

// ── Page Number Style ──
let pageNumStyle = 'dash'; // dash | plain | dot | thai
let pageNumSize = 11;
let dropCapSize = 52;
let dropCapFont = 'Playfair Display';
let dropCapColor = null; // null = use accent color

// Page border decoration
let pageBorderPattern = 'none';
let pageBorderColor = '#8b4513';
let pageBorderThickness = 10;
let pageBorderLineWeight = 2;

function setPageNumStyle(style, btn) {
  pageNumStyle = style;
  document.querySelectorAll('.page-num-style-row button').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderChapterPages();
}

function updatePageNumSize(val) {
  pageNumSize = parseInt(val);
  document.getElementById('pageNumSizeVal').textContent = val + 'px';
  renderChapterPages();
}

function formatPageNum(n) {
  return formatPageNumAdvanced(n);
}

function updateDropCapSize(val) {
  const sizeEl = document.getElementById('dropCapSize');
  const valEl = document.getElementById('dropCapSizeVal');
  dropCapSize = parseInt(sizeEl.value) || 52;
  dropCapFont = document.getElementById('dropCapFont').value || 'Playfair Display';
  dropCapColor = document.getElementById('dropCapColor') ? document.getElementById('dropCapColor').value : null;
  if (valEl) valEl.textContent = dropCapSize + 'px';
  renderChapterPages();
}

// ── Per-page layout overrides ──
const perPageLayouts = {}; // key: chapterId_pageIndex -> preset name
let _currentCtxPageKey = null;
let _perPageScope = 'page'; // 'page' | 'chapter' | 'all'

function setPerPageScope(scope, btnEl) {
  _perPageScope = scope;
  document.querySelectorAll('#ppscope-page,#ppscope-chapter,#ppscope-all').forEach(b => b.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');
  const hint = document.getElementById('ppScopeHint');
  if (hint) {
    const msgs = {
      page: '📄 ใช้กับหน้านี้เท่านั้น',
      chapter: '📖 ใช้กับทุกหน้าในบทนี้',
      all: '📚 ใช้กับทุกบท ทุกหน้า (global)'
    };
    hint.textContent = msgs[scope] || '';
  }
}

function openPerPagePopup(e, chId, pgIdx) {
  e.stopPropagation();
  _currentCtxPageKey = `${chId}_${pgIdx}`;
  const popup = document.getElementById('perPagePopup');
  popup.classList.add('open');
  const active = perPageLayouts[_currentCtxPageKey];
  popup.querySelectorAll('.layout-card').forEach(c => {
    const name = c.getAttribute('onclick')?.match(/'(\w+)'/)?.[1];
    c.classList.toggle('active', name === active);
  });
  // Position near click
  let x = e.clientX + 8, y = e.clientY + 8;
  if (x + 270 > window.innerWidth) x = e.clientX - 270;
  if (y + 480 > window.innerHeight) y = e.clientY - 480;
  popup.style.left = x + 'px';
  popup.style.top = y + 'px';
}

function closePerPagePopup() {
  document.getElementById('perPagePopup').classList.remove('open');
}

function applyPerPageLayout(name, cardEl) {
  if (!_currentCtxPageKey && _perPageScope === 'page') return;
  closePerPagePopup();

  if (_perPageScope === 'page') {
    // เฉพาะหน้านี้
    perPageLayouts[_currentCtxPageKey] = name;
    renderChapterPages();
    showToast('✅ ตั้ง Layout "' + name + '" สำหรับหน้านี้');
  } else if (_perPageScope === 'chapter') {
    // ทุกหน้าในบทนี้ — parse chId from key
    const chId = _currentCtxPageKey ? _currentCtxPageKey.split('_')[0] : null;
    if (!chId) return;
    // Apply to all existing page keys of this chapter
    Object.keys(perPageLayouts).forEach(k => {
      if (k.startsWith(chId + '_')) delete perPageLayouts[k];
    });
    // Mark chapter-level: set for pages 0–99
    for (let i = 0; i < 100; i++) {
      perPageLayouts[`${chId}_${i}`] = name;
    }
    renderChapterPages();
    showToast('✅ ตั้ง Layout "' + name + '" สำหรับทั้งบท');
  } else if (_perPageScope === 'all') {
    // ทุกบท ทุกหน้า → ใช้ applyLayoutCard (global)
    applyLayoutCard(name, null);
    // Clear all per-page overrides
    Object.keys(perPageLayouts).forEach(k => delete perPageLayouts[k]);
    showToast('✅ ตั้ง Layout "' + name + '" ทุกหน้า (global)');
  }
}

function clearPerPageLayout() {
  if (_perPageScope === 'page') {
    if (_currentCtxPageKey) delete perPageLayouts[_currentCtxPageKey];
    showToast('✕ ล้าง Layout หน้านี้แล้ว');
  } else if (_perPageScope === 'chapter') {
    const chId = _currentCtxPageKey ? _currentCtxPageKey.split('_')[0] : null;
    if (chId) Object.keys(perPageLayouts).forEach(k => { if (k.startsWith(chId + '_')) delete perPageLayouts[k]; });
    showToast('✕ ล้าง Layout ทั้งบทแล้ว');
  } else if (_perPageScope === 'all') {
    Object.keys(perPageLayouts).forEach(k => delete perPageLayouts[k]);
    showToast('✕ ล้าง Layout ทั้งหมดแล้ว');
  }
  closePerPagePopup();
  renderChapterPages();
}

// ── Free drag images on pages ──
let _freeImgTargetPageEl = null;
let _freeImgSerial = 0;
// Store free images per chapter+page: key=chId_pgIdx, value=[{id,src,x,y,w,h}]
const freeImages = {};

// Global drag state for free images (prevents multiple listener leaks)
const _fiDrag = { active: false, el: null, imgData: null, startMX: 0, startMY: 0, ox: 0, oy: 0 };
const _fiResize = { active: false, el: null, imgData: null, sx: 0, sy: 0, ow: 0, oh: 0, ox: 0, oy: 0, dir: 'rh-se' };
// Store the key (chId_pageIdx) at right-click time so it survives re-renders
let _freeImgTargetKey = '';

function _fiToPageCoords(cx, cy, el) {
  const pageEl = el.parentElement;
  if (!pageEl) return { x: cx, y: cy };
  // getBoundingClientRect already reflects the visual (CSS-transformed) position.
  // Dividing by the same scale factor gives logical page coordinates.
  const rect = pageEl.getBoundingClientRect();
  // Measure actual rendered width vs CSS width to derive true scale
  const cssW = parseFloat(getComputedStyle(pageEl).width) || 559;
  const sc = cssW > 0 ? rect.width / cssW : (zoomLevel || 100) / 100;
  return { x: (cx - rect.left) / sc, y: (cy - rect.top) / sc };
}

function _fiMove(cx, cy) {
  if (_fiDrag.active) {
    const pt = _fiToPageCoords(cx, cy, _fiDrag.el);
    _fiDrag.imgData.x = _fiDrag.ox + (pt.x - _fiDrag.startMX);
    _fiDrag.imgData.y = _fiDrag.oy + (pt.y - _fiDrag.startMY);
    _fiDrag.el.style.left = _fiDrag.imgData.x + 'px';
    _fiDrag.el.style.top  = _fiDrag.imgData.y + 'px';
  }
  if (_fiResize.active) {
    const pt = _fiToPageCoords(cx, cy, _fiResize.el);
    const dx = pt.x - _fiResize.sx;
    const dy = pt.y - _fiResize.sy;
    const dir = _fiResize.dir || 'rh-se';
    let nw = _fiResize.ow, nh = _fiResize.oh, nx = _fiResize.ox, ny = _fiResize.oy;
    if (dir.includes('e'))  nw = Math.max(40, _fiResize.ow + dx);
    if (dir.includes('w')) { nw = Math.max(40, _fiResize.ow - dx); nx = _fiResize.ox + (_fiResize.ow - nw); }
    if (dir.includes('s'))  nh = Math.max(30, _fiResize.oh + dy);
    if (dir.includes('n')) { nh = Math.max(30, _fiResize.oh - dy); ny = _fiResize.oy + (_fiResize.oh - nh); }
    _fiResize.imgData.w = nw; _fiResize.imgData.h = nh;
    _fiResize.imgData.x = nx; _fiResize.imgData.y = ny;
    _fiResize.el.style.width  = nw + 'px';
    _fiResize.el.style.height = nh + 'px';
    _fiResize.el.style.left   = nx + 'px';
    _fiResize.el.style.top    = ny + 'px';
    updatePageTextBudget(_fiResize.el.parentElement);
  }
}
function _fiEnd() {
  if (_fiResize.active) { _fiResize.active = false; updatePageTextBudget(_fiResize.el?.parentElement); }
  _fiDrag.active = false;
}
document.addEventListener('mousemove', (e) => {
  if (_fiDrag.active || _fiResize.active) { _fiMove(e.clientX, e.clientY); e.preventDefault(); }
});
document.addEventListener('mouseup', _fiEnd);
// Touch support for tablet
document.addEventListener('touchmove', (e) => {
  if (_fiDrag.active || _fiResize.active) {
    const t = e.touches[0];
    _fiMove(t.clientX, t.clientY);
    e.preventDefault();
  }
}, { passive: false });
document.addEventListener('touchend', _fiEnd);
document.addEventListener('touchcancel', _fiEnd);

function ctxInsertFreeImage() {
  closeCtxMenu();
  document.getElementById('freeImgInput').click();
}

function handleFreeImgUpload(input) {
  const file = input.files[0];
  // Try to find the live page element by key (survives re-render)
  let pageEl = _freeImgTargetKey
    ? document.querySelector(`[data-free-img-key="${_freeImgTargetKey}"]`)
    : _freeImgTargetPageEl;
  if (!file || !pageEl) { showToast('⚠️ กรุณาคลิกขวาบนหน้าก่อนแทรกรูป'); input.value = ''; return; }
  const key = _freeImgTargetKey || pageEl.dataset.freeImgKey || '';
  const reader = new FileReader();
  reader.onload = (ev) => {
    // Re-query page element in case re-render happened while reading file
    const livePage = document.querySelector(`[data-free-img-key="${key}"]`) || pageEl;
    if (!freeImages[key]) freeImages[key] = [];
    const id = 'fi_' + (++_freeImgSerial);
    const imgData = { id, src: ev.target.result, x: 40, y: 80, w: 180, h: 140, rotation: 0 };
    freeImages[key].push(imgData);
    addFreeImageToPage(livePage, imgData, key);
    showToast('🖼 แทรกรูปอิสระเรียบร้อย — ลากวางได้เลย');
  };
  reader.readAsDataURL(file);
  input.value = '';
}

// Re-trigger updatePreview when image size changes so text reflows
function updatePageTextBudget(pageEl) {
  if (!pageEl) return;
  // Debounce to avoid re-rendering on every pixel during drag
  clearTimeout(updatePageTextBudget._t);
  updatePageTextBudget._t = setTimeout(() => { updatePreview(); }, 350);
}

function addFreeImageToPage(pageEl, imgData, key) {
  const div = document.createElement('div');
  div.className = 'free-img';
  div.id = imgData.id;
  const zIdx = imgData.zLayer === 'front' ? 50 : imgData.zLayer === 'back' ? 1 : imgData.zLayer === 'top' ? 100 : 5;
  div.style.cssText = `left:${imgData.x}px;top:${imgData.y}px;width:${imgData.w}px;height:${imgData.h}px;z-index:${zIdx};`;
  if (imgData.rotation) div.style.transform = `rotate(${imgData.rotation}deg)`;
  if (imgData.opacity != null) div.style.opacity = imgData.opacity;
  div.innerHTML = `
    <div class="fi-toolbar">
      <button title="ลบ" onclick="removeFreeImg('${imgData.id}','${key}')">✕</button>
      <button title="หมุน 15°" onclick="rotateFreeImg('${imgData.id}','${key}',15)">↻</button>
      <button title="หมุน -15°" onclick="rotateFreeImg('${imgData.id}','${key}',-15)">↺</button>
      <span class="fi-sep">|</span>
      <button title="ด้านหน้าสุด (z100)" onclick="setFreeImgLayer('${imgData.id}','${key}','top')" style="font-size:10px">⬆top</button>
      <button title="หน้าข้อความ (z50)" onclick="setFreeImgLayer('${imgData.id}','${key}','front')" style="font-size:10px">▲หน้า</button>
      <button title="ทับข้อความ (z20)" onclick="setFreeImgLayer('${imgData.id}','${key}','over')" style="font-size:10px">◈ทับ</button>
      <button title="ใต้ข้อความ (z1)" onclick="setFreeImgLayer('${imgData.id}','${key}','back')" style="font-size:10px">▼หลัง</button>
      <span class="fi-sep">|</span>
      <input type="range" min="10" max="100" value="${Math.round((imgData.opacity||1)*100)}" title="ความโปร่งใส" style="width:48px;margin:0;padding:0;accent-color:#fff" oninput="setFreeImgOpacity('${imgData.id}','${key}',this.value/100)">
    </div>
    <img src="${imgData.src}" draggable="false">
    <div class="resize-dot rh rh-se" title="ปรับขนาด"></div>
    <div class="rh rh-nw" title="ปรับขนาด"></div>
    <div class="rh rh-n"  title="ปรับขนาด"></div>
    <div class="rh rh-ne" title="ปรับขนาด"></div>
    <div class="rh rh-e"  title="ปรับขนาด"></div>
    <div class="rh rh-s"  title="ปรับขนาด"></div>
    <div class="rh rh-sw" title="ปรับขนาด"></div>
    <div class="rh rh-w"  title="ปรับขนาด"></div>
  `;
  pageEl.appendChild(div);

  // Touch support: drag the image
  div.addEventListener('touchstart', (e) => {
    if (e.target.classList.contains('rh') || e.target.classList.contains('resize-dot') || e.target.closest('.fi-toolbar')) return;
    const t = e.touches[0];
    const pt = _fiToPageCoords(t.clientX, t.clientY, div);
    _fiDrag.active = true; _fiDrag.el = div; _fiDrag.imgData = imgData;
    _fiDrag.startMX = pt.x; _fiDrag.startMY = pt.y;
    _fiDrag.ox = imgData.x; _fiDrag.oy = imgData.y;
    e.preventDefault();
  }, { passive: false });
  // Touch support: resize dot
  const rdot = div.querySelector('.resize-dot');
  if (rdot) rdot.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    const pt = _fiToPageCoords(t.clientX, t.clientY, div);
    _fiResize.active = true; _fiResize.el = div; _fiResize.imgData = imgData;
    _fiResize.sx = pt.x; _fiResize.sy = pt.y;
    _fiResize.ow = imgData.w; _fiResize.oh = imgData.h;
    e.preventDefault();
  }, { passive: false });
  makeFreeImgDraggable(div, imgData, key);
  makeFreeImgResizable(div, imgData, key);
}

function makeFreeImgDraggable(el, imgData, key) {
  el.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('rh') || e.target.classList.contains('resize-dot') || e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') return;
    // Select this image
    document.querySelectorAll('.free-img').forEach(f => f.classList.remove('selected'));
    el.classList.add('selected');
    // Start drag
    const pt = _fiToPageCoords(e.clientX, e.clientY, el);
    _fiDrag.active = true;
    _fiDrag.el = el;
    _fiDrag.imgData = imgData;
    _fiDrag.startMX = pt.x;
    _fiDrag.startMY = pt.y;
    _fiDrag.ox = imgData.x;
    _fiDrag.oy = imgData.y;
    e.preventDefault();
    e.stopPropagation();
  });
}

function setFreeImgLayer(id, key, layer) {
  const el = document.getElementById(id);
  const arr = freeImages[key];
  const imgData = arr ? arr.find(f => f.id === id) : null;
  const zMap = { top: 100, front: 50, over: 20, back: 1 };
  const z = zMap[layer] || 10;
  if (el) el.style.zIndex = z;
  if (imgData) imgData.zLayer = layer;
}

function setFreeImgOpacity(id, key, val) {
  const el = document.getElementById(id);
  const arr = freeImages[key];
  const imgData = arr ? arr.find(f => f.id === id) : null;
  if (el) el.style.opacity = val;
  if (imgData) imgData.opacity = val;
}

function makeFreeImgResizable(el, imgData, key) {
  const handles = el.querySelectorAll('.rh');
  handles.forEach(handle => {
    handle.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      e.preventDefault();
      const pt = _fiToPageCoords(e.clientX, e.clientY, el);
      const dir = Array.from(handle.classList).find(c => c.startsWith('rh-') && c !== 'rh');
      _fiResize.active = true;
      _fiResize.el = el;
      _fiResize.imgData = imgData;
      _fiResize.dir = dir || 'rh-se';
      _fiResize.sx = pt.x; _fiResize.sy = pt.y;
      _fiResize.ow = imgData.w; _fiResize.oh = imgData.h;
      _fiResize.ox = imgData.x; _fiResize.oy = imgData.y;
    });
    handle.addEventListener('touchstart', (e) => {
      e.stopPropagation();
      const t = e.touches[0];
      const pt = _fiToPageCoords(t.clientX, t.clientY, el);
      const dir = Array.from(handle.classList).find(c => c.startsWith('rh-') && c !== 'rh');
      _fiResize.active = true; _fiResize.el = el; _fiResize.imgData = imgData;
      _fiResize.dir = dir || 'rh-se';
      _fiResize.sx = pt.x; _fiResize.sy = pt.y;
      _fiResize.ow = imgData.w; _fiResize.oh = imgData.h;
      _fiResize.ox = imgData.x; _fiResize.oy = imgData.y;
      e.preventDefault();
    }, { passive: false });
  });
}

function removeFreeImg(id, key) {
  const el = document.getElementById(id);
  if (el) el.remove();
  if (freeImages[key]) {
    freeImages[key] = freeImages[key].filter(f => f.id !== id);
  }
}

function rotateFreeImg(id, key, deg) {
  const arr = freeImages[key];
  if (!arr) return;
  const imgData = arr.find(f => f.id === id);
  if (!imgData) return;
  imgData.rotation = (imgData.rotation || 0) + deg;
  const el = document.getElementById(id);
  if (el) el.style.transform = `rotate(${imgData.rotation}deg)`;
}

function restoreFreeImages(pageEl, key) {
  if (!freeImages[key]) return;
  freeImages[key].forEach(imgData => addFreeImageToPage(pageEl, imgData, key));
}

// ── Right-click context menu ──
let _ctxMenuTarget = null;
const menu = () => document.getElementById('rightClickMenu');

function openCtxMenu(e, pageEl) {
  e.preventDefault();
  _freeImgTargetPageEl = pageEl;
  _freeImgTargetKey = pageEl.dataset.freeImgKey || '';
  _ctxMenuTarget = pageEl;
  const m = menu();
  m.classList.add('open');
  let x = e.clientX + 4, y = e.clientY + 4;
  if (x + 240 > window.innerWidth) x = e.clientX - 240;
  if (y + 400 > window.innerHeight) y = e.clientY - 380;
  m.style.left = x + 'px';
  m.style.top = y + 'px';
}

function closeCtxMenu() {
  menu().classList.remove('open');
}

document.addEventListener('pointerdown', (e) => {
  // Close ctx menu only if click is outside it — use pointerdown so actions inside still fire
  if (!menu().contains(e.target)) {
    // Small delay so menu item onclick fires before we remove the menu
    setTimeout(closeCtxMenu, 80);
  }
  if (!document.getElementById('perPagePopup').contains(e.target)) {
    setTimeout(closePerPagePopup, 80);
  }
  if (!e.target.closest('.free-img')) {
    document.querySelectorAll('.free-img').forEach(f => f.classList.remove('selected'));
  }
});

function ctxFmt(type) {
  closeCtxMenu();
  applyInlineFmt(type);
}

function ctxSetColor(color) {
  closeCtxMenu();
  document.getElementById('ifbColor').value = color;
  document.getElementById('ifbColorSwatch').style.background = color;
  applyInlineFmt('color');
}

function ctxSetFontSize(val) {
  document.getElementById('ifbSize').value = val;
  weFormat('size');
  closeCtxMenu();
}

function ctxSetFont(font) {
  const ed = weGetEditor();
  if (!ed) return;
  ed.focus();
  const sel = window.getSelection();
  if (!sel || sel.isCollapsed) { showToast('คลุมข้อความก่อนตั้งฟอนต์'); return; }
  const range = sel.getRangeAt(0);
  const node = document.createElement('span');
  node.style.fontFamily = `'${font}', sans-serif`;
  try { range.surroundContents(node); } catch(e) {}
  weOnInput();
  closeCtxMenu();
}

function ctxAlign(align) {
  // Update the align buttons in ctx menu
  document.querySelectorAll('#ctxAlignRow button').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  setTextAlign(align);
  closeCtxMenu();
}

// ── Page text preview update ──
// ── Page Rich-Text Editor ──
let _pedCurrentPageEl = null;
let _pedCurrentPageParas = []; // paragraph indices on this page
let _pedCurrentChId = null;
let _pedCurrentPiStart = 0; // first paragraph index of this page in chapter

function updatePageTextPreview(pageEl) {
  const wrap = document.getElementById('pageTextPreviewWrap');
  const body = document.getElementById('pedBody');
  if (!pageEl || !wrap || !body) return;
  const bodyEl = pageEl.querySelector('.page-body');
  if (!bodyEl) { wrap.style.display = 'none'; return; }

  _pedCurrentPageEl = pageEl;

  // Figure out which chapter + page index this page belongs to
  // pageEl.dataset.freeImgKey = "chId_pageIndex"
  const key = pageEl.dataset.freeImgKey || '';
  const [chIdStr, piStr] = key.split('_');
  const chId = parseInt(chIdStr);
  const pi = parseInt(piStr) || 0;
  _pedCurrentChId = chId;

  const ch = chapters.find(c => c.id === chId);
  if (!ch) { wrap.style.display = 'none'; return; }

  // Collect paragraphs for this page by re-splitting (same logic as renderChapterPages)
  const allParas = ch.content.split('\n').filter(p => p.trim());
  const fs = parseInt(document.getElementById('fontSize').value) || 15;
  const lh = document.getElementById('lineHeight').value / 100;
  const mv = parseInt(document.getElementById('marginV').value) || 56;
  const mh = parseInt(document.getElementById('marginH').value) || 52;
  const showHeader = document.getElementById('showHeader').checked;
  const showPageNum = document.getElementById('showPageNum').checked;
  const contentW = 559 - 2 * mh;
  const headerH = showHeader ? 32 : 0;
  const footerH = showPageNum ? 32 : 0;
  const contentH = 794 - mv - (mv + 8) - headerH - footerH;
  const charsPerLine = Math.floor(contentW / (fs * 0.56));
  const linesPerPage = Math.floor(contentH / (fs * lh));
  const CHARS_PER_PAGE = Math.max(400, charsPerLine * linesPerPage);
  const TITLE_RESERVE = Math.ceil(180 / (fs * lh));
  const firstPageChars = Math.max(100, CHARS_PER_PAGE - (TITLE_RESERVE * charsPerLine));

  const pageGroups = [[]];
  let charCount = 0;
  let isFirst2 = true;
  const pageLimit2 = () => isFirst2 ? firstPageChars : CHARS_PER_PAGE;
  allParas.forEach(p => {
    const pLen = p.length + 1;
    if (charCount + pLen > pageLimit2() && pageGroups[pageGroups.length - 1].length > 0) {
      pageGroups.push([]); charCount = 0; isFirst2 = false;
    }
    pageGroups[pageGroups.length - 1].push(p);
    charCount += pLen;
    if (charCount >= pageLimit2()) isFirst2 = false;
  });
  if (allParas.length === 0) pageGroups[0] = [];

  const pgParas = pageGroups[pi] || [];

  // Calculate start index of first para on this page
  let startIdx = 0;
  for (let g = 0; g < pi && g < pageGroups.length; g++) startIdx += pageGroups[g].length;
  _pedCurrentPiStart = startIdx;
  _pedCurrentPageParas = pgParas;

  // Build editable HTML from the page paragraphs (render with markup parsed to HTML)
  if (pgParas.length === 0) {
    body.innerHTML = '';
    wrap.style.display = 'none';
    return;
  }

  body.innerHTML = pgParas.map(p => {
    const isSection = p.trim() === '— ✦ —' || p.trim() === '* * *';
    if (isSection) return `<div style="text-align:center;color:var(--gold);letter-spacing:0.4em">${p}</div>`;
    return `<p style="margin:0 0 2px;text-indent:2em">${parseRichText(p)}</p>`;
  }).join('');

  // Update page badge
  const badge = document.getElementById('pedPageBadge');
  if (badge) badge.textContent = `หน้า ${_pedCurrentPageEl ? (allPages.indexOf(allPages.find(u => u.pages[0] === pageEl)) + 1) : '—'}`;

  wrap.style.display = 'block';
  pedUpdateToolbar();
}

function pedExec(cmd, val) {
  document.getElementById('pedBody').focus();
  document.execCommand(cmd, false, val || null);
  pedUpdateToolbar();
}

function pedAlign(align) {
  pedExec('justify' + align.charAt(0).toUpperCase() + align.slice(1));
  ['L','C','R','J'].forEach(x => {
    const b = document.getElementById('pedAlign' + x);
    if (b) b.classList.remove('active');
  });
  const map = { left:'L', center:'C', right:'R', justify:'J' };
  const btn = document.getElementById('pedAlign' + (map[align] || 'J'));
  if (btn) btn.classList.add('active');
}

function pedUpdateToolbar() {
  try {
    ['Bold','Italic','Underline','StrikeThrough'].forEach(cmd => {
      const btn = document.querySelector(`.ped-btn[onclick*="${cmd.toLowerCase()}"], .ped-btn[onclick*="${cmd}"]`);
      // use queryCommandState
    });
    // Update align buttons
    const aligns = { justifyLeft:'L', justifyCenter:'C', justifyRight:'R', justifyFull:'J' };
    Object.entries(aligns).forEach(([cmd, key]) => {
      const el = document.getElementById('pedAlign' + key);
      if (el) el.classList.toggle('active', document.queryCommandState(cmd));
    });
  } catch(e) {}
}

function pedOnInput() {
  // Live sync back to chapter content when typing in the editor
  // (optional: auto-sync on input, or wait for "save" button)
}

function pedRevertToOriginal() {
  if (!_pedCurrentPageEl) return;
  updatePageTextPreview(_pedCurrentPageEl);
  showToast('↺ คืนค่าเนื้อหาจากบทแล้ว');
}

function pedApplyToChapter() {
  const body = document.getElementById('pedBody');
  if (!body || _pedCurrentChId == null) return;
  const ch = chapters.find(c => c.id === _pedCurrentChId);
  if (!ch) return;

  recordHistory();

  // Convert edited HTML back to plain text paragraphs (our markup format)
  // We extract paragraphs from the contenteditable
  const paraEls = Array.from(body.querySelectorAll('p, div'));
  const newParas = paraEls.length > 0
    ? paraEls.map(el => el.innerText.trim()).filter(Boolean)
    : [body.innerText.trim()].filter(Boolean);

  // Replace just the paragraphs belonging to this page
  const allParas = ch.content.split('\n').filter(p => p.trim());
  const start = _pedCurrentPiStart;
  const count = _pedCurrentPageParas.length;

  // Splice in new paragraphs
  allParas.splice(start, count, ...newParas);
  ch.content = allParas.join('\n\n');

  // Refresh WYSIWYG editor
  if (ch.id === currentChapterId) weLoad(ch.content);
  _pedCurrentPageParas = newParas;

  updatePreview();
  updateStats();
  if (typeof autoSaveDebounce === 'function') autoSaveDebounce();
  showToast('💾 บันทึกเนื้อหาหน้านี้เข้าบทแล้ว!');

  // Re-render preview in editor
  setTimeout(() => updatePageTextPreview(_pedCurrentPageEl), 50);
}

// ── Enable drag-and-drop image onto pages ──
function enablePageDrop(pageEl) {
  // Add overlay element
  const overlay = document.createElement('div');
  overlay.className = 'page-drop-overlay';
  overlay.textContent = '🖼 วางรูปที่นี่';
  pageEl.appendChild(overlay);

  pageEl.addEventListener('dragover', (e) => {
    e.preventDefault();
    pageEl.classList.add('drag-over');
  });
  pageEl.addEventListener('dragleave', () => pageEl.classList.remove('drag-over'));
  pageEl.addEventListener('drop', (e) => {
    e.preventDefault();
    pageEl.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith('image/')) return;
    const key = pageEl.dataset.freeImgKey || '';
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (!freeImages[key]) freeImages[key] = [];
      const id = 'fi_' + (++_freeImgSerial);
      // Place at drop position relative to page
      const rect = pageEl.getBoundingClientRect();
      const sc = (zoomLevel || 100) / 100;
      // getBoundingClientRect already accounts for scale, so divide delta by scale
      const dropX = Math.max(0, (e.clientX - rect.left) / sc - 90);
      const dropY = Math.max(0, (e.clientY - rect.top) / sc - 70);
      const imgData = { id, src: ev.target.result, x: dropX, y: dropY, w: 180, h: 140, rotation: 0 };
      freeImages[key].push(imgData);
      addFreeImageToPage(pageEl, imgData, key);
      showToast('🖼 วางรูปเรียบร้อย! ลากย้ายหรือปรับขนาดได้');
    };
    reader.readAsDataURL(file);
  });
}

// ── Undo / Redo History ──
const HISTORY_MAX = 100;
const _history = [];   // array of snapshots
let _historyIdx = -1;  // current position
let _historyLocked = false; // prevent recording while restoring

function _snapshot() {
  // Capture full editor state: all chapters content + title + note
  return JSON.parse(JSON.stringify({
    chapters: chapters.map(c => ({
      id: c.id, title: c.title, content: c.content, note: c.note || '',
      imageData: c.imageData || null, imageSize: c.imageSize || 100
    })),
    currentChapterId,
    textAlign, dropCap, bodyFont,
    pageNumStyle, pageNumSize, dropCapSize, dropCapFont,
  }));
}

function _pushHistory(snap) {
  if (_historyLocked) return;
  // Discard any redo tail
  if (_historyIdx < _history.length - 1) {
    _history.splice(_historyIdx + 1);
  }
  _history.push(snap);
  if (_history.length > HISTORY_MAX) _history.shift();
  _historyIdx = _history.length - 1;
  _updateHistoryBtns();
}

function _updateHistoryBtns() {
  const undoBtn = document.getElementById('undoBtn');
  const redoBtn = document.getElementById('redoBtn');
  if (undoBtn) undoBtn.disabled = _historyIdx <= 0;
  if (redoBtn) redoBtn.disabled = _historyIdx >= _history.length - 1;
}

function _restoreSnapshot(snap) {
  _historyLocked = true;
  chapters = snap.chapters.map(c => ({ ...c }));
  currentChapterId = snap.currentChapterId;
  textAlign = snap.textAlign;
  dropCap = snap.dropCap;
  bodyFont = snap.bodyFont;
  if (snap.pageNumStyle) pageNumStyle = snap.pageNumStyle;
  if (snap.pageNumSize) pageNumSize = snap.pageNumSize;
  if (snap.dropCapSize) dropCapSize = snap.dropCapSize;
  if (snap.dropCapFont) dropCapFont = snap.dropCapFont;

  // Update UI controls
  document.querySelectorAll('input[name=align]').forEach(r => r.checked = r.value === textAlign);
  const dcEl = document.getElementById('showDropCap');
  if (dcEl) dcEl.checked = dropCap;
  document.querySelectorAll('.font-btn').forEach(b =>
    b.classList.toggle('active', b.textContent.trim().startsWith(bodyFont)));

  // Reload current chapter in editor
  const ch = chapters.find(c => c.id === currentChapterId) || chapters[0];
  if (ch) {
    currentChapterId = ch.id;
    const titleEl = document.getElementById('chapterTitleInput');
    const editorEl = document.getElementById('chapterEditor');
    const noteEl = document.getElementById('chapterNote');
    if (titleEl) titleEl.value = ch.title;
    if (document.getElementById('chapterEditor')) weLoad(ch.content);
    if (noteEl) noteEl.value = ch.note || '';
    const wrap = document.getElementById('chImgPreviewWrap');
    const drop = document.getElementById('chImgDrop');
    if (ch.imageData) {
      document.getElementById('chImgPreview').src = ch.imageData;
      document.getElementById('chImgSize').value = ch.imageSize || 100;
      document.getElementById('chImgSizeVal').textContent = (ch.imageSize || 100) + '%';
      if (wrap) wrap.style.display = 'block';
      if (drop) drop.style.display = 'none';
    } else {
      if (wrap) wrap.style.display = 'none';
      if (drop) drop.style.display = 'block';
    }
  }

  renderChapterList();
  updatePreview();
  updateStats();
  _historyLocked = false;
}

function historyUndo() {
  if (_historyIdx <= 0) return;
  _historyIdx--;
  _restoreSnapshot(_history[_historyIdx]);
  _updateHistoryBtns();
  showToast('↩ Undo — ย้อนกลับแล้ว');
}

function historyRedo() {
  if (_historyIdx >= _history.length - 1) return;
  _historyIdx++;
  _restoreSnapshot(_history[_historyIdx]);
  _updateHistoryBtns();
  showToast('↪ Redo — ทำซ้ำแล้ว');
}

// Record history on every meaningful change (debounced 600ms for typing)
const _historyDebounce = (() => {
  let t;
  return (snap) => { clearTimeout(t); t = setTimeout(() => _pushHistory(snap), 600); };
})();

// Immediate record (for structural changes like add/delete chapter, layout changes)
function recordHistory() {
  if (_historyLocked) return;
  _pushHistory(_snapshot());
}

// Debounced record (for typing)
function recordHistoryDebounced() {
  if (_historyLocked) return;
  _historyDebounce(_snapshot());
}


// ── Paper Texture ──
let paperTexture = 'none';
let textureOpacity = 1.0;

// Texture definitions: background CSS per key
const PAPER_TEXTURES = {
  none:       { bg: '#fffef9', img: '' },
  cream:      { bg: 'linear-gradient(135deg,#fdf8ed 25%,#f7f0df 50%,#fdf8ed 75%)', img: '' },
  aged:       { bg: '#f5ead6', img: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")` },
  lines:      { bg: '#fefefe', img: 'repeating-linear-gradient(transparent,transparent 23px,#c8d8e8 23px,#c8d8e8 24px)' },
  grid:       { bg: '#fefefe', img: 'linear-gradient(rgba(180,200,220,0.4) 1px,transparent 1px),linear-gradient(90deg,rgba(180,200,220,0.4) 1px,transparent 1px)', size: '20px 20px' },
  dot:        { bg: '#fefefe', img: 'radial-gradient(circle,rgba(100,140,180,0.35) 1px,transparent 1px)', size: '14px 14px' },
  linen:      { bg: '#f8f4ee', img: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(160,140,100,0.08) 3px,rgba(160,140,100,0.08) 4px),repeating-linear-gradient(90deg,transparent,transparent 3px,rgba(160,140,100,0.08) 3px,rgba(160,140,100,0.08) 4px)' },
  crosshatch: { bg: '#fefefe', img: 'repeating-linear-gradient(45deg,rgba(180,180,180,0.2) 0,rgba(180,180,180,0.2) 1px,transparent 0,transparent 50%),repeating-linear-gradient(135deg,rgba(180,180,180,0.2) 0,rgba(180,180,180,0.2) 1px,transparent 0,transparent 50%)', size: '10px 10px' },
  marble:     { bg: 'linear-gradient(120deg,#f0ece4 0%,#e8e2d8 20%,#ede8e0 40%,#e4dfd5 60%,#ede8e0 80%,#f0ece4 100%)', img: 'repeating-linear-gradient(130deg,transparent,transparent 15px,rgba(200,190,175,0.15) 15px,rgba(200,190,175,0.15) 16px)' },
  parchment:  { bg: 'radial-gradient(ellipse at 20% 20%,#f5e6c8,#e8d4a8 40%,#dcc890 70%,#c9b578)', img: 'repeating-linear-gradient(75deg,transparent,transparent 8px,rgba(160,120,60,0.05) 8px,rgba(160,120,60,0.05) 9px)', textColor: '#2a1a08' },
  dark:       { bg: '#1e1a16', img: 'radial-gradient(circle at 50% 50%,rgba(255,255,255,0.02) 0%,transparent 70%)', textColor: '#e8e0d4' },
  sepia:      { bg: 'linear-gradient(160deg,#f2e4c8,#e8d5a8,#f0e2bc)', img: 'repeating-linear-gradient(0deg,transparent,transparent 11px,rgba(120,90,40,0.06) 11px,rgba(120,90,40,0.06) 12px)', textColor: '#2a1a08' },
  // ── แนวใหม่ ──
  sakura:     { bg: 'linear-gradient(135deg,#fff0f5 0%,#ffe4ee 40%,#fff0f5 70%,#ffd6e8 100%)', img: 'radial-gradient(circle at 20% 30%,rgba(255,182,193,0.18) 0,transparent 35%),radial-gradient(circle at 80% 70%,rgba(255,182,193,0.15) 0,transparent 30%)' },
  pastel:     { bg: 'linear-gradient(160deg,#fef3c7 0%,#fde8f0 33%,#e8f0fe 66%,#f0fde8 100%)', img: '' },
  galaxy:     { bg: 'linear-gradient(160deg,#0f0c29,#302b63,#24243e)', img: 'radial-gradient(ellipse at 20% 20%,rgba(255,255,255,0.04) 0,transparent 40%),radial-gradient(circle at 80% 50%,rgba(150,100,255,0.06) 0,transparent 35%)', textColor: '#e8e4f8' },
  nightsky:   { bg: 'linear-gradient(180deg,#020817 0%,#0f1628 50%,#1a0a2e 100%)', img: 'radial-gradient(circle at 15% 25%,rgba(255,255,255,0.7) 0.5px,transparent 0.5px),radial-gradient(circle at 70% 15%,rgba(255,255,255,0.5) 0.5px,transparent 0.5px),radial-gradient(circle at 45% 60%,rgba(255,255,255,0.6) 0.5px,transparent 0.5px),radial-gradient(circle at 85% 80%,rgba(255,255,255,0.4) 0.5px,transparent 0.5px)', textColor: '#d4d0f0' },
  anime:      { bg: 'linear-gradient(135deg,#f8f4ff 0%,#f0e8ff 50%,#f8f4ff 100%)', img: 'radial-gradient(circle at 10% 90%,rgba(180,130,255,0.1) 0,transparent 40%),radial-gradient(circle at 90% 10%,rgba(130,200,255,0.1) 0,transparent 40%)' },
  moe:        { bg: 'linear-gradient(135deg,#fff5f8 0%,#ffeef6 40%,#f5f0ff 100%)', img: 'radial-gradient(circle,rgba(255,150,200,0.08) 1px,transparent 1px)', size: '18px 18px' },
  shonen:     { bg: '#f0f4ff', img: 'repeating-linear-gradient(45deg,rgba(80,120,255,0.04) 0,rgba(80,120,255,0.04) 1px,transparent 0,transparent 12px),repeating-linear-gradient(-45deg,rgba(80,120,255,0.04) 0,rgba(80,120,255,0.04) 1px,transparent 0,transparent 12px)' },
  vintage_pink:{ bg: 'linear-gradient(135deg,#fdf2f8 0%,#fce7f3 50%,#fdf2f8 100%)', img: 'repeating-linear-gradient(0deg,transparent,transparent 18px,rgba(219,39,119,0.06) 18px,rgba(219,39,119,0.06) 19px)' },
  mint:       { bg: 'linear-gradient(135deg,#f0fdf4 0%,#dcfce7 50%,#f0fdf4 100%)', img: 'radial-gradient(circle,rgba(34,197,94,0.08) 1px,transparent 1px)', size: '16px 16px' },
  lavender:   { bg: 'linear-gradient(135deg,#f5f3ff 0%,#ede9fe 50%,#f5f3ff 100%)', img: 'repeating-linear-gradient(60deg,transparent,transparent 20px,rgba(139,92,246,0.04) 20px,rgba(139,92,246,0.04) 21px)' },
  horror_dark:{ bg: 'linear-gradient(160deg,#0a0a0a,#1a0505,#0d0d0d)', img: 'radial-gradient(circle at 50% 0%,rgba(180,0,0,0.08) 0,transparent 50%)', textColor: '#ccc0c0' },
  wuxia_paper:{ bg: 'linear-gradient(135deg,#fef9ec 0%,#fdf0d0 40%,#f8e8b8 70%,#fdf0d0 100%)', img: 'repeating-linear-gradient(90deg,transparent,transparent 40px,rgba(150,100,30,0.04) 40px,rgba(150,100,30,0.04) 41px),repeating-linear-gradient(0deg,transparent,transparent 40px,rgba(150,100,30,0.04) 40px,rgba(150,100,30,0.04) 41px)', textColor: '#2a1505' },
  custom_tex: { bg: '#fffef9', img: '', custom: true },
};
// Custom texture image (user-uploaded)
let customTextureImageData = null;

function setPaperTexture(key, el) {
  paperTexture = key;
  document.querySelectorAll('.tx-thumb').forEach(b => b.classList.remove('active'));
  if (el) el.classList.add('active');
  applyPaperTexture();
  recordHistory();
}

function updateTextureOpacity(val) {
  textureOpacity = parseInt(val) / 100;
  document.getElementById('textureOpacityVal').textContent = val + '%';
  applyPaperTexture();
}

function applyPaperTexture() {
  const tex = PAPER_TEXTURES[paperTexture] || PAPER_TEXTURES.none;
  const pages = document.querySelectorAll('.page.page-inner');

  pages.forEach(page => {
    page.querySelectorAll('.paper-tex-overlay').forEach(o => o.remove());

    if (paperTexture === 'none') {
      page.style.background = '#fffef9';
      page.style.backgroundImage = '';
      page.style.backgroundSize = '';
      page.querySelectorAll('.page-body,.page-chapter-title,.page-chapter-num,.page-number,.page-header').forEach(el => el.style.removeProperty('color'));
    } else {
      page.style.background = '#fffef9';
      page.style.backgroundImage = '';
      page.style.backgroundSize = '';

      const ov = document.createElement('div');
      ov.className = 'paper-tex-overlay';
      ov.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:1;border-radius:inherit;';

      // Custom texture: uploaded image as repeating background
      if (paperTexture === 'custom_tex' && customTextureImageData) {
        ov.style.backgroundImage = `url(${customTextureImageData})`;
        ov.style.backgroundRepeat = 'repeat';
        ov.style.backgroundSize = '200px auto';
      } else {
        ov.style.background = tex.bg;
        if (tex.img) ov.style.backgroundImage = tex.img;
        if (tex.size) ov.style.backgroundSize = tex.size;
      }
      ov.style.opacity = textureOpacity;
      page.insertBefore(ov, page.firstChild);

      if (tex.textColor) {
        page.querySelectorAll('.page-body,.page-chapter-title,.page-chapter-num,.page-number,.page-header').forEach(el => el.style.setProperty('color', tex.textColor, 'important'));
      } else {
        page.querySelectorAll('.page-body,.page-chapter-title,.page-chapter-num,.page-number,.page-header').forEach(el => el.style.removeProperty('color'));
      }
    }
  });
}

// ── Panel toggle (left / right) ──
function togglePanel(side) {
  if (side === 'left') {
    const panel = document.querySelector('.sidebar');
    const handle = document.getElementById('leftResizeHandle');
    const btn = document.getElementById('leftPanelToggle');
    const collapsed = panel.classList.toggle('collapsed-panel');
    if (handle) handle.style.display = collapsed ? 'none' : '';
    if (btn) btn.classList.toggle('active', !collapsed);
  } else {
    const panel = document.querySelector('.right-panel');
    const handle = document.getElementById('rightResizeHandle');
    const btn = document.getElementById('rightPanelToggle');
    const collapsed = panel.classList.toggle('collapsed-panel');
    if (handle) handle.style.display = collapsed ? 'none' : '';
    if (btn) btn.classList.toggle('active', !collapsed);
  }
}

// ── Page border pattern ──
function setPageBorderPattern(pattern, el) {
  pageBorderPattern = pattern;
  document.querySelectorAll('.bp-thumb').forEach(b => b.classList.remove('active'));
  if (el) el.classList.add('active');
  const cf = document.getElementById('customBorderFields');
  if (cf) cf.style.display = pattern === 'custom' ? 'block' : 'none';
  applyPageBorders();
  recordHistory();
}

function applyCustomBorderPreview() {
  if (pageBorderPattern === 'custom') applyPageBorders();
}

function updateBorderColor(val) {
  pageBorderColor = val;
  applyPageBorders();
}

function updateBorderThickness(val) {
  pageBorderThickness = parseInt(val);
  document.getElementById('borderThicknessVal').textContent = val + 'px';
  applyPageBorders();
}

function updateBorderLineWeight(val) {
  pageBorderLineWeight = parseInt(val);
  document.getElementById('borderLineWeightVal').textContent = val + 'px';
  applyPageBorders();
}

function applyPageBorders() {
  // Remove existing border overlays
  document.querySelectorAll('.page-border-overlay').forEach(el => el.remove());
  if (pageBorderPattern === 'none') return;

  const t = pageBorderThickness;
  const c = pageBorderColor;
  const lw = pageBorderLineWeight;

  // Apply to all inner pages (not cover)
  document.querySelectorAll('.page.page-inner').forEach(page => {
    const ov = document.createElement('div');
    ov.className = 'page-border-overlay';
    ov.style.setProperty('--pb-color', c);
    ov.style.setProperty('--pb-lw', lw + 'px');
    renderBorderPattern(ov, pageBorderPattern, c, t, lw);
    page.appendChild(ov);
  });
}

function renderBorderPattern(el, pattern, c, t, lw) {
  el.innerHTML = '';
  const s = t; // inset size
  lw = lw || 2; // line weight default 2px

  if (pattern === 'classic') {
    el.innerHTML = `
      <div style="position:absolute;inset:${s}px;border:${lw}px solid ${c};pointer-events:none;box-sizing:border-box"></div>
      <div style="position:absolute;inset:${s+5}px;border:${Math.max(1,lw-1)}px solid ${c};pointer-events:none;box-sizing:border-box"></div>`;
  } else if (pattern === 'double') {
    el.innerHTML = `
      <div style="position:absolute;inset:${s}px;border:${lw}px solid ${c};pointer-events:none;box-sizing:border-box"></div>
      <div style="position:absolute;inset:${s+4+lw}px;border:${lw}px solid ${c};pointer-events:none;box-sizing:border-box"></div>`;
  } else if (pattern === 'vintage') {
    el.innerHTML = `
      <div style="position:absolute;inset:${s}px;border:${lw}px solid ${c};border-radius:4px;pointer-events:none;box-sizing:border-box"></div>
      <div style="position:absolute;inset:${s+5}px;border:${Math.max(1,lw-1)}px dashed ${c};border-radius:2px;pointer-events:none;box-sizing:border-box"></div>`;
  } else if (pattern === 'shadow') {
    el.innerHTML = `
      <div style="position:absolute;inset:${s}px;border:${lw}px solid ${c};box-shadow:inset 0 0 12px rgba(0,0,0,0.07);pointer-events:none;box-sizing:border-box"></div>`;
  } else if (pattern === 'ornate') {
    const cornerSvg = (r) => `<svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 22 22' style='transform:rotate(${r}deg)'><path d='M2 20 L2 2 L20 2' fill='none' stroke='${c}' stroke-width='${lw}'/><circle cx='2' cy='2' r='2.5' fill='${c}'/></svg>`;
    el.innerHTML = `
      <div style="position:absolute;inset:${s}px;border:${lw}px solid ${c};pointer-events:none;box-sizing:border-box"></div>
      <div style="position:absolute;top:${s-2}px;left:${s-2}px">${cornerSvg(0)}</div>
      <div style="position:absolute;top:${s-2}px;right:${s-2}px">${cornerSvg(90)}</div>
      <div style="position:absolute;bottom:${s-2}px;left:${s-2}px">${cornerSvg(270)}</div>
      <div style="position:absolute;bottom:${s-2}px;right:${s-2}px">${cornerSvg(180)}</div>`;
  } else if (pattern === 'minimal') {
    el.innerHTML = `
      <div style="position:absolute;left:${s}px;right:${s}px;top:${s}px;border-top:${lw}px solid ${c};pointer-events:none"></div>
      <div style="position:absolute;left:${s}px;right:${s}px;bottom:${s}px;border-bottom:${lw}px solid ${c};pointer-events:none"></div>`;
  } else if (pattern === 'corner') {
    const arm = Math.min(40, t * 2.5 + lw * 4);
    el.innerHTML = `
      <div style="position:absolute;top:${s}px;left:${s}px;width:${arm}px;height:${arm}px;border-top:${lw}px solid ${c};border-left:${lw}px solid ${c};pointer-events:none"></div>
      <div style="position:absolute;top:${s}px;right:${s}px;width:${arm}px;height:${arm}px;border-top:${lw}px solid ${c};border-right:${lw}px solid ${c};pointer-events:none"></div>
      <div style="position:absolute;bottom:${s}px;left:${s}px;width:${arm}px;height:${arm}px;border-bottom:${lw}px solid ${c};border-left:${lw}px solid ${c};pointer-events:none"></div>
      <div style="position:absolute;bottom:${s}px;right:${s}px;width:${arm}px;height:${arm}px;border-bottom:${lw}px solid ${c};border-right:${lw}px solid ${c};pointer-events:none"></div>`;
  } else if (pattern === 'floral') {
    el.innerHTML = `
      <div style="position:absolute;inset:${s}px;border:${lw}px dashed ${c};border-radius:3px;pointer-events:none;box-sizing:border-box"></div>
      <div style="position:absolute;top:${s-6}px;left:${s-6}px;font-size:12px;color:${c};pointer-events:none">✿</div>
      <div style="position:absolute;top:${s-6}px;right:${s-6}px;font-size:12px;color:${c};pointer-events:none">✿</div>
      <div style="position:absolute;bottom:${s-6}px;left:${s-6}px;font-size:12px;color:${c};pointer-events:none">✿</div>
      <div style="position:absolute;bottom:${s-6}px;right:${s-6}px;font-size:12px;color:${c};pointer-events:none">✿</div>`;
  } else if (pattern === 'wave') {
    el.innerHTML = `
      <div style="position:absolute;left:${s}px;right:${s}px;top:${s}px;border-top:${lw}px dotted ${c};pointer-events:none"></div>
      <div style="position:absolute;left:${s}px;right:${s}px;bottom:${s}px;border-bottom:${lw}px dotted ${c};pointer-events:none"></div>
      <div style="position:absolute;top:${s}px;bottom:${s}px;left:${s}px;border-left:${lw}px dotted ${c};pointer-events:none"></div>
      <div style="position:absolute;top:${s}px;bottom:${s}px;right:${s}px;border-right:${lw}px dotted ${c};pointer-events:none"></div>`;
  } else if (pattern === 'triple') {
    el.innerHTML = `
      <div style="position:absolute;inset:${s}px;border:${lw+1}px double ${c};box-sizing:border-box;pointer-events:none"></div>
      <div style="position:absolute;inset:${s+6+lw}px;border:${Math.max(1,lw-1)}px solid ${c};box-sizing:border-box;pointer-events:none"></div>`;
  } else if (pattern === 'custom') {
    const customCSS = document.getElementById('customBorderCSS')?.value || 'border:' + lw + 'px solid ' + c;
    const customBG = document.getElementById('customBorderBG')?.value || '';
    el.innerHTML = `<div style="position:absolute;inset:${s}px;box-sizing:border-box;pointer-events:none;${customCSS};${customBG}"></div>`;
  }
  // ── แนวใหม่ ──
  else if (pattern === 'kawaii') {
    el.innerHTML = `
      <div style="position:absolute;inset:${s}px;border:${lw}px solid ${c};border-radius:8px;box-sizing:border-box;pointer-events:none"></div>
      <div style="position:absolute;top:${s-7}px;left:50%;transform:translateX(-50%);font-size:13px;color:${c};letter-spacing:4px;pointer-events:none">♥ ♡ ♥</div>
      <div style="position:absolute;bottom:${s-7}px;left:50%;transform:translateX(-50%);font-size:13px;color:${c};letter-spacing:4px;pointer-events:none">♡ ♥ ♡</div>`;
  } else if (pattern === 'sparkle_border') {
    el.innerHTML = `
      <div style="position:absolute;inset:${s}px;border:${lw}px solid ${c};box-sizing:border-box;pointer-events:none"></div>
      <div style="position:absolute;top:${s-8}px;left:${s-8}px;font-size:14px;color:${c};pointer-events:none">✦</div>
      <div style="position:absolute;top:${s-8}px;right:${s-8}px;font-size:14px;color:${c};pointer-events:none">✦</div>
      <div style="position:absolute;bottom:${s-8}px;left:${s-8}px;font-size:14px;color:${c};pointer-events:none">✦</div>
      <div style="position:absolute;bottom:${s-8}px;right:${s-8}px;font-size:14px;color:${c};pointer-events:none">✦</div>`;
  } else if (pattern === 'manga') {
    el.innerHTML = `
      <div style="position:absolute;inset:${s}px;border:${lw+1}px solid ${c};box-sizing:border-box;pointer-events:none"></div>
      <div style="position:absolute;inset:${s+4+lw}px;border:${Math.max(1,lw-1)}px solid ${c};box-sizing:border-box;pointer-events:none"></div>`;
  } else if (pattern === 'wuxia_border') {
    el.innerHTML = `
      <div style="position:absolute;inset:${s}px;border:${lw}px solid ${c};box-sizing:border-box;pointer-events:none"></div>
      <div style="position:absolute;top:${s-8}px;left:50%;transform:translateX(-50%);font-size:13px;color:${c};letter-spacing:4px;pointer-events:none">— 龍 —</div>
      <div style="position:absolute;bottom:${s-8}px;left:50%;transform:translateX(-50%);font-size:13px;color:${c};letter-spacing:4px;pointer-events:none">— 鳳 —</div>`;
  } else if (pattern === 'rose_border') {
    el.innerHTML = `
      <div style="position:absolute;inset:${s}px;border:${lw}px solid ${c};border-radius:2px;box-sizing:border-box;pointer-events:none"></div>
      <div style="position:absolute;top:${s-8}px;left:${s-8}px;font-size:14px;pointer-events:none">🌹</div>
      <div style="position:absolute;top:${s-8}px;right:${s-8}px;font-size:14px;pointer-events:none">🌹</div>
      <div style="position:absolute;bottom:${s-8}px;left:${s-8}px;font-size:14px;pointer-events:none">🌹</div>
      <div style="position:absolute;bottom:${s-8}px;right:${s-8}px;font-size:14px;pointer-events:none">🌹</div>`;
  } else if (pattern === 'star_border') {
    el.innerHTML = `
      <div style="position:absolute;inset:${s}px;border:${lw}px solid ${c};box-sizing:border-box;pointer-events:none"></div>
      <div style="position:absolute;top:${s-8}px;left:${s-8}px;font-size:13px;color:${c};pointer-events:none">★</div>
      <div style="position:absolute;top:${s-8}px;right:${s-8}px;font-size:13px;color:${c};pointer-events:none">★</div>
      <div style="position:absolute;bottom:${s-8}px;left:${s-8}px;font-size:13px;color:${c};pointer-events:none">★</div>
      <div style="position:absolute;bottom:${s-8}px;right:${s-8}px;font-size:13px;color:${c};pointer-events:none">★</div>`;
  } else if (pattern === 'custom_img_border') {
    if (customBorderImageData) {
      el.innerHTML = `<div style="position:absolute;inset:0;border-image:url(${customBorderImageData}) 30 round;border-width:${t}px;border-style:solid;box-sizing:border-box;pointer-events:none"></div>`;
    }
  }
}
let customBorderImageData = null;

// ── Panel section accordion (right panel) ──
function initPanelSectionAccordions() {
  document.querySelectorAll('.panel-section').forEach(sec => {
    const titleEl = sec.querySelector('.panel-section-title');
    if (!titleEl || titleEl.dataset.accordionInit) return;
    titleEl.dataset.accordionInit = '1';
    // Add arrow
    if (!titleEl.querySelector('.ps-arrow')) {
      const arrow = document.createElement('span');
      arrow.className = 'ps-arrow';
      arrow.textContent = '▼';
      titleEl.appendChild(arrow);
    }
    // Wrap all non-title children in panel-section-body if not already
    let body = sec.querySelector('.panel-section-body');
    if (!body) {
      body = document.createElement('div');
      body.className = 'panel-section-body';
      const children = Array.from(sec.children).filter(c => c !== titleEl);
      children.forEach(c => body.appendChild(c));
      sec.appendChild(body);
    }
    titleEl.addEventListener('click', () => {
      sec.classList.toggle('ps-collapsed');
    });
  });
}

// Call after DOM content and also after tab switches / panel updates
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(initPanelSectionAccordions, 100);
});

// Patch switchTab to reinit accordions when tabs are shown
const _origSwitchTab = window.switchTab;
window.switchTab = function(tab, el) {
  if (_origSwitchTab) _origSwitchTab(tab, el);
  setTimeout(initPanelSectionAccordions, 50);
};

// ── Ribbon Toolbar JS ──

function switchRibbonTab(name, el) {
  document.querySelectorAll('.ribbon-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.ribbon-body').forEach(b => b.classList.remove('active'));
  if (el) el.classList.add('active');
  const body = document.getElementById('rtab-' + name);
  if (body) body.classList.add('active');
}

function toggleRibbon() {
  const ribbon = document.getElementById('ribbon');
  const btn = document.getElementById('ribbonCollapseBtn');
  const collapsed = ribbon.classList.toggle('collapsed');
  btn.textContent = collapsed ? '▼' : '▲';
  document.querySelector('.main').style.height = collapsed
    ? 'calc(100vh - 52px - 34px)'
    : 'calc(100vh - 52px - 90px)';
}

function rbFmt(type) {
  const ta = document.getElementById('chapterEditor');
  if (!ta) return;
  const s = ta.selectionStart, e = ta.selectionEnd;
  const sel = ta.value.substring(s, e);
  if (!sel && type !== 'clear') { showToast('กรุณาคลุมข้อความก่อน'); return; }
  let wrapped = sel;
  switch (type) {
    case 'bold':      wrapped = `**${sel}**`; break;
    case 'italic':    wrapped = `_${sel}_`; break;
    case 'underline': wrapped = `__${sel}__`; break;
    case 'strike':    wrapped = `~~${sel}~~`; break;
    case 'quote':     wrapped = `«${sel}»`; break;
    case 'highlight': wrapped = `==${sel}==`; break;
    case 'clear':     wrapped = sel.replace(/\*\*|__|_|==|`|«|»|~~/g, ''); break;
  }
  ta.value = ta.value.substring(0, s) + wrapped + ta.value.substring(e);
  ta.selectionStart = s; ta.selectionEnd = s + wrapped.length;
  ta.focus();
  updateChapterContent(ta.value);
}

function rbAlign(align) {
  ['l','c','r','j'].forEach(k => document.getElementById('rb-a'+k)?.classList.remove('active'));
  document.getElementById('rb-a' + align[0])?.classList.add('active');
  setTextAlign(align);
}

function rbSetFont(font) {
  bodyFont = font;
  document.querySelectorAll('.font-btn').forEach(b => b.classList.toggle('active', b.textContent.trim().startsWith(font)));
  renderChapterPages();
}

function rbSetFontSize(val) {
  const el = document.getElementById('fontSize');
  if (el) { el.value = val; updateFontSize(val); }
  const el2 = document.getElementById('rb-fs2');
  if (el2) el2.value = val;
}

function rbSetFontSizeGlobal(val) {
  const el = document.getElementById('fontSize');
  if (el) { el.value = val; updateFontSize(val); }
  const el1 = document.getElementById('rb-size');
  if (el1) el1.value = val;
}

function rbSetLineHeight(val) {
  const el = document.getElementById('lineHeight');
  if (el) { el.value = val; updateLineHeight(val); }
  const el2 = document.getElementById('rb-lh2');
  if (el2) el2.value = val;
}

function rbSetLineHeightGlobal(val) {
  const el = document.getElementById('lineHeight');
  if (el) { el.value = val; updateLineHeight(val); }
  const el1 = document.getElementById('rb-lh');
  if (el1) el1.value = val;
}

function rbSetMargin(axis, val) {
  if (axis === 'v') { const el = document.getElementById('marginV'); if (el) el.value = val; }
  else { const el = document.getElementById('marginH'); if (el) el.value = val; }
  updateMargins();
}

function rbSetColor(color) {
  document.getElementById('rb-fgBox').style.background = color;
  const ta = document.getElementById('chapterEditor');
  if (!ta) return;
  const s = ta.selectionStart, e = ta.selectionEnd;
  const sel = ta.value.substring(s, e);
  if (!sel) { showToast('กรุณาคลุมข้อความก่อน'); return; }
  const wrapped = `<color:${color}>${sel}</color>`;
  ta.value = ta.value.substring(0, s) + wrapped + ta.value.substring(e);
  ta.focus(); updateChapterContent(ta.value);
}

function rbSetHighlight(color) {
  document.getElementById('rb-hlBox').style.background = color;
  const ta = document.getElementById('chapterEditor');
  if (!ta) return;
  const s = ta.selectionStart, e = ta.selectionEnd;
  const sel = ta.value.substring(s, e);
  if (!sel) { showToast('กรุณาคลุมข้อความก่อน'); return; }
  ta.value = ta.value.substring(0, s) + `==${sel}==` + ta.value.substring(e);
  ta.focus(); updateChapterContent(ta.value);
}

function rbToggleDropCap(cb) {
  dropCap = cb.checked;
  const el = document.getElementById('showDropCap');
  if (el) el.checked = dropCap;
  renderChapterPages();
}

function rbInsertChapterImage() {
  document.getElementById('chImgDrop')?.querySelector('input[type=file]')?.click();
}

function rbInsertFreeImage() {
  const u = allPages[currentPageIndex];
  if (u && u.pages[0]) {
    _freeImgTargetPageEl = u.pages[0];
    _freeImgTargetKey = u.pages[0].dataset.freeImgKey || '';
  }
  document.getElementById('freeImgInput').click();
}

function rbUploadCover() {
  document.getElementById('coverDrop')?.querySelector('input[type=file]')?.click();
}

function rbZoomSlider(val) {
  zoomLevel = parseInt(val);
  document.getElementById('zoomVal').textContent = val + '%';
  document.getElementById('rb-zoomVal').textContent = val + '%';
  document.getElementById('zoomWrap').style.transform = `scale(${val / 100})`;
}

function rbMarkTex(key) {
  document.querySelectorAll('[id^="rb-tex-"]').forEach(b => b.classList.remove('active'));
  const el = document.getElementById('rb-tex-' + key);
  if (el) el.classList.add('active');
}

function rbMarkBp(key) {
  document.querySelectorAll('[id^="rb-bp-"]').forEach(b => b.classList.remove('active'));
  const el = document.getElementById('rb-bp-' + key);
  if (el) el.classList.add('active');
}

function rbMarkLayout(btn) {
  document.querySelectorAll('[id^="rb-lay-"]').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
}

function rbMarkTpl(key) {
  document.querySelectorAll('[id^="rb-tpl-"]').forEach(b => b.classList.remove('active'));
  const el = document.getElementById('rb-tpl-' + key);
  if (el) el.classList.add('active');
}

function _rbSyncNav() {
  const info = document.getElementById('navInfo');
  const rbNav = document.getElementById('rb-navInfo');
  if (info && rbNav) rbNav.textContent = info.textContent;
  const rbZv = document.getElementById('rb-zoomVal');
  const rbZs = document.getElementById('rb-zoomSlider');
  if (rbZv) rbZv.textContent = zoomLevel + '%';
  if (rbZs) rbZs.value = zoomLevel;
}

const _origApplyViewMode = window.applyViewMode;
window.applyViewMode = function() {
  if (_origApplyViewMode) _origApplyViewMode();
  setTimeout(_rbSyncNav, 50);
};

const _origAdjustZoom = window.adjustZoom;
window.adjustZoom = function(delta) {
  if (_origAdjustZoom) _origAdjustZoom(delta);
  const rbZs = document.getElementById('rb-zoomSlider');
  const rbZv = document.getElementById('rb-zoomVal');
  if (rbZs) rbZs.value = zoomLevel;
  if (rbZv) rbZv.textContent = zoomLevel + '%';
};

// ── End Ribbon JS ──

// ── Custom Special Pages ──
let customSpecialPages = []; // [{id, title, content}]
let _cspSerial = 0;

function addCustomSpecialPage(title) {
  const id = 'csp_' + (++_cspSerial);
  customSpecialPages.push({ id, title, content: '' });
  renderCustomSpecialPagesList();
  updatePreview();
  showToast('✅ เพิ่มหน้า "' + title + '" แล้ว');
}
function addCustomSpecialPageCustom() {
  const title = prompt('ชื่อหน้าพิเศษ:') || 'หน้าพิเศษ';
  if (title) addCustomSpecialPage(title);
}
function removeCustomSpecialPage(id) {
  customSpecialPages = customSpecialPages.filter(p => p.id !== id);
  renderCustomSpecialPagesList();
  updatePreview();
}
function updateCustomSpecialPage(id, field, val) {
  const p = customSpecialPages.find(p => p.id === id);
  if (p) { p[field] = val; updatePreview(); }
}
function renderCustomSpecialPagesList() {
  const container = document.getElementById('customSpecialPagesList');
  if (!container) return;
  container.innerHTML = '';
  customSpecialPages.forEach(p => {
    const div = document.createElement('div');
    div.className = 'csp-item';
    div.innerHTML = `
      <div class="csp-item-header">
        <span class="csp-item-title">📄 ${p.title}</span>
        <span class="csp-item-del" onclick="removeCustomSpecialPage('${p.id}')">×</span>
      </div>
      <input type="text" value="${p.title.replace(/"/g,'&quot;')}" placeholder="ชื่อหน้า"
        oninput="updateCustomSpecialPage('${p.id}','title',this.value);this.closest('.csp-item').querySelector('.csp-item-title').textContent='📄 '+this.value">
      <textarea placeholder="เนื้อหาหน้านี้..." oninput="updateCustomSpecialPage('${p.id}','content',this.value)">${p.content}</textarea>
    `;
    container.appendChild(div);
  });
}

// ── Thumbnail Overview Mode ──
function buildOverviewGrid() {
  const area = document.getElementById('previewArea');
  area.querySelectorAll('.overview-grid').forEach(g => g.remove());
  const grid = document.createElement('div');
  grid.className = 'overview-grid';
  area.appendChild(grid);

  const thumbW = 100, thumbH = 142;
  const sc = thumbW / 559;

  const pageCover = document.getElementById('pageCover');
  const pageTitlePage = document.getElementById('pageTitlePage');
  const specialPageEls = Array.from(document.querySelectorAll('.special-page-wrap .page'));
  const chapterPageEls = Array.from(document.querySelectorAll('#chapterPages .page'));
  const allPageEls = [pageCover, pageTitlePage, ...specialPageEls, ...chapterPageEls].filter(Boolean);

  const labelMap = new Map();
  document.querySelectorAll('.page-label').forEach(lbl => {
    let sib = lbl.nextElementSibling;
    while (sib && !sib.classList.contains('page')) sib = sib.nextElementSibling;
    if (sib) labelMap.set(sib, lbl.textContent.trim());
  });

  allPageEls.forEach((pageEl, idx) => {
    const thumb = document.createElement('div');
    thumb.className = 'overview-thumb' + (idx === currentPageIndex ? ' active-thumb' : '');
    thumb.style.cssText = `width:${thumbW}px;height:${thumbH}px;flex-shrink:0;`;

    const clone = pageEl.cloneNode(true);
    clone.style.cssText = `position:absolute;top:0;left:0;width:559px;height:794px;transform:scale(${sc});transform-origin:top left;pointer-events:none;display:flex;overflow:hidden;`;
    clone.querySelectorAll('input,textarea,button,.fi-toolbar,.page-layout-pill,.rh,.resize-dot').forEach(el => el.remove());
    thumb.appendChild(clone);

    const name = labelMap.get(pageEl) ||
      (pageEl.id === 'pageCover' ? 'ปกหน้า' :
       pageEl.id === 'pageTitlePage' ? 'หน้าชื่อเรื่อง' : `หน้า ${idx + 1}`);
    const label = document.createElement('div');
    label.className = 'overview-thumb-label';
    label.textContent = name.length > 18 ? name.substring(0, 18) + '…' : name;
    thumb.appendChild(label);

    const badge = document.createElement('div');
    badge.style.cssText = 'position:absolute;top:3px;left:3px;background:rgba(26,22,18,0.6);color:#e8e4de;font-size:8px;padding:1px 5px;border-radius:8px;font-weight:700;z-index:10;';
    badge.textContent = idx + 1;
    thumb.appendChild(badge);

    thumb.addEventListener('click', () => {
      currentPageIndex = idx;
      toggleOverviewMode(null);
    });
    grid.appendChild(thumb);
  });

  if (allPageEls.length === 0) {
    grid.innerHTML = '<div style="color:#9a9590;font-size:13px;padding:32px;text-align:center">ยังไม่มีหน้า</div>';
  }
}

// ── Sync contenteditable page-body → chapter state ──
function syncPageBodyToChapter(bodyEl, chapterId) {
  // Collect ALL page-bodies belonging to this chapter (multi-page chapters)
  const allBodies = document.querySelectorAll(`.page-body[data-ch-id="${chapterId}"]`);
  const paragraphs = [];
  allBodies.forEach(b => {
    b.querySelectorAll('p').forEach(p => {
      if (p.dataset.placeholder) return; // skip placeholder
      // Use weNodeToMarkup to preserve bold/italic/color formatting
      // Use trimEnd only — preserve leading whitespace/indent (Thai \u3000, spaces)
      const markup = weNodeToMarkup(p).trimEnd();
      if (markup) paragraphs.push(markup);
    });
    // If no <p> tags, fall back to innerText lines
    if (b.querySelectorAll('p').length === 0) {
      b.innerText.split('\n').forEach(line => {
        const t = line.trimEnd();
        if (t) paragraphs.push(t);
      });
    }
  });

  const ch = chapters.find(c => c.id === chapterId);
  if (!ch) return;
  const newContent = paragraphs.join('\n');
  if (ch.content === newContent) return; // no change

  ch.content = newContent;

  // Sync to WYSIWYG editor if this chapter is selected
  if (currentChapterId === chapterId) {
    const ed = document.getElementById('chapterEditor');
    if (ed) {
      const currentMarkup = weToMarkup(ed.innerHTML);
      if (currentMarkup !== newContent) {
        weLoad(newContent);
      }
    }
  }

  updateStats();
  _historyDebounce(_snapshot());
}

// ── Custom Image Uploads ──
function loadCustomTexture(input) {
  const file = input.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    customTextureImageData = e.target.result;
    setPaperTexture('custom_tex', document.querySelector('[data-tex="custom_tex"]'));
    showToast('✅ อัปโหลดลายกระดาษแล้ว');
  };
  reader.readAsDataURL(file);
}
function loadCustomBorderImage(input) {
  const file = input.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    customBorderImageData = e.target.result;
    setPageBorderPattern('custom_img_border', document.querySelector('[data-pattern="custom_img_border"]'));
    applyPageBorders();
    showToast('✅ อัปโหลดขอบกระดาษแล้ว');
  };
  reader.readAsDataURL(file);
}
function loadCustomCoverImage(input) {
  const file = input.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    customCoverTemplateImageData = e.target.result;
    coverTemplates['custom_tpl'].bg = `url(${e.target.result}) center/cover no-repeat`;
    setCoverTemplate('custom_tpl', document.getElementById('tpl-custom_tpl'));
    showToast('✅ อัปโหลดปกแล้ว');
  };
  reader.readAsDataURL(file);
}
document.addEventListener('change', e => {
  if (e.target.id === 'dividerStyle') {
    const f = document.getElementById('customDividerFields');
    if (f) f.style.display = e.target.value === 'custom_div' ? 'block' : 'none';
  }
});

// ── Toggle Overview Mode ──
function toggleOverviewMode(btnEl) {
  if (viewMode === 'overview') {
    // Exit overview
    viewMode = 'single';
    document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
    const vbSingle = document.getElementById('vbSingle');
    if (vbSingle) vbSingle.classList.add('active');
    document.getElementById('previewArea').className = 'preview-area mode-single';
    document.getElementById('pageNavBar').classList.remove('hidden');
    document.querySelectorAll('.overview-grid').forEach(g => g.remove());
    // Restore zoomWrap
    const zw = document.getElementById('zoomWrap');
    zw.style.display = '';
    applyViewMode();
  } else {
    // Enter overview — show all pages first so clones render correctly
    viewMode = 'overview';
    const zw = document.getElementById('zoomWrap');
    zw.querySelectorAll('.page').forEach(el => { el.style.display = 'flex'; });
    zw.querySelectorAll('.page-label').forEach(el => { el.style.display = 'none'; });
    document.getElementById('previewArea').className = 'preview-area mode-overview';
    document.getElementById('pageNavBar').classList.add('hidden');
    document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');
    // Build thumbnails after paint so clones get rendered styles
    setTimeout(() => {
      buildOverviewGrid();
      zw.style.display = 'none';
    }, 80);
  }
}

// ── Decorative Elements (Stickers & Text Boxes) ──
let _decorSerial = 0;
const decorElements = {}; // key -> [{id,type,content,x,y,w,h,fontSize,color,rotation}]

const _fdDrag = { active:false, el:null, data:null, startMX:0, startMY:0, ox:0, oy:0 };
const _fdResize = { active:false, el:null, data:null, sx:0, sy:0, ow:0, oh:0, ox:0, oy:0, dir:'rh-se' };

function ctxInsertSticker(emoji) {
  closeCtxMenu();
  const pageEl = _freeImgTargetPageEl || document.querySelector('[data-free-img-key]');
  if (!pageEl) return;
  const key = pageEl.dataset.freeImgKey || pageEl.dataset.decorKey || pageEl.id || 'page0';
  if (!decorElements[key]) decorElements[key] = [];
  const id = 'fd_' + (++_decorSerial);
  const d = { id, type:'sticker', content:emoji, x:100, y:100, w:60, h:60, fontSize:36, color:'inherit', rotation:0 };
  decorElements[key].push(d);
  addDecorToPage(pageEl, d, key);
  showToast('✅ เพิ่มของตกแต่ง');
}

function ctxInsertDecorText() {
  closeCtxMenu();
  const pageEl = _freeImgTargetPageEl || document.querySelector('[data-free-img-key]');
  if (!pageEl) return;
  const key = pageEl.dataset.freeImgKey || pageEl.id || 'page0';
  if (!decorElements[key]) decorElements[key] = [];
  const id = 'fd_' + (++_decorSerial);
  const d = { id, type:'text', content:'ข้อความตกแต่ง', x:80, y:120, w:180, h:50, fontSize:18, color:'#8b4513', rotation:0 };
  decorElements[key].push(d);
  addDecorToPage(pageEl, d, key);
  showToast('✅ เพิ่มกล่องข้อความ');
}

function addDecorToPage(pageEl, d, key) {
  const div = document.createElement('div');
  div.className = 'free-decor';
  div.id = d.id;
  div.style.cssText = `left:${d.x}px;top:${d.y}px;width:${d.w}px;height:${d.h}px;font-size:${d.fontSize}px;color:${d.color};`;
  if (d.rotation) div.style.transform = `rotate(${d.rotation}deg)`;
  const isText = d.type === 'text';
  div.innerHTML = `
    <div class="fi-toolbar" style="top:-34px;">
      <button title="ลบ" onclick="removeDecor('${d.id}','${key}')">✕</button>
      <button title="หมุน 15°" onclick="rotateDecor('${d.id}','${key}',15)">↻</button>
      <button title="หมุน -15°" onclick="rotateDecor('${d.id}','${key}',-15)">↺</button>
      <span class="fi-sep">|</span>
      <input class="fd-size-input" type="number" value="${d.fontSize}" min="8" max="200" title="ขนาด" onchange="setDecorFontSize('${d.id}','${key}',this.value)">
      ${isText ? `<input class="fd-size-input" type="color" value="${d.color==='inherit'?'#8b4513':d.color}" style="width:22px;height:18px;padding:1px;border:none;background:none;cursor:pointer" onchange="setDecorColor('${d.id}','${key}',this.value)" title="สี">` : ''}
    </div>
    <div class="fd-content" ${isText ? `contenteditable="true" spellcheck="false" style="outline:none;min-width:40px;cursor:text;color:${d.color};font-size:${d.fontSize}px;white-space:pre-wrap;word-break:break-word"` : `style="font-size:${d.fontSize}px;line-height:1"`}>${d.content}</div>
    <div class="rh rh-nw"></div><div class="rh rh-n"></div><div class="rh rh-ne"></div>
    <div class="rh rh-e"></div><div class="rh rh-se resize-dot"></div><div class="rh rh-s"></div>
    <div class="rh rh-sw"></div><div class="rh rh-w"></div>
  `;

  // Sync text content edits back to data
  if (isText) {
    const content = div.querySelector('.fd-content');
    content.addEventListener('input', () => { d.content = content.innerText; });
    content.addEventListener('mousedown', (e) => e.stopPropagation()); // don't drag while editing
  }

  // Drag
  div.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('rh') || e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') return;
    if (e.target.classList.contains('fd-content') && d.type === 'text') return;
    document.querySelectorAll('.free-decor').forEach(f => f.classList.remove('selected'));
    div.classList.add('selected');
    const pt = _fiToPageCoords(e.clientX, e.clientY, div);
    _fdDrag.active = true; _fdDrag.el = div; _fdDrag.data = d;
    _fdDrag.startMX = pt.x; _fdDrag.startMY = pt.y; _fdDrag.ox = d.x; _fdDrag.oy = d.y;
    e.preventDefault(); e.stopPropagation();
  });

  // Resize (8 handles)
  div.querySelectorAll('.rh').forEach(handle => {
    handle.addEventListener('mousedown', (e) => {
      e.stopPropagation(); e.preventDefault();
      const pt = _fiToPageCoords(e.clientX, e.clientY, div);
      const dir = Array.from(handle.classList).find(c => c.startsWith('rh-') && c !== 'rh') || 'rh-se';
      document.querySelectorAll('.free-decor').forEach(f => f.classList.remove('selected'));
      div.classList.add('selected');
      _fdResize.active = true; _fdResize.el = div; _fdResize.data = d; _fdResize.dir = dir;
      _fdResize.sx = pt.x; _fdResize.sy = pt.y;
      _fdResize.ow = d.w; _fdResize.oh = d.h; _fdResize.ox = d.x; _fdResize.oy = d.y;
    });
  });

  pageEl.appendChild(div);
  // Select after adding
  document.querySelectorAll('.free-decor').forEach(f => f.classList.remove('selected'));
  div.classList.add('selected');
}

function removeDecor(id, key) {
  const el = document.getElementById(id);
  if (el) el.remove();
  if (decorElements[key]) decorElements[key] = decorElements[key].filter(d => d.id !== id);
}
function rotateDecor(id, key, deg) {
  const arr = decorElements[key]; if (!arr) return;
  const d = arr.find(d => d.id === id); if (!d) return;
  d.rotation = (d.rotation || 0) + deg;
  const el = document.getElementById(id);
  if (el) el.style.transform = `rotate(${d.rotation}deg)`;
}
function setDecorFontSize(id, key, val) {
  const arr = decorElements[key]; if (!arr) return;
  const d = arr.find(d => d.id === id); if (!d) return;
  d.fontSize = parseInt(val);
  const el = document.getElementById(id);
  if (el) { el.style.fontSize = d.fontSize + 'px'; const c = el.querySelector('.fd-content'); if (c) c.style.fontSize = d.fontSize + 'px'; }
}
function setDecorColor(id, key, val) {
  const arr = decorElements[key]; if (!arr) return;
  const d = arr.find(d => d.id === id); if (!d) return;
  d.color = val;
  const el = document.getElementById(id);
  if (el) { el.style.color = val; const c = el.querySelector('.fd-content'); if (c) c.style.color = val; }
}

// Global move/end handlers for decor drag & resize
document.addEventListener('mousemove', (e) => {
  if (_fdDrag.active || _fdResize.active) {
    const cx = e.clientX, cy = e.clientY;
    if (_fdDrag.active) {
      const pt = _fiToPageCoords(cx, cy, _fdDrag.el);
      _fdDrag.data.x = _fdDrag.ox + (pt.x - _fdDrag.startMX);
      _fdDrag.data.y = _fdDrag.oy + (pt.y - _fdDrag.startMY);
      _fdDrag.el.style.left = _fdDrag.data.x + 'px';
      _fdDrag.el.style.top  = _fdDrag.data.y + 'px';
    }
    if (_fdResize.active) {
      const pt = _fiToPageCoords(cx, cy, _fdResize.el);
      const dx = pt.x - _fdResize.sx, dy = pt.y - _fdResize.sy;
      const dir = _fdResize.dir;
      let nw = _fdResize.ow, nh = _fdResize.oh, nx = _fdResize.ox, ny = _fdResize.oy;
      if (dir.includes('e'))  nw = Math.max(30, _fdResize.ow + dx);
      if (dir.includes('w')) { nw = Math.max(30, _fdResize.ow - dx); nx = _fdResize.ox + (_fdResize.ow - nw); }
      if (dir.includes('s'))  nh = Math.max(24, _fdResize.oh + dy);
      if (dir.includes('n')) { nh = Math.max(24, _fdResize.oh - dy); ny = _fdResize.oy + (_fdResize.oh - nh); }
      _fdResize.data.w = nw; _fdResize.data.h = nh;
      _fdResize.data.x = nx; _fdResize.data.y = ny;
      _fdResize.el.style.width = nw + 'px'; _fdResize.el.style.height = nh + 'px';
      _fdResize.el.style.left = nx + 'px'; _fdResize.el.style.top = ny + 'px';
    }
    e.preventDefault();
  }
}, { capture: false });
document.addEventListener('mouseup', () => { _fdDrag.active = false; _fdResize.active = false; });
document.addEventListener('click', (e) => {
  if (!e.target.closest('.free-decor')) {
    document.querySelectorAll('.free-decor').forEach(f => f.classList.remove('selected'));
  }
});

// ── End Decorative Elements ──

// ── FEATURE 1: EPUB Export ──
function exportEPUB() {
  showToast('⏳ กำลังสร้าง EPUB...');
  const title = document.getElementById('bookTitle').value || 'Untitled';
  const author = document.getElementById('authorName').value || 'Author';
  const pen = document.getElementById('penName').value || author;
  const pub = document.getElementById('publisher').value || '';
  const lang = 'th';
  const uid = 'ebook-' + Date.now();
  const safeTitle = title.replace(/[<>&"']/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'}[c]));

  // Build chapter HTML files
  const chapterFiles = [];
  chapters.forEach((ch, i) => {
    const paras = (ch.content || '').split('\n').filter(p => p.trim() && p.trim() !== '[PAGE_BREAK]');
    const bodyHtml = paras.map(p => `<p>${p.replace(/[<>&]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;'}[c]))}</p>`).join('\n');
    const fname = `chapter${i+1}.xhtml`;
    chapterFiles.push({
      name: fname,
      content: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="${lang}">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
  <title>${safeTitle} — บทที่ ${i+1}</title>
  <link rel="stylesheet" type="text/css" href="../css/style.css"/>
</head>
<body>
  <h1 class="chapter-title">${ch.title || 'บทที่ ' + (i+1)}</h1>
  ${bodyHtml || '<p class="empty">— —</p>'}
</body>
</html>`
    });
  });

  const manifestItems = chapterFiles.map((f,i) =>
    `<item id="chapter${i+1}" href="Text/${f.name}" media-type="application/xhtml+xml"/>`
  ).join('\n    ');
  const spineItems = chapterFiles.map((f,i) =>
    `<itemref idref="chapter${i+1}"/>`
  ).join('\n    ');

  const opfContent = `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="BookId" version="2.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf">
    <dc:title>${safeTitle}</dc:title>
    <dc:creator opf:role="aut">${pen}</dc:creator>
    <dc:publisher>${pub}</dc:publisher>
    <dc:language>${lang}</dc:language>
    <dc:identifier id="BookId">${uid}</dc:identifier>
  </metadata>
  <manifest>
    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
    <item id="css" href="css/style.css" media-type="text/css"/>
    ${manifestItems}
  </manifest>
  <spine toc="ncx">
    ${spineItems}
  </spine>
</package>`;

  const ncxContent = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE ncx PUBLIC "-//NISO//DTD ncx 2005-1//EN" "http://www.daisy.org/z3986/2005/ncx-2005-1.dtd">
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head>
    <meta name="dtb:uid" content="${uid}"/>
    <meta name="dtb:depth" content="1"/>
    <meta name="dtb:totalPageCount" content="0"/>
    <meta name="dtb:maxPageNumber" content="0"/>
  </head>
  <docTitle><text>${safeTitle}</text></docTitle>
  <navMap>
    ${chapterFiles.map((f,i) => `<navPoint id="navpoint-${i+1}" playOrder="${i+1}">
      <navLabel><text>บทที่ ${i+1}: ${chapters[i].title||''}</text></navLabel>
      <content src="Text/${f.name}"/>
    </navPoint>`).join('\n    ')}
  </navMap>
</ncx>`;

  const cssContent = `body { font-family: serif; font-size: 1em; line-height: 1.8; margin: 1em; }
h1.chapter-title { font-size: 1.4em; font-weight: bold; margin: 1.5em 0 0.8em; text-align: center; }
p { margin: 0 0 0.6em; text-align: justify; text-indent: 1.5em; }
p:first-of-type { text-indent: 0; }`;

  const containerXml = `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`;

  // Build ZIP
  const files = [
    ['mimetype', 'application/epub+zip'],
    ['META-INF/container.xml', containerXml],
    ['OEBPS/content.opf', opfContent],
    ['OEBPS/toc.ncx', ncxContent],
    ['OEBPS/css/style.css', cssContent],
    ...chapterFiles.map(f => [`OEBPS/Text/${f.name}`, f.content])
  ];

  const enc = new TextEncoder();
  function crc32(buf) {
    let crc = 0xFFFFFFFF;
    const t = new Uint32Array(256);
    for (let i=0;i<256;i++){let c=i;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[i]=c;}
    for (let i=0;i<buf.length;i++) crc=t[(crc^buf[i])&0xFF]^(crc>>>8);
    return (crc^0xFFFFFFFF)>>>0;
  }
  function makeEpubZip(fileList) {
    const parts=[],centralDir=[];let offset=0;
    for(let fi=0;fi<fileList.length;fi++){
      const [name,content]=fileList[fi];
      const isMime = name === 'mimetype';
      const data=enc.encode(content);
      const crc=crc32(data);
      const nameBytes=enc.encode(name);
      // mimetype must be stored uncompressed (method=0, no flags)
      const stored=new Uint8Array(30+nameBytes.length+data.length);
      const dv=new DataView(stored.buffer);
      dv.setUint32(0,0x04034b50,true);
      dv.setUint16(4,20,true);  // version needed
      dv.setUint16(6,0,true);   // flags
      dv.setUint16(8,0,true);   // compression: 0=store
      dv.setUint16(10,0,true);dv.setUint16(12,0,true);
      dv.setUint32(14,crc,true);dv.setUint32(18,data.length,true);dv.setUint32(22,data.length,true);
      dv.setUint16(26,nameBytes.length,true);dv.setUint16(28,0,true);
      stored.set(nameBytes,30);stored.set(data,30+nameBytes.length);
      parts.push(stored);
      const cd=new Uint8Array(46+nameBytes.length);
      const cdv=new DataView(cd.buffer);
      cdv.setUint32(0,0x02014b50,true);cdv.setUint16(4,20,true);cdv.setUint16(6,20,true);
      cdv.setUint16(8,0,true);cdv.setUint16(10,0,true);cdv.setUint16(12,0,true);
      cdv.setUint16(14,0,true);cdv.setUint32(16,crc,true);cdv.setUint32(20,data.length,true);
      cdv.setUint32(24,data.length,true);cdv.setUint16(28,nameBytes.length,true);
      cdv.setUint16(30,0,true);cdv.setUint16(32,0,true);cdv.setUint16(34,0,true);
      cdv.setUint16(36,0,true);cdv.setUint32(38,0,true);cdv.setUint32(42,offset,true);
      cd.set(nameBytes,46);centralDir.push(cd);offset+=stored.length;
    }
    const cdSize=centralDir.reduce((a,b)=>a+b.length,0);
    const eocd=new Uint8Array(22);
    const edv=new DataView(eocd.buffer);
    edv.setUint32(0,0x06054b50,true);edv.setUint16(4,0,true);edv.setUint16(6,0,true);
    edv.setUint16(8,fileList.length,true);edv.setUint16(10,fileList.length,true);
    edv.setUint32(12,cdSize,true);edv.setUint32(16,offset,true);edv.setUint16(20,0,true);
    const all=[...parts,...centralDir,eocd];
    const total=all.reduce((a,b)=>a+b.length,0);
    const out=new Uint8Array(total);let pos=0;
    for(const a of all){out.set(a,pos);pos+=a.length;}
    return out;
  }

  const zipData = makeEpubZip(files);
  const blob = new Blob([zipData], {type:'application/epub+zip'});
  const safeFileName = title.replace(/[^a-zA-Z0-9ก-๙]/g,'_') || 'ebook';
  _downloadBlob(blob, `${safeFileName}.epub`);
  showToast('✅ Export EPUB เรียบร้อย! เปิดด้วย Readium, Calibre หรือ iBooks');
}

// ── FEATURE 3: Mood/Theme Palette ──
const MOOD_PALETTES = {
  darkromance: { accent:'#922b21', accentLight:'#e74c3c', font:'Charm', texture:'cream', cover:'rose', paper:'cream' },
  cozyfantasy: { accent:'#2d6a4f', accentLight:'#52b788', font:'Sarabun', texture:'parchment', cover:'forest', paper:'warm' },
  thriller:    { accent:'#1a3a5c', accentLight:'#2e6da4', font:'Mitr', texture:'grid', cover:'navy', paper:'white' },
  animelight:  { accent:'#7c3aed', accentLight:'#a855f7', font:'Kanit', texture:'anime', cover:'anime_dark', paper:'white' },
  sweetgirl:   { accent:'#be185d', accentLight:'#ec4899', font:'Charm', texture:'sakura', cover:'sakura_soft', paper:'cream' },
  fantasygold: { accent:'#d97706', accentLight:'#fbbf24', font:'Noto Serif Thai', texture:'aged', cover:'fantasy_gold', paper:'warm' },
  horror:      { accent:'#991b1b', accentLight:'#ef4444', font:'Mitr', texture:'horror_dark', cover:'horror', paper:'night' },
  classiclit:  { accent:'#8b4513', accentLight:'#c4773a', font:'Noto Serif Thai', texture:'parchment', cover:'ivory', paper:'sepia' },
};

function applyMoodPalette(name, btnEl) {
  const p = MOOD_PALETTES[name]; if (!p) return;
  // Accent color
  setAccent(p.accent, p.accentLight, null);
  // Font
  rbSetFont(p.font);
  document.querySelectorAll('.font-btn').forEach(b => b.classList.toggle('active', b.textContent.trim().startsWith(p.font)));
  // Texture
  const texEl = document.querySelector(`[data-tex="${p.texture}"]`);
  if (texEl) setPaperTexture(p.texture, texEl);
  // Cover template
  setCoverTemplate(p.cover, null);
  // Paper mode
  setPaperMode(p.paper, document.getElementById('pmb-'+p.paper));
  // UI
  document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');
  showToast('🎨 ใช้ Mood "' + name + '" แล้ว');
}

// ── FEATURE 7: Auto-backup (5 checkpoints) ──
const MAX_BACKUPS = 5;
let backupList_data = [];

function _collectSnapshot() {
  return {
    ts: Date.now(),
    chapters: JSON.parse(JSON.stringify(chapters)),
    bookInfo: ['bookTitle','bookSubtitle','authorName','penName','publisher','pubYear','genre'].reduce((o,id)=>{const el=document.getElementById(id);if(el)o[id]=el.value;return o;},{}),
    label: new Date().toLocaleTimeString('th-TH',{hour:'2-digit',minute:'2-digit',second:'2-digit'})
  };
}

function createManualBackup() {
  const snap = _collectSnapshot();
  backupList_data.unshift(snap);
  if (backupList_data.length > MAX_BACKUPS) backupList_data.length = MAX_BACKUPS;
  _saveBackupsToStorage();
  renderBackupList();
  showToast('📷 Checkpoint บันทึกแล้ว!');
}

function _saveBackupsToStorage() {
  try { localStorage.setItem('ebook_backups', JSON.stringify(backupList_data.map(b=>({ts:b.ts,label:b.label,chapters:b.chapters,bookInfo:b.bookInfo})))); } catch(e){}
}

function _loadBackupsFromStorage() {
  try {
    const raw = localStorage.getItem('ebook_backups');
    if (raw) backupList_data = JSON.parse(raw);
  } catch(e) {}
  renderBackupList();
}

function renderBackupList() {
  const container = document.getElementById('backupList');
  if (!container) return;
  if (!backupList_data.length) {
    container.innerHTML = '<div style="font-size:11px;color:var(--ink-faint);text-align:center;padding:12px">ยังไม่มี Checkpoint</div>';
    return;
  }
  container.innerHTML = '';
  backupList_data.forEach((b, i) => {
    const item = document.createElement('div');
    item.className = 'backup-item';
    const chCount = b.chapters ? b.chapters.length : 0;
    const wordCount = b.chapters ? b.chapters.reduce((s,c)=>(s+(c.content||'').split(/\s+/).filter(Boolean).length),0) : 0;
    item.innerHTML = `
      <div>
        <div class="bi-time">⏱ ${b.label}</div>
        <div class="bi-info">${chCount} บท · ${wordCount} คำ</div>
      </div>
      <button class="bi-restore" onclick="restoreBackup(${i})">กู้คืน</button>`;
    container.appendChild(item);
  });
}

function restoreBackup(idx) {
  const b = backupList_data[idx];
  if (!b) return;
  if (!confirm(`กู้คืน Checkpoint "${b.label}" ?\nการเปลี่ยนแปลงปัจจุบันจะถูกแทนที่`)) return;
  chapters = JSON.parse(JSON.stringify(b.chapters));
  if (b.bookInfo) {
    Object.entries(b.bookInfo).forEach(([id,val]) => {
      const el = document.getElementById(id); if(el) el.value = val;
    });
  }
  currentChapterId = chapters[0]?.id || 1;
  renderChapterList();
  selectChapter(currentChapterId);
  updatePreview();
  showToast('✅ กู้คืน Checkpoint แล้ว!');
}

// Auto-backup every 5 minutes
setInterval(() => {
  if (chapters && chapters.length > 0) {
    const snap = _collectSnapshot();
    backupList_data.unshift(snap);
    if (backupList_data.length > MAX_BACKUPS) backupList_data.length = MAX_BACKUPS;
    _saveBackupsToStorage();
    renderBackupList();
  }
}, 5 * 60 * 1000);

// ── FEATURE 8: Paper Mode (Dark/Light/Cream/Sepia) ──
const PAPER_MODES = {
  white:  { bg:'#fffef9', ink:'#1a1612', headerColor:null },
  cream:  { bg:'#fdf8ed', ink:'#1a1612', headerColor:null },
  warm:   { bg:'#f5e9d0', ink:'#2a1a0a', headerColor:'#6b4423' },
  sepia:  { bg:'#f2e4c8', ink:'#3a2a10', headerColor:'#8b6020' },
  night:  { bg:'#1e1a16', ink:'#d0c8b8', headerColor:'#a09080' },
};
let currentPaperMode = 'white';

function setPaperMode(mode, btnEl) {
  currentPaperMode = mode;
  const pm = PAPER_MODES[mode] || PAPER_MODES.white;
  document.querySelectorAll('.paper-mode-btn').forEach(b => b.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');
  document.querySelectorAll('.page.page-inner').forEach(page => {
    page.style.setProperty('--paper-bg', pm.bg);
    page.style.background = pm.bg;
    if (pm.headerColor) {
      page.querySelectorAll('.page-body,.page-chapter-title,.page-chapter-num,.page-number,.page-header').forEach(el => el.style.setProperty('color', pm.ink, 'important'));
    } else {
      page.querySelectorAll('.page-body,.page-chapter-title,.page-chapter-num,.page-number,.page-header').forEach(el => el.style.removeProperty('color'));
    }
  });
  showToast('🌙 เปลี่ยนสีกระดาษเป็น ' + mode);
}

function reapplyPaperMode() {
  if (currentPaperMode && currentPaperMode !== 'white') {
    setPaperMode(currentPaperMode, document.getElementById('pmb-' + currentPaperMode));
  }
}

// ── FEATURE 6: Regex Find & Replace ──
function _buildSearchRegex(query) {
  const useRegex = document.getElementById('searchRegex')?.checked;
  const useCase = document.getElementById('searchCase')?.checked;
  const useWhole = document.getElementById('searchWholeWord')?.checked;
  let pattern = query;
  if (!useRegex) pattern = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  if (useWhole) pattern = '\\b' + pattern + '\\b';
  const flags = 'g' + (useCase ? '' : 'i');
  try { return new RegExp(pattern, flags); } catch(e) { return null; }
}

function searchCount() {
  const query = document.getElementById('searchInput').value;
  const info = document.getElementById('searchInfo');
  if (!query) { info.textContent = ''; info.className = 'search-result-info'; return; }
  const rx = _buildSearchRegex(query);
  if (!rx) { info.textContent = '⚠️ Regex ไม่ถูกต้อง'; info.className = 'search-result-info miss'; return; }
  const scope = document.querySelector('input[name=searchScope]:checked')?.value;
  const targets = scope === 'all' ? chapters : chapters.filter(c => c.id === currentChapterId);
  let total = 0;
  targets.forEach(ch => { const m = (ch.content || '').match(rx); if (m) total += m.length; });
  if (total > 0) {
    info.textContent = `พบ ${total} รายการ`;
    info.className = 'search-result-info hit';
  } else {
    info.textContent = 'ไม่พบข้อความที่ค้นหา';
    info.className = 'search-result-info miss';
  }
}

function replaceAll() {
  const query = document.getElementById('searchInput').value;
  const replacement = document.getElementById('replaceInput').value;
  if (!query) return;
  const rx = _buildSearchRegex(query);
  if (!rx) { showToast('⚠️ Regex ไม่ถูกต้อง'); return; }
  const scope = document.querySelector('input[name=searchScope]:checked')?.value;
  const targets = scope === 'all' ? chapters : chapters.filter(c => c.id === currentChapterId);
  let total = 0;
  targets.forEach(ch => {
    const before = ch.content || '';
    const after = before.replace(rx, replacement);
    const count = (before.match(rx) || []).length;
    total += count;
    ch.content = after;
  });
  if (currentChapterId) {
    const ch = chapters.find(c => c.id === currentChapterId);
    const ta = document.getElementById('chapterEditor');
    if (ch && ta) ta.value = ch.content;
  }
  updatePreview();
  showToast(`✅ แทนที่ ${total} รายการเรียบร้อย`);
  searchCount();
}

function replaceOne() {
  const query = document.getElementById('searchInput').value;
  const replacement = document.getElementById('replaceInput').value;
  if (!query) return;
  const rx = _buildSearchRegex(query);
  if (!rx) { showToast('⚠️ Regex ไม่ถูกต้อง'); return; }
  // Replace only first occurrence in current scope
  const scope = document.querySelector('input[name=searchScope]:checked')?.value;
  const targets = scope === 'all' ? chapters : chapters.filter(c => c.id === currentChapterId);
  for (const ch of targets) {
    const before = ch.content || '';
    // Reset lastIndex for stateful regex
    rx.lastIndex = 0;
    if (rx.test(before)) {
      rx.lastIndex = 0;
      ch.content = before.replace(rx, (m, ...args) => {
        // Replace only first: set flag
        if (!replaceOne._done) { replaceOne._done = true; return replacement.replace(/\$(\d+)/g, (_, n) => args[parseInt(n)-1] || ''); }
        return m;
      });
      replaceOne._done = false;
      if (currentChapterId === ch.id) {
        const ta = document.getElementById('chapterEditor'); if (ta) ta.value = ch.content;
      }
      updatePreview();
      showToast('✅ แทนที่ 1 รายการ');
      searchCount();
      return;
    }
  }
  showToast('ไม่พบข้อความที่ค้นหา');
}
replaceOne._done = false;

// ── FEATURE 5: Clipboard / Paste history with preserve/strip mode ──
let clipboardHistory = [];
const MAX_CLIP_HISTORY = 10;
let _pasteMode = 'preserve'; // 'preserve' | 'strip'

function setPasteMode(mode, btnEl) {
  _pasteMode = mode;
  document.querySelectorAll('#pasteMode-preserve,#pasteMode-strip').forEach(b => b.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');
  const hint = document.getElementById('pasteModeHint');
  if (hint) {
    if (mode === 'preserve') {
      hint.innerHTML = '📄 <b>คงรูปแบบ</b>: รักษา **bold**, _italic_, __underline__ จาก Word/Doc';
    } else {
      hint.innerHTML = '🧹 <b>ล้าง Fmt</b>: ข้อความเปล่า ไม่มี formatting — สะอาดที่สุด';
    }
  }
}

// แปลง HTML จาก clipboard → markup string (รักษา bold/italic/underline)
function _htmlToMarkup(html) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  function nodeToMarkup(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent;
    }
    const tag = node.nodeName.toUpperCase();
    const inner = Array.from(node.childNodes).map(nodeToMarkup).join('');
    if (tag === 'STRONG' || tag === 'B') return `**${inner}**`;
    if (tag === 'EM' || tag === 'I') return `_${inner}_`;
    if (tag === 'U') return `__${inner}__`;
    if (tag === 'BR') return '\n';
    if (tag === 'P' || tag === 'DIV' || tag === 'LI') return inner + '\n';
    if (tag === 'H1' || tag === 'H2' || tag === 'H3') return `**${inner}**\n`;
    if (tag === 'TABLE') {
      // แปลงตาราง → แถวธรรมดา
      return Array.from(node.querySelectorAll('tr')).map(r =>
        Array.from(r.querySelectorAll('td,th')).map(c => c.textContent.trim()).join(' | ')
      ).join('\n') + '\n';
    }
    return inner;
  }
  let result = nodeToMarkup(tmp);
  // Clean up artifacts
  result = result
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\t/g, ' ')
    .replace(/\u00A0/g, ' ')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/ {2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  return result;
}

function handleClipboardPaste(event, textarea) {
  event.preventDefault();
  const clipData = event.clipboardData || window.clipboardData;
  let text = '';

  if (_pasteMode === 'preserve') {
    // ลอง HTML ก่อนเพื่อรักษา formatting
    const html = clipData.getData('text/html');
    if (html && html.trim()) {
      text = _htmlToMarkup(html);
    } else {
      text = clipData.getData('text/plain') || '';
      text = text
        .replace(/\r\n/g, '\n').replace(/\r/g, '\n')
        .replace(/\t/g, ' ').replace(/\u00A0/g, ' ')
        .replace(/[\u200B-\u200D\uFEFF]/g, '')
        .replace(/ {2,}/g, ' ').trim();
    }
    showToast('📄 วางข้อความ (คงรูปแบบ) เรียบร้อย');
  } else {
    // Strip mode: plain text เท่านั้น
    text = clipData.getData('text/plain');
    if (!text) {
      const html = clipData.getData('text/html');
      const tmp = document.createElement('div');
      tmp.innerHTML = html;
      text = tmp.innerText;
    }
    text = text
      .replace(/\r\n/g, '\n').replace(/\r/g, '\n')
      .replace(/\t/g, ' ').replace(/\u00A0/g, ' ')
      .replace(/[\u200B-\u200D\uFEFF]/g, '')
      .replace(/ {2,}/g, ' ').trim();
    showToast('🧹 วางข้อความ (ล้าง formatting) เรียบร้อย');
  }

  textarea.value = text;
  // Add to history
  if (text && !clipboardHistory.includes(text)) {
    clipboardHistory.unshift(text);
    if (clipboardHistory.length > MAX_CLIP_HISTORY) clipboardHistory.length = MAX_CLIP_HISTORY;
    renderClipHistory();
  }
}

function renderClipHistory() {
  const container = document.getElementById('clipHistory');
  if (!container) return;
  if (!clipboardHistory.length) {
    container.innerHTML = '<div class="clip-item" style="color:var(--ink-faint);font-style:italic">ยังไม่มีประวัติ...</div>';
    return;
  }
  container.innerHTML = '';
  clipboardHistory.forEach((text, i) => {
    const item = document.createElement('div');
    item.className = 'clip-item';
    item.title = text;
    item.textContent = text.substring(0, 80) + (text.length > 80 ? '...' : '');
    item.onclick = () => {
      document.getElementById('clipboardPasteArea').value = text;
    };
    container.appendChild(item);
  });
}

function stripAndInsert() {
  const text = document.getElementById('clipboardPasteArea')?.value?.trim();
  if (!text) { showToast('⚠️ ไม่มีข้อความให้แทรก'); return; }
  const ch = chapters.find(c => c.id === currentChapterId);
  if (!ch) return;
  ch.content = (ch.content ? ch.content + '\n\n' : '') + text;
  const ta = document.getElementById('chapterEditor');
  if (ta) ta.value = ch.content;
  document.getElementById('clipboardPasteArea').value = '';
  updatePreview();
  showToast('✅ แทรกข้อความเรียบร้อย');
}

// ── FEATURE 4: Chapter Image Position ──
function setChImgPosition(pos, btnEl) {
  const ch = chapters.find(c => c.id === currentChapterId);
  if (ch) { ch.imagePosition = pos; updatePreview(); }
  document.querySelectorAll('.ch-img-pos-btn').forEach(b => b.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');
}

// ── FEATURE 10: Internal Link (TOC → chapter jump) ──
function jumpToChapterInPreview(chapterIdx) {
  // Switch to scroll mode and scroll to that chapter, or navigate to its page in single mode
  const allUnits = collectPageUnits();
  // Find the unit for this chapter (label contains "บทที่ X")
  const targetLabel = `บทที่ ${chapterIdx + 1}:`;
  const unitIdx = allUnits.findIndex(u => u.label && u.label.textContent.includes(targetLabel));
  if (unitIdx < 0) { showToast('ไม่พบบทนี้ในหน้าพรีวิว'); return; }
  if (viewMode === 'scroll') {
    const u = allUnits[unitIdx];
    if (u.pages[0]) u.pages[0].scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    currentPageIndex = unitIdx;
    applyViewMode();
  }
  showToast(`🔗 ไปยังบทที่ ${chapterIdx + 1}`);
}

// ── FEATURE 2: Advanced Page Numbers ──
function formatPageNumAdvanced(n) {
  const startNum = parseInt(document.getElementById('pageNumStart')?.value) || 1;
  const actualN = n + startNum - 1;
  if (pageNumStyle === 'roman') {
    return toRoman(actualN);
  }
  if (pageNumStyle === 'plain') return String(actualN);
  if (pageNumStyle === 'dot') return `· ${actualN} ·`;
  if (pageNumStyle === 'thai') {
    const thai = ['๐','๑','๒','๓','๔','๕','๖','๗','๘','๙'];
    return String(actualN).split('').map(d => thai[parseInt(d)] || d).join('');
  }
  return `— ${actualN} —`;
}

function toRoman(num) {
  if (num <= 0) return String(num);
  const vals = [1000,900,500,400,100,90,50,40,10,9,5,4,1];
  const syms = ['m','cm','d','cd','c','xc','l','xl','x','ix','v','iv','i'];
  let result = '';
  for (let i = 0; i < vals.length; i++) {
    while (num >= vals[i]) { result += syms[i]; num -= vals[i]; }
  }
  return result;
}

function shouldHidePageNum(isFirstPage, isSpecialPage, isCoverPage, isTitlePage) {
  if (isCoverPage && document.getElementById('hideNumCover')?.checked) return true;
  if (isTitlePage && document.getElementById('hideNumTitle')?.checked) return true;
  if (isSpecialPage && document.getElementById('hideNumSpecial')?.checked) return true;
  if (isFirstPage && document.getElementById('hideNumFirstChapter')?.checked) return true;
  return false;
}

init();

// ─── ตรวจคำผิด (Spell Check) ───────────────────────────────────────────────

const SC_SYSTEM = `คุณคือบรรณาธิการภาษาไทยมืออาชีพ ตรวจสอบคำผิดในข้อความภาษาไทย

ตรวจหา: คำสะกดผิด, วรรณยุกต์ผิด, สระผิด, ตัวสะกดผิด, คำที่ใช้ผิดความหมาย, เว้นวรรคผิด

ตอบเป็น JSON array เท่านั้น ไม่มีข้อความอื่น:
[{"wrong":"คำผิด","correct":"คำถูก","context":"...ประโยคสั้นๆ...","type":"ประเภท"}]

ถ้าไม่พบผิด ตอบ: []`;

async function callClaudeSpell(text) {
  return await callAI(SC_SYSTEM, text);
}

function scChunks(text, size = 3000) {
  const out = [];
  let pos = 0;
  while (pos < text.length) {
    let end = Math.min(pos + size, text.length);
    if (end < text.length) { const nl = text.lastIndexOf('\n', end); if (nl > pos + 300) end = nl; }
    out.push(text.slice(pos, end));
    pos = end;
  }
  return out;
}

const TYPE_COLOR = {
  'สะกดผิด':'#ef4444','วรรณยุกต์ผิด':'#f97316','สระผิด':'#eab308',
  'ตัวสะกดผิด':'#8b5cf6','ความหมายผิด':'#06b6d4','เว้นวรรคผิด':'#10b981'
};
function scColor(t) { for (const [k,v] of Object.entries(TYPE_COLOR)) if (t?.includes(k)) return v; return '#6b7280'; }

function clearSpellResults() {
  document.getElementById('sc-status').textContent = 'กด "ตรวจ" เพื่อเริ่มตรวจสอบคำผิด';
  document.getElementById('sc-results-list').innerHTML = '';
  document.getElementById('sc-summary').innerHTML = '';
}

async function runSpellCheck() {
  const scope = document.getElementById('sc-scope').value;
  let text = '';
  if (scope === 'current') {
    const ch = chapters.find(c => c.id === currentChapterId);
    text = ch ? ch.content : '';
  } else {
    text = chapters.map(c => c.content).join('\n\n');
  }
  if (!text.trim()) { showToast('⚠ ไม่มีข้อความให้ตรวจ'); return; }

  // Show modal
  const modal = document.getElementById('sc-modal');
  const resultsList = document.getElementById('sc-results-list');
  const summary = document.getElementById('sc-summary');
  const progressWrap = document.getElementById('sc-progress-wrap');
  const progressBar = document.getElementById('sc-progress-bar');
  const progressLabel = document.getElementById('sc-progress-label');
  const statusEl = document.getElementById('sc-status');

  modal.style.display = 'flex';
  resultsList.innerHTML = '';
  summary.innerHTML = '<span style="color:var(--ink-muted)">กำลังตรวจสอบ...</span>';
  progressWrap.style.display = 'block';
  progressBar.style.width = '0%';

  const chunks = scChunks(text);
  const allErrors = [];
  statusEl.textContent = `กำลังตรวจ 0/${chunks.length} ส่วน...`;

  for (let i = 0; i < chunks.length; i++) {
    progressLabel.textContent = `กำลังตรวจส่วนที่ ${i+1} / ${chunks.length}`;
    progressBar.style.width = ((i / chunks.length) * 100) + '%';
    try {
      const errs = await callClaudeSpell(chunks[i]);
      allErrors.push(...errs);
      renderSpellResults(allErrors, resultsList, summary);
    } catch(e) {
      summary.innerHTML = `<span style="color:#ef4444">⚠ เกิดข้อผิดพลาด: ${e.message}</span>`;
      break;
    }
    if (i < chunks.length - 1) await new Promise(r => setTimeout(r, 300));
  }

  progressBar.style.width = '100%';
  progressWrap.style.display = 'none';
  statusEl.textContent = `ตรวจเสร็จ: พบ ${allErrors.length} รายการ`;

  const label = scope === 'current'
    ? chapters.find(c=>c.id===currentChapterId)?.title || 'บทปัจจุบัน'
    : 'ทุกบท';
  summary.innerHTML = allErrors.length === 0
    ? `<span style="color:#10b981">✅ ไม่พบข้อผิดพลาดใน ${label}</span>`
    : `<strong>พบ ${allErrors.length} รายการ</strong> ใน ${label}`;
}

// ─── AI Features ────────────────────────────────────────────────────────────

const AI_KEY_LS = 'novelforge_ai_key';
const AI_PROVIDER_LS = 'novelforge_ai_provider'; // 'gemini' | 'claude'
let aiCurrentFeature = null;
let aiLastResult = '';

// ── Provider management ──
function aiLoadProvider() {
  try { return localStorage.getItem(AI_PROVIDER_LS) || 'gemini'; } catch { return 'gemini'; }
}
function aiSaveProvider(v) {
  try { localStorage.setItem(AI_PROVIDER_LS, v); } catch {}
}

// ── Key management ──
function aiLoadKey() {
  try { return localStorage.getItem(AI_KEY_LS) || ''; } catch { return ''; }
}
function aiSaveKey(v) {
  try { if (v.trim()) localStorage.setItem(AI_KEY_LS, v.trim()); else localStorage.removeItem(AI_KEY_LS); } catch {}
}
function aiClearKey() {
  try { localStorage.removeItem(AI_KEY_LS); } catch {}
  const inp = document.getElementById('ai-api-key');
  if (inp) inp.value = '';
  showToast('🗑 ลบ API Key แล้ว');
}
function aiToggleKeyVisible() {
  const inp = document.getElementById('ai-api-key');
  if (inp) inp.type = inp.type === 'password' ? 'text' : 'password';
}
function aiSaveKeyModal() {
  const v = document.getElementById('ai-key-modal-input')?.value?.trim();
  if (!v) return;
  const provider = document.getElementById('ai-provider-select')?.value || 'gemini';
  aiSaveProvider(provider);
  aiSaveKey(v);
  const inp = document.getElementById('ai-api-key');
  if (inp) inp.value = v;
  document.getElementById('ai-key-modal').style.display = 'none';
  showToast('✅ บันทึก API Key แล้ว (' + (provider === 'gemini' ? 'Gemini' : 'Claude') + ')');
  aiUpdateProviderUI();
}

function aiModalSelectProvider(provider) {
  document.getElementById('ai-provider-select').value = provider;
  const gTab = document.getElementById('ai-tab-gemini');
  const cTab = document.getElementById('ai-tab-claude');
  const gGuide = document.getElementById('ai-guide-gemini');
  const cGuide = document.getElementById('ai-guide-claude');
  const inp = document.getElementById('ai-key-modal-input');
  if (provider === 'gemini') {
    gTab.style.borderColor = '#1a73e8'; gTab.style.background = '#e8f0fe'; gTab.style.color = '#1a73e8';
    cTab.style.borderColor = 'var(--border)'; cTab.style.background = 'var(--panel-bg)'; cTab.style.color = 'var(--ink-muted)';
    gGuide.style.display = 'block'; cGuide.style.display = 'none';
    if (inp) inp.placeholder = 'AIza...';
  } else {
    cTab.style.borderColor = 'var(--accent)'; cTab.style.background = '#fef9f0'; cTab.style.color = 'var(--accent)';
    gTab.style.borderColor = 'var(--border)'; gTab.style.background = 'var(--panel-bg)'; gTab.style.color = 'var(--ink-muted)';
    cGuide.style.display = 'block'; gGuide.style.display = 'none';
    if (inp) inp.placeholder = 'sk-ant-...';
  }
}

function aiUpdateProviderUI() {
  const provider = aiLoadProvider();
  const badge = document.getElementById('ai-provider-badge');
  if (badge) {
    badge.textContent = provider === 'gemini' ? '✦ Gemini (ฟรี)' : '◆ Claude';
    badge.style.color = provider === 'gemini' ? '#1a73e8' : '#c9a227';
  }
  const sel = document.getElementById('ai-provider-select');
  if (sel) sel.value = provider;
  // update placeholder
  const inp = document.getElementById('ai-api-key');
  if (inp) inp.placeholder = provider === 'gemini' ? 'AIza...' : 'sk-ant-...';
  const mInp = document.getElementById('ai-key-modal-input');
  if (mInp) mInp.placeholder = provider === 'gemini' ? 'AIza...' : 'sk-ant-...';
}

// Load key + provider on init
(function() {
  const k = aiLoadKey();
  const inp = document.getElementById('ai-api-key');
  if (inp && k) inp.value = k;
  aiUpdateProviderUI();
})();

// ── Unified API call ──
async function callAI(systemPrompt, userContent) {
  const key = aiLoadKey();
  if (!key) throw new Error('ไม่พบ API Key — ไปที่แท็บ 🤖 AI เพื่อใส่ key');
  const provider = aiLoadProvider();

  if (provider === 'gemini') {
    // Google Gemini API (ฟรี quota สูง)
    // หมายเหตุ: v1 endpoint ไม่รองรับ system_instruction โดยตรง
    // แก้โดยรวม system prompt เข้าไปใน contents เป็น turn แรกของ model
    const model = 'gemini-2.0-flash';
    const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${key}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: 'user',  parts: [{ text: systemPrompt }] },
          { role: 'model', parts: [{ text: 'เข้าใจแล้วครับ พร้อมปฏิบัติตามคำสั่ง' }] },
          { role: 'user',  parts: [{ text: userContent }] }
        ],
        generationConfig: { maxOutputTokens: 1500, temperature: 0.8 }
      })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const msg = err?.error?.message || 'Gemini API ' + res.status;
      if (res.status === 400 && msg.includes('API key')) throw new Error('API Key ไม่ถูกต้อง — ตรวจสอบ key จาก aistudio.google.com');
      throw new Error(msg);
    }
    const d = await res.json();
    return d?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
  } else {
    // Anthropic Claude API
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        system: systemPrompt,
        messages: [{ role: 'user', content: userContent }]
      })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error?.message || 'Claude API ' + res.status);
    }
    const d = await res.json();
    return (d.content?.[0]?.text || '').trim();
  }
}

// ── Get text scope ──
function aiGetText(scope) {
  const ch = chapters.find(c => c.id === currentChapterId);
  const full = ch ? ch.content : '';
  if (scope === 'selection') {
    const sel = window.getSelection?.()?.toString?.() || '';
    return sel.trim() || full;
  }
  if (scope === 'last500') return full.slice(-500);
  return full;
}

// ── Feature launcher ──
function aiFeature(feature) {
  const key = aiLoadKey();
  if (!key) {
    const modal = document.getElementById('ai-key-modal');
    modal.style.display = 'flex';
    aiModalSelectProvider(aiLoadProvider());
    return;
  }
  aiCurrentFeature = feature;
  const modal = document.getElementById('ai-modal');
  const titleEl = document.getElementById('ai-modal-title');
  const labelEl = document.getElementById('ai-prompt-label');
  const resultEl = document.getElementById('ai-result-text');

  const cfg = {
    continue:   { title: '✍️ ต่อเนื้อเรื่อง',     label: 'คำสั่งเพิ่มเติม (เช่น: ต่อ 2 ย่อหน้า, เพิ่มความตึงเครียด)' },
    outline:    { title: '📋 โครงเรื่อง → เนื้อหา', label: 'วางโครงเรื่อง/bullet points ที่ต้องการแปลง' },
    rewrite:    { title: '🎨 ปรับ Style',            label: 'คำสั่งปรับ (เช่น: ภาษาสุภาพ, ดราม่ามากขึ้น, กระชับ)' },
    suggest:    { title: '💡 แนะนำประโยคต่อ',        label: 'บริบทเพิ่มเติม (เช่น: หลังจากนี้จะเกิดเหตุการณ์อะไร)' },
    thesaurus:  { title: '📖 คำไวพจน์ / คำสวยงาม',  label: 'คำหรือวลีที่ต้องการหาคำไวพจน์ (หรือไฮไลต์คำในหน้าก่อนกด)' },
  };
  const c = cfg[feature] || cfg.continue;
  titleEl.textContent = c.title;
  labelEl.textContent = c.label;
  resultEl.textContent = '';
  document.getElementById('ai-btn-copy').style.display = 'none';
  document.getElementById('ai-btn-insert').style.display = 'none';
  document.getElementById('ai-btn-replace').style.display = 'none';
  document.getElementById('ai-spinner').style.display = 'none';
  document.getElementById('ai-progress-wrap').style.display = 'none';
  document.getElementById('ai-prompt-extra').value = '';
  modal.style.display = 'flex';
}

async function aiRun() {
  const key = aiLoadKey();
  if (!key) { showToast('⚠ ใส่ API Key ก่อน'); return; }

  const feature = aiCurrentFeature;
  const scope = document.getElementById('ai-scope').value;
  const extra = document.getElementById('ai-prompt-extra').value.trim();
  const text = aiGetText(scope);
  if (!text.trim() && feature !== 'outline') { showToast('⚠ ไม่มีข้อความในบทปัจจุบัน'); return; }

  const runBtn = document.getElementById('ai-run-btn');
  const spinner = document.getElementById('ai-spinner');
  const progressWrap = document.getElementById('ai-progress-wrap');
  const progressBar = document.getElementById('ai-progress-bar');
  const resultEl = document.getElementById('ai-result-text');
  const statusEl = document.getElementById('ai-status');

  runBtn.disabled = true;
  spinner.style.display = 'flex';
  progressWrap.style.display = 'block';
  progressBar.style.width = '30%';
  resultEl.textContent = '';
  document.getElementById('ai-btn-copy').style.display = 'none';
  document.getElementById('ai-btn-insert').style.display = 'none';
  document.getElementById('ai-btn-replace').style.display = 'none';
  statusEl.textContent = '⏳ กำลังประมวลผล...';

  const prompts = {
    continue: `คุณคือนักเขียนนิยายไทยมืออาชีพ ช่วยต่อเนื้อเรื่องต่อจากข้อความที่ให้ไว้ให้ราบรื่นและน่าสนใจ
รักษาสไตล์การเขียนและน้ำเสียงของผู้แต่งเดิม ตอบเป็นเนื้อหาต่อเนื่องเท่านั้น ไม่มีคำอธิบายเพิ่ม
${extra ? `คำสั่งเพิ่มเติม: ${extra}` : ''}`,

    outline: `คุณคือนักเขียนนิยายไทยมืออาชีพ แปลงโครงเรื่องหรือ bullet points ที่ให้ไว้ให้เป็นเนื้อหานิยายที่อ่านแล้วลื่นไหล
เขียนเป็นร้อยแก้วที่สละสลวย มีบรรยากาศ มีอารมณ์ความรู้สึก ตอบเป็นเนื้อหาเท่านั้น
${extra ? `เนื้อหาพิเศษ: ${extra}` : ''}`,

    rewrite: `คุณคือบรรณาธิการนิยายไทยมืออาชีพ ปรับแต่งข้อความที่ให้ไว้ให้ดีขึ้น
${extra ? `ให้ปรับตามนี้: ${extra}` : 'ปรับให้สละสลวย ลื่นไหล อ่านง่ายขึ้น โดยรักษาโครงเรื่องและความหมายเดิม'}
ตอบเฉพาะข้อความที่ปรับแล้วเท่านั้น`,

    suggest: `คุณคือนักเขียนนิยายไทยมืออาชีพ อ่านข้อความที่ให้ไว้แล้วแนะนำ 3 ตัวเลือกประโยคหรือย่อหน้าถัดไป
แต่ละตัวเลือกควรนำเรื่องไปในทิศทางที่ต่างกัน ใส่หัวข้อ "ตัวเลือกที่ 1/2/3:" ก่อนแต่ละอัน
${extra ? `บริบท: ${extra}` : ''}`,

    thesaurus: `คุณคือนักเขียนนิยายไทยมืออาชีพและผู้เชี่ยวชาญด้านภาษา
วิเคราะห์คำหรือวลีที่ให้มา แล้วแนะนำคำไวพจน์ คำที่สละสลวย หรือคำที่เหมาะกับนิยายมากกว่า
จัดออกมาเป็น 3 หมวด:
1. "คำไวพจน์โดยตรง" — คำที่มีความหมายใกล้เคียงกันมาก (5-8 คำ)
2. "คำสวยงามสำหรับนิยาย" — คำที่อ่านแล้วรู้สึกมีวรรณศิลป์ มีอารมณ์ (5-8 คำ พร้อมอธิบายสั้น)
3. "ประโยคตัวอย่าง" — ตัวอย่างประโยค 3 ประโยคที่นำคำไวพจน์ไปใช้ในบริบทนิยาย
ตอบเป็นภาษาไทย`,
  };

  const systemPrompt = prompts[feature] || prompts.continue;
  let userContent;
  if (feature === 'outline' && extra) {
    userContent = extra;
  } else if (feature === 'thesaurus') {
    const sel = window.getSelection?.()?.toString?.().trim() || '';
    userContent = sel || extra || text.slice(-200);
    if (!userContent.trim()) { showToast('⚠ กรุณาไฮไลต์คำที่ต้องการ หรือพิมพ์คำในช่องด้านบน'); runBtn.disabled = false; spinner.style.display = 'none'; progressWrap.style.display = 'none'; return; }
  } else {
    userContent = text;
  }

  try {
    progressBar.style.width = '60%';
    aiLastResult = await callAI(systemPrompt, userContent);
    resultEl.textContent = aiLastResult;
    progressBar.style.width = '100%';
    setTimeout(() => { progressWrap.style.display = 'none'; }, 600);
    document.getElementById('ai-btn-copy').style.display = 'inline-flex';
    if (feature === 'continue' || feature === 'outline') {
      document.getElementById('ai-btn-insert').style.display = 'inline-flex';
    }
    if (feature === 'rewrite') {
      document.getElementById('ai-btn-replace').style.display = 'inline-flex';
    }
    statusEl.textContent = '✅ เสร็จแล้ว';
  } catch(e) {
    resultEl.textContent = '⚠ เกิดข้อผิดพลาด: ' + e.message;
    statusEl.textContent = '⚠ เกิดข้อผิดพลาด';
    progressWrap.style.display = 'none';
  } finally {
    runBtn.disabled = false;
    spinner.style.display = 'none';
  }
}

function aiCopyResult() {
  if (!aiLastResult) return;
  navigator.clipboard?.writeText(aiLastResult).then(() => showToast('📋 คัดลอกแล้ว')).catch(() => showToast('⚠ ไม่สามารถคัดลอกได้'));
}

function aiInsertResult() {
  if (!aiLastResult) return;
  const ch = chapters.find(c => c.id === currentChapterId);
  if (!ch) { showToast('⚠ ไม่พบบทปัจจุบัน'); return; }
  aiPushUndo(aiCurrentFeature);
  ch.content = (ch.content || '') + '\n\n' + aiLastResult;
  pushHistory();
  updatePreview();
  document.getElementById('ai-modal').style.display = 'none';
  showToast('✅ เพิ่มเนื้อหาแล้ว');
}

function aiReplaceResult() {
  if (!aiLastResult) return;
  const ch = chapters.find(c => c.id === currentChapterId);
  if (!ch) { showToast('⚠ ไม่พบบทปัจจุบัน'); return; }
  if (!confirm('แทนที่เนื้อหาทั้งหมดในบทนี้ด้วยข้อความใหม่?')) return;
  aiPushUndo(aiCurrentFeature);
  ch.content = aiLastResult;
  pushHistory();
  updatePreview();
  document.getElementById('ai-modal').style.display = 'none';
  showToast('🔄 แทนที่เนื้อหาแล้ว');
}

// ─────────────────────────────────────────────────────────────────────────────
// ── Story Plotter ──
let plotterChaptersData = [];

function openStoryPlotter() {
  const key = aiLoadKey();
  if (!key) {
    const modal = document.getElementById('ai-key-modal');
    modal.style.display = 'flex';
    aiModalSelectProvider(aiLoadProvider());
    return;
  }
  document.getElementById('story-plotter-modal').style.display = 'flex';
  document.getElementById('plotter-result').innerHTML = '';
  document.getElementById('plotter-btn-add-chapters').style.display = 'none';
  plotterChaptersData = [];
}

async function runStoryPlotter() {
  const idea = document.getElementById('plotter-idea').value.trim();
  if (!idea) { showToast('⚠ กรุณาใส่ไอเดียเรื่องก่อน'); return; }
  const numChapters = parseInt(document.getElementById('plotter-chapters').value) || 10;
  const btn = document.getElementById('plotter-run-btn');
  const spinner = document.getElementById('plotter-spinner');
  const resultEl = document.getElementById('plotter-result');
  btn.disabled = true; spinner.style.display = 'inline';
  resultEl.innerHTML = '<div style="text-align:center;padding:32px;color:var(--ink-muted)">⏳ AI กำลังสร้างโครงเรื่อง...</div>';

  const systemPrompt = `คุณคือนักเขียนนิยายไทยมืออาชีพ ช่วยสร้างโครงเรื่องแบ่งเป็น ${numChapters} บท
ตอบเป็น JSON เท่านั้น รูปแบบ: {"title":"ชื่อเรื่อง","chapters":[{"num":1,"title":"ชื่อบท","summary":"สรุปบทย่อ 2-3 ประโยค","hook":"ประโยคเปิดบทที่น่าสนใจ"},...]}
ไม่มี markdown ไม่มี backtick ตอบ JSON ล้วนๆ`;

  try {
    const raw = await callAI(systemPrompt, `ไอเดียเรื่อง: ${idea}`);
    const clean = raw.replace(/```json|```/g, '').trim();
    const data = JSON.parse(clean);
    plotterChaptersData = data.chapters || [];

    let html = `<div style="margin-bottom:14px">
      <div style="font-family:'Playfair Display',serif;font-size:17px;font-weight:700;color:var(--accent);margin-bottom:4px">${data.title || 'ชื่อเรื่อง'}</div>
      <div style="font-size:11px;color:var(--ink-faint)">${plotterChaptersData.length} บท</div>
    </div>`;

    plotterChaptersData.forEach((ch, i) => {
      html += `<div style="border:1px solid var(--border);border-radius:8px;padding:12px;margin-bottom:10px;background:#fff;cursor:pointer;transition:box-shadow 0.15s" onclick="plotterSelectChapter(${i})" id="plotter-ch-${i}">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
          <span style="background:var(--accent);color:#fff;border-radius:50%;width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0">${ch.num||i+1}</span>
          <strong style="font-size:13px">${ch.title || 'บทที่ '+(i+1)}</strong>
        </div>
        <div style="font-size:12px;color:var(--ink-muted);line-height:1.7;margin-bottom:6px">${ch.summary || ''}</div>
        ${ch.hook ? `<div style="font-size:11px;color:var(--accent);font-style:italic;border-left:3px solid var(--accent);padding-left:8px">"${ch.hook}"</div>` : ''}
      </div>`;
    });

    resultEl.innerHTML = html;
    document.getElementById('plotter-btn-add-chapters').style.display = 'inline-flex';
    showToast('✅ สร้างโครงเรื่องสำเร็จ!');
  } catch(e) {
    resultEl.innerHTML = `<div style="color:#dc2626;padding:16px">⚠ เกิดข้อผิดพลาด: ${e.message}</div>`;
  } finally {
    btn.disabled = false; spinner.style.display = 'none';
  }
}

function plotterSelectChapter(i) {
  // highlight selected
  document.querySelectorAll('[id^="plotter-ch-"]').forEach(el => el.style.boxShadow = '');
  const el = document.getElementById(`plotter-ch-${i}`);
  if (el) el.style.boxShadow = '0 0 0 2px var(--accent)';
}

function plotterAddChapters() {
  if (!plotterChaptersData.length) return;
  if (!confirm(`เพิ่ม ${plotterChaptersData.length} บทเข้าโปรเจกต์ปัจจุบัน? (จะเพิ่มต่อท้ายบทที่มีอยู่)`)) return;
  plotterChaptersData.forEach((ch, i) => {
    const id = 'ch_plotter_' + Date.now() + '_' + i;
    chapters.push({
      id, title: ch.title || ('บทที่ ' + (i+1)),
      content: ch.hook ? `${ch.hook}\n\n[โครงเรื่อง: ${ch.summary || ''}]` : `[โครงเรื่อง: ${ch.summary || ''}]`,
      note: ch.summary || '', imageData: null, imageSize: 100
    });
  });
  renderChapterList();
  selectChapter(chapters[chapters.length - plotterChaptersData.length].id);
  updatePreview(); updateStats();
  document.getElementById('story-plotter-modal').style.display = 'none';
  showToast(`✅ เพิ่ม ${plotterChaptersData.length} บทแล้ว`);
}

// ─────────────────────────────────────────────────────────────────────────────
// ── AI Prompt History (Undo AI) ──
const AI_HISTORY_MAX = 20;
let aiUndoStack = []; // [{chapterId, content, timestamp, feature}]

function aiPushUndo(feature) {
  const ch = chapters.find(c => c.id === currentChapterId);
  if (!ch) return;
  aiUndoStack.push({ chapterId: currentChapterId, content: ch.content, timestamp: Date.now(), feature });
  if (aiUndoStack.length > AI_HISTORY_MAX) aiUndoStack.shift();
}

function aiUndoLast() {
  const last = aiUndoStack.pop();
  if (!last) { showToast('⚠ ไม่มีประวัติ AI ที่จะย้อนกลับ'); return; }
  const ch = chapters.find(c => c.id === last.chapterId);
  if (!ch) { showToast('⚠ ไม่พบบทที่ต้องการ'); return; }
  ch.content = last.content;
  if (currentChapterId === last.chapterId) {
    updatePreview(); updateStats();
  }
  const t = new Date(last.timestamp);
  showToast(`↩ ย้อนกลับก่อน AI "${last.feature}" เมื่อ ${t.getHours()}:${String(t.getMinutes()).padStart(2,'0')}`);
}

// ─────────────────────────────────────────────────────────────────────────────

function renderSpellResults(errors, container, summary) {
  if (errors.length === 0) {
    container.innerHTML = '<div style="text-align:center;padding:32px;color:var(--ink-muted)">✅ ไม่พบข้อผิดพลาด</div>';
    return;
  }
  // group by type
  const byType = {};
  errors.forEach(e => { (byType[e.type||'อื่นๆ'] = byType[e.type||'อื่นๆ']||[]).push(e); });

  let html = '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px">';
  for (const [t, items] of Object.entries(byType)) {
    const c = scColor(t);
    html += `<span style="background:${c}22;border:1px solid ${c}55;border-radius:20px;padding:3px 10px;font-size:11px;color:${c};font-weight:600">${t} (${items.length})</span>`;
  }
  html += '</div>';

  html += '<table style="width:100%;border-collapse:collapse;font-size:13px">';
  html += '<thead><tr style="border-bottom:2px solid var(--border);color:var(--ink-muted)">';
  html += '<th style="text-align:left;padding:6px 8px;font-weight:600">คำผิด</th>';
  html += '<th style="text-align:left;padding:6px 8px;font-weight:600">คำที่ถูก</th>';
  html += '<th style="text-align:left;padding:6px 8px;font-weight:600">บริบท</th>';
  html += '<th style="text-align:left;padding:6px 8px;font-weight:600">ประเภท</th>';
  html += '</tr></thead><tbody>';

  errors.forEach((e, i) => {
    const c = scColor(e.type);
    const bg = i % 2 === 0 ? '' : 'background:var(--panel-bg)';
    html += `<tr style="border-bottom:1px solid var(--border);${bg}">`;
    html += `<td style="padding:8px;color:#dc2626;text-decoration:line-through;font-weight:600">${e.wrong||''}</td>`;
    html += `<td style="padding:8px;color:#16a34a;font-weight:600">${e.correct||''}</td>`;
    html += `<td style="padding:8px;color:var(--ink-muted);font-size:12px;max-width:220px">${e.context||''}</td>`;
    html += `<td style="padding:8px"><span style="background:${c}22;border:1px solid ${c}44;border-radius:4px;padding:2px 7px;font-size:11px;color:${c}">${e.type||''}</span></td>`;
    html += '</tr>';
  });

  html += '</tbody></table>';
  container.innerHTML = html;
}

// ── NovelForge V3 Mode Tab Handler ──
function switchModeTab(mode, btn) {
  // Update button styles
  ['modeBtnWriting','modeBtnBook','modeBtnKindle','modeBtnPrint'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.borderColor = '#2e2b28';
    el.style.background = 'transparent';
    el.style.color = '#6b6560';
  });
  if (btn) {
    btn.style.borderColor = 'var(--accent)';
    btn.style.background = 'rgba(139,69,19,0.2)';
    btn.style.color = '#e8a87c';
  }
  // For now just a visual indicator — full mode switching requires more logic
  if (mode === 'book') {
    setViewMode('spread', document.getElementById('vbSpread'));
  } else if (mode === 'kindle') {
    // Kindle = single page scroll
    setViewMode('scroll', document.getElementById('vbScroll'));
  } else if (mode === 'print') {
    setViewMode('single', document.getElementById('vbSingle'));
  } else {
    setViewMode('single', document.getElementById('vbSingle'));
  }
  showToast('📖 ' + (btn ? btn.textContent.trim() : mode));
}

// ── V3 Statusbar sync ──
(function patchUpdateStats() {
  const _orig = typeof updateStats === 'function' ? updateStats : null;
  function syncStatusBar() {
    const wordsEl = document.getElementById('statWords');
    const charsEl = document.getElementById('statChars');
    const pageEl = document.getElementById('statPage');
    if (wordsEl) wordsEl.textContent = document.getElementById('wordCount')?.textContent || '0';
    if (charsEl) charsEl.textContent = document.getElementById('charCount')?.textContent || '0';
    if (pageEl) {
      const nav = document.getElementById('navInfo');
      if (nav) pageEl.textContent = nav.textContent.replace('หน้า ', '');
    }
  }
  // Patch via MutationObserver on existing stat elements
  const wordEl = document.getElementById('wordCount');
  const charEl = document.getElementById('charCount');
  if (wordEl || charEl) {
    const obs = new MutationObserver(syncStatusBar);
    if (wordEl) obs.observe(wordEl, {childList:true, characterData:true, subtree:true});
    if (charEl) obs.observe(charEl, {childList:true, characterData:true, subtree:true});
  }
  // Also sync on page nav changes
  const navEl = document.getElementById('navInfo');
  if (navEl) {
    const obs2 = new MutationObserver(syncStatusBar);
    obs2.observe(navEl, {childList:true, characterData:true, subtree:true});
  }
  // Initial sync
  setTimeout(syncStatusBar, 1500);
})();
