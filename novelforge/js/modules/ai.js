
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

