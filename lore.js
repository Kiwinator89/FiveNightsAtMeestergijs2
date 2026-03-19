// ── LORE.JS — nacht 1 intro sequentie ────────────────────

const loreLines = [
  'Met deze deal is er eindelijk genoeg geld om de school uit te breiden.',
  'Ik word hiermee eigenaar van de beroemdste school aller tijden!',
  'Ik moest alleen wel wat nieuwe docenten aannemen.',
  'Maar wat is het ergste dat er kan gebeuren?',
];

let loreIndex   = 0;
let typing      = false;
let typeTimeout = null;

const loreScreen   = document.getElementById('loreScreen');
const loreTextEl   = document.getElementById('loreText');
const loreContinue = document.getElementById('loreContinue');
const fadeOverlay  = document.getElementById('fadeOverlay');
const menuMusic    = document.getElementById('menuMusic');
const clickSound   = document.getElementById('clickSound');
const intermission = document.getElementById('intermissionAudio');

// ── TYPEWRITER ────────────────────────────────────────────
function typeLine(text, onDone) {
  typing = true;
  loreContinue.classList.remove('visible');

  // bouw cursor element
  const cursor = document.createElement('span');
  cursor.className = 'lore-cursor';

  loreTextEl.textContent = '';
  loreTextEl.appendChild(cursor);

  let i = 0;

  function typeChar() {
    if (i < text.length) {
      loreTextEl.insertBefore(document.createTextNode(text[i]), cursor);
      i++;
      typeTimeout = setTimeout(typeChar, 36 + Math.random() * 26);
    } else {
      typing = false;
      cursor.classList.add('hidden');
      loreContinue.classList.add('visible');
      if (onDone) onDone();
    }
  }

  typeChar();
}

// ── VOLGENDE REGEL OF SKIP ────────────────────────────────
function advanceLore() {
  if (typing) {
    // skip: zet volledige tekst direct neer
    clearTimeout(typeTimeout);
    typing = false;

    const text   = loreLines[loreIndex];
    const cursor = loreTextEl.querySelector('.lore-cursor');

    loreTextEl.textContent = text;
    loreContinue.classList.add('visible');
    return;
  }

  loreIndex++;

  if (loreIndex < loreLines.length) {
    typeLine(loreLines[loreIndex]);
  } else {
    // alle regels voorbij → nacht 1
    loreScreen.removeEventListener('click', advanceLore);
    goToNight1();
  }
}

// ── START LORE SEQUENTIE ──────────────────────────────────
function startLore() {
  fadeAudio(menuMusic, 0, 600, () => {
    menuMusic.pause();
    menuMusic.currentTime = 0;
  });

  fadeOverlay.classList.add('active');

  setTimeout(() => {
    loreScreen.classList.add('active');
    fadeOverlay.classList.remove('active');

    intermission.currentTime = 0;
    intermission.play().catch(() => {});

    loreIndex = 0;
    typeLine(loreLines[0]);
    loreScreen.addEventListener('click', advanceLore);
  }, 520);
}

// ── NAAR NACHT 1 ──────────────────────────────────────────
function goToNight1() {
  fadeOverlay.classList.add('active');
  setTimeout(() => {
    fadeAudio(intermission, 0, 400, () => { intermission.pause(); });
    window.location.href = 'night1.html';
  }, 520);
}

// ── UTIL: AUDIO FADE ─────────────────────────────────────
function fadeAudio(audioEl, targetVol, duration, onDone) {
  const startVol = audioEl.volume;
  const steps    = 20;
  const stepTime = duration / steps;
  const delta    = (targetVol - startVol) / steps;
  let   s        = 0;

  const iv = setInterval(() => {
    s++;
    audioEl.volume = Math.max(0, Math.min(1, audioEl.volume + delta));
    if (s >= steps) {
      clearInterval(iv);
      audioEl.volume = targetVol;
      if (onDone) onDone();
    }
  }, stepTime);
}

// ── ENDURE KNOP ───────────────────────────────────────────
document.getElementById('btnEndure').addEventListener('click', () => {
  clickSound.currentTime = 0;
  clickSound.play().catch(() => {});
  setTimeout(startLore, 180);
});
