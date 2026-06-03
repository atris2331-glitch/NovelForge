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

