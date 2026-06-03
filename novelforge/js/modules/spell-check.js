
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
