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

