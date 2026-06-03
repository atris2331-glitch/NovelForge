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

