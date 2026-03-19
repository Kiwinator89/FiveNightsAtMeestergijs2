// ── START OVERLAY ────────────────────────────────────────
document.getElementById('startOverlay').addEventListener('click', function() {
  this.style.display = 'none';
  document.getElementById('menuMusic').play().catch(() => {});
});

// ── STATIC NOISE ─────────────────────────────────────────
const canvas = document.getElementById('static');
const ctx    = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function drawStatic() {
  const w = canvas.width, h = canvas.height;
  const imageData = ctx.createImageData(w, h);
  const d = imageData.data;
  for (let i = 0; i < d.length; i += 4) {
    const v = Math.random() > 0.5 ? 255 : 0;
    d[i] = d[i+1] = d[i+2] = v;
    d[i+3] = 255;
  }
  ctx.putImageData(imageData, 0, 0);
  requestAnimationFrame(drawStatic);
}
drawStatic();

// ── TITLE GLITCH ─────────────────────────────────────────
const img    = document.getElementById('titleImg');
const ghostR = document.getElementById('ghostRed');
const ghostC = document.getElementById('ghostCyan');
const titleGlitches = ['scale','scale','scale','vanish','rotate','red','chromatic','skew','shake','chromatic','red'];

function clearGhosts() {
  ghostR.style.opacity = '0'; ghostR.style.transform = '';
  ghostC.style.opacity = '0'; ghostC.style.transform = '';
}

function runTitleGlitch() {
  const type = titleGlitches[Math.floor(Math.random() * titleGlitches.length)];
  const dur  = 80 + Math.random() * 250;
  clearGhosts();

  switch(type) {
    case 'scale': {
      const s1 = 2.2 + Math.random() * 1.0;
      const s2 = 0.15 + Math.random() * 0.15;
      const sk = (Math.random() - .5) * 20;
      img.animate([
        { transform: 'scale(1)',                              offset: 0    },
        { transform: `scale(${s1}) skewX(${sk}deg)`,         offset: 0.15 },
        { transform: `scale(${s2}) skewX(${-sk*0.5}deg)`,    offset: 0.35 },
        { transform: `scale(${s1*0.7}) skewX(0deg)`,         offset: 0.55 },
        { transform: 'scale(3.0) skewY(4deg)',                offset: 0.70 },
        { transform: 'scale(0.08)',                           offset: 0.82 },
        { transform: 'scale(1)',                              offset: 1    },
      ], { duration: dur, easing: 'steps(1)', fill: 'forwards' });
      break;
    }
    case 'vanish':
      img.animate([
        {opacity:1},{opacity:0},{opacity:1},{opacity:0},{opacity:0},{opacity:1},{opacity:0},{opacity:1}
      ], { duration: dur, easing: 'steps(1)' });
      break;
    case 'rotate': {
      const r1 = (Math.random() < 0.5 ? 1 : -1) * (10 + Math.random() * 70);
      const r2 = (Math.random() < 0.5 ? 1 : -1) * (10 + Math.random() * 70);
      img.animate([
        { transform: 'rotate(0deg)' },
        { transform: `rotate(${r1}deg) skewX(${(Math.random()-.5)*12}deg)` },
        { transform: `rotate(${r2}deg) scaleX(1.1)` },
        { transform: 'rotate(0deg)' }
      ], { duration: dur, easing: 'steps(3)' });
      break;
    }
    case 'red':
      img.animate([
        { filter: 'drop-shadow(0 0 20px rgba(255,0,34,0.4)) saturate(1) brightness(1)' },
        { filter: 'drop-shadow(0 0 80px rgba(255,0,34,1)) saturate(12) brightness(3)' },
        { filter: 'drop-shadow(0 0 20px rgba(255,0,34,1)) saturate(6) brightness(1.8) hue-rotate(15deg)' },
        { filter: 'drop-shadow(0 0 80px rgba(255,0,34,1)) saturate(12) brightness(3)' },
        { filter: 'drop-shadow(0 0 20px rgba(255,0,34,0.4)) saturate(1) brightness(1)' }
      ], { duration: dur * 2, easing: 'steps(2)' });
      break;
    case 'chromatic': {
      const offset = 12 + Math.random() * 18;
      ghostR.style.cssText += `;opacity:0.85;transform:translateX(-${offset}px) scaleX(1.05)`;
      ghostC.style.cssText += `;opacity:0.75;transform:translateX(${offset}px) scaleX(1.05)`;
      setTimeout(() => {
        ghostR.style.opacity='0.4'; ghostR.style.transform=`translateX(-${offset*0.3}px)`;
        ghostC.style.opacity='0.3'; ghostC.style.transform=`translateX(${offset*0.3}px)`;
        setTimeout(clearGhosts, dur * 0.3);
      }, dur * 0.5);
      break;
    }
    case 'skew':
      img.animate([
        { transform: 'skewX(0deg) scaleX(1)' },
        { transform: `skewX(${(Math.random()-.5)*30}deg) scaleX(${0.7+Math.random()*0.5})` },
        { transform: `skewX(${(Math.random()-.5)*15}deg) scaleX(1.1)` },
        { transform: 'skewX(0deg) scaleX(1)' }
      ], { duration: dur, easing: 'steps(2)' });
      break;
    case 'shake':
      img.animate(
        Array.from({length:14},(_,i)=>({
          transform: i===13 ? 'translate(0,0)' :
            `translate(${(Math.random()-.5)*40}px,${(Math.random()-.5)*20}px) scale(${0.9+Math.random()*0.3})`
        })),
        { duration: dur, easing: 'steps(1)' }
      );
      break;
  }

  setTimeout(runTitleGlitch, 200 + Math.random() * 700);
}

setTimeout(runTitleGlitch, 600);

// rapid burst chains
(function burst() {
  const count = 2 + Math.floor(Math.random() * 4);
  for (let i = 0; i < count; i++) {
    setTimeout(runTitleGlitch, i * (60 + Math.random() * 80));
  }
  setTimeout(burst, 1500 + Math.random() * 3000);
})();

// ── ENDURE BUTTON GLITCH ──────────────────────────────────
const btnEndure   = document.getElementById('btnEndure');
const btnGlitches = ['g-shake','g-flicker','g-skew','g-red'];

function runBtnGlitch() {
  const cls = btnGlitches[Math.floor(Math.random() * btnGlitches.length)];
  btnEndure.classList.add(cls);
  btnEndure.addEventListener('animationend', () => btnEndure.classList.remove(cls), { once: true });
  setTimeout(runBtnGlitch, 2000 + Math.random() * 4000);
}
setTimeout(runBtnGlitch, 2500);

// ── ESCAPE ────────────────────────────────────────────────
document.getElementById('btnEscape').addEventListener('click', () => {
  window.close();
  window.location.href = 'about:blank';
});
