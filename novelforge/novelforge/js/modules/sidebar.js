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
