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

