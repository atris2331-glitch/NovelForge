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
