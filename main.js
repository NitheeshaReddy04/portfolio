/* ============================================================
   NITHEESHA PORTFOLIO — COSMIC GALAXY EDITION
   Nebula BG · Constellation · Cosmic Orb · Custom Cursor
   Scroll Reveals · Skill Bars · Card Glows · Magnetic Btns
   ============================================================ */
'use strict';

const qs  = (s, c = document) => c.querySelector(s);
const qsa = (s, c = document) => [...c.querySelectorAll(s)];
const rm  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Page fade in */
document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.6s ease';
window.addEventListener('load', () => requestAnimationFrame(() => { document.body.style.opacity = '1'; }));

/* ============================================================
   1. NEBULA BACKGROUND — subtle fixed atmospheric layer
   ============================================================ */
(function initNebula() {
  const cvs = qs('#nebula-bg');
  if (!cvs) return;
  cvs.width  = window.innerWidth;
  cvs.height = window.innerHeight;
  const ctx = cvs.getContext('2d');

  function paintNebula() {
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    // Cosmic purple nebula cloud — top-left
    const g1 = ctx.createRadialGradient(
      cvs.width * 0.15, cvs.height * 0.25, 0,
      cvs.width * 0.15, cvs.height * 0.25, cvs.width * 0.42
    );
    g1.addColorStop(0,   'rgba(76,29,149,0.28)');
    g1.addColorStop(0.4, 'rgba(49,10,120,0.14)');
    g1.addColorStop(1,   'transparent');
    ctx.fillStyle = g1; ctx.fillRect(0, 0, cvs.width, cvs.height);

    // Blue nebula cloud — right center
    const g2 = ctx.createRadialGradient(
      cvs.width * 0.88, cvs.height * 0.55, 0,
      cvs.width * 0.88, cvs.height * 0.55, cvs.width * 0.38
    );
    g2.addColorStop(0,   'rgba(30,58,138,0.22)');
    g2.addColorStop(0.5, 'rgba(15,23,82,0.12)');
    g2.addColorStop(1,   'transparent');
    ctx.fillStyle = g2; ctx.fillRect(0, 0, cvs.width, cvs.height);

    // Pink accent nebula — bottom center
    const g3 = ctx.createRadialGradient(
      cvs.width * 0.5, cvs.height * 0.88, 0,
      cvs.width * 0.5, cvs.height * 0.88, cvs.width * 0.32
    );
    g3.addColorStop(0,   'rgba(126,34,206,0.18)');
    g3.addColorStop(0.5, 'rgba(88,28,135,0.08)');
    g3.addColorStop(1,   'transparent');
    ctx.fillStyle = g3; ctx.fillRect(0, 0, cvs.width, cvs.height);
  }

  paintNebula();
  window.addEventListener('resize', () => {
    cvs.width = window.innerWidth; cvs.height = window.innerHeight; paintNebula();
  });
})();

/* ============================================================
   2. COSMIC CURSOR + PARTICLE TRAIL
   ============================================================ */
(function initCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const dot   = qs('#cursor-dot');
  const ring  = qs('#cursor-ring');
  const trail = qs('#cursor-trail');
  if (!dot || !ring || !trail) return;

  const ctx = trail.getContext('2d');
  trail.width = window.innerWidth; trail.height = window.innerHeight;
  window.addEventListener('resize', () => { trail.width = window.innerWidth; trail.height = window.innerHeight; });

  // Cosmic particle colors
  const COLS = ['#a78bfa','#38bdf8','#f472b6','#e2e8ff','#22d3ee'];
  const particles = [];
  let mouse = { x: -300, y: -300 };
  let ringX = -300, ringY = -300;

  document.addEventListener('mousemove', e => {
    mouse.x = e.clientX; mouse.y = e.clientY;
    dot.style.left = mouse.x + 'px';
    dot.style.top  = mouse.y + 'px';
    if (!rm && Math.random() < 0.4) {
      particles.push({
        x: mouse.x, y: mouse.y,
        vx: (Math.random() - 0.5) * 2.2,
        vy: -(Math.random() * 2.4 + 0.4),
        r:   Math.random() * 2.2 + 0.6,
        life: 1,
        decay: 0.035 + Math.random() * 0.025,
        color: COLS[Math.floor(Math.random() * COLS.length)],
        spin: Math.random() * Math.PI * 2,
      });
    }
  });

  const hoverSel = 'a,button,.magnetic,.project-card,.skill-card,.about-card,.contact-link,.achievement-card,.timeline-card';
  document.addEventListener('mouseover', e => { if (e.target.closest(hoverSel)) ring.classList.add('hover'); });
  document.addEventListener('mouseout',  e => { if (e.target.closest(hoverSel)) ring.classList.remove('hover'); });

  (function tick() {
    // Laggy ring
    ringX += (mouse.x - ringX) * 0.11;
    ringY += (mouse.y - ringY) * 0.11;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';

    // Trail canvas
    ctx.clearRect(0, 0, trail.width, trail.height);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy; p.vy += 0.05;
      p.life -= p.decay; p.spin += 0.12;
      if (p.life <= 0) { particles.splice(i, 1); continue; }

      ctx.save();
      ctx.globalAlpha = p.life * 0.75;
      ctx.translate(p.x, p.y); ctx.rotate(p.spin);
      // Cosmic cross-star shape
      ctx.beginPath();
      const r = p.r;
      ctx.moveTo(0, -r * 2.8); ctx.lineTo(r * 0.65, -r * 0.65);
      ctx.lineTo(r * 2.8, 0);  ctx.lineTo(r * 0.65,  r * 0.65);
      ctx.lineTo(0,  r * 2.8); ctx.lineTo(-r * 0.65,  r * 0.65);
      ctx.lineTo(-r * 2.8, 0); ctx.lineTo(-r * 0.65, -r * 0.65);
      ctx.closePath();
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color; ctx.shadowBlur = 10;
      ctx.fill();
      ctx.restore();
    }
    requestAnimationFrame(tick);
  })();
})();

/* ============================================================
   3. CONSTELLATION — 38 stars, cosmic palette, twinkling
   ============================================================ */
(function initConstellation() {
  const cvs = qs('#constellation');
  if (!cvs) return;
  const ctx = cvs.getContext('2d');

  // Cosmic star palette — mostly blues/purples, pink/lavender accents
  const PALETTE = [
    { r:167, g:139, b:250 },  // lavender   (dominant)
    { r: 56, g:189, b:248 },  // cosmic blue (dominant)
    { r:226, g:232, b:255 },  // starlight white
    { r:244, g:114, b:182 },  // pink accent
    { r: 34, g:211, b:238 },  // nebula teal
    { r:196, g:181, b:253 },  // soft violet
    { r:251, g:191, b: 36 },  // gold star (rare)
  ];
  // Weighted: blues+purples more likely
  const WPAL = [
    ...Array(5).fill(PALETTE[0]),
    ...Array(5).fill(PALETTE[1]),
    ...Array(4).fill(PALETTE[2]),
    ...Array(2).fill(PALETTE[3]),
    ...Array(2).fill(PALETTE[4]),
    ...Array(2).fill(PALETTE[5]),
    ...Array(1).fill(PALETTE[6]),
  ];

  const STAR_COUNT   = 38;
  const CONNECT_DIST = 210;
  const DRIFT        = 0.2;

  let W, H, stars, animId;
  let nActive = false, nTimer = 0, nPhase = 'idle';
  const N_FORM = 250, N_HOLD = 100, N_RET = 130;

  function makeStar() {
    const c = WPAL[Math.floor(Math.random() * WPAL.length)];
    const pad = 80;
    return {
      x: pad + Math.random() * (W - pad * 2),
      y: pad + Math.random() * (H - pad * 2),
      ox: 0, oy: 0, tx: 0, ty: 0,
      vx: (Math.random() - 0.5) * DRIFT,
      vy: (Math.random() - 0.5) * DRIFT,
      r:  Math.random() * 1.8 + 0.7,
      alpha: Math.random() * 0.4 + 0.5,          // brighter: 0.5–0.9
      twinkle:      Math.random() * Math.PI * 2,
      twinkleSpeed: 0.018 + Math.random() * 0.03, // variable speed
      twinkleAmp:   0.25 + Math.random() * 0.5,   // variable depth
      color: c,
      inN: false,
      lineFade: Math.random() * Math.PI * 2,
      lineFadeSpd: 0.006 + Math.random() * 0.01,
    };
  }

  function getNPoints(cx, cy, sz) {
    return [
      { x: cx - sz*.32, y: cy + sz*.52 },
      { x: cx - sz*.32, y: cy + sz*.20 },
      { x: cx - sz*.32, y: cy - sz*.10 },
      { x: cx - sz*.32, y: cy - sz*.52 },
      { x: cx - sz*.16, y: cy - sz*.30 },
      { x: cx,           y: cy - sz*.05 },
      { x: cx + sz*.16, y: cy + sz*.20 },
      { x: cx + sz*.32, y: cy + sz*.48 },
      { x: cx + sz*.32, y: cy + sz*.16 },
      { x: cx + sz*.32, y: cy - sz*.18 },
      { x: cx + sz*.32, y: cy - sz*.52 },
    ];
  }

  function setup() {
    W = cvs.width  = cvs.offsetWidth;
    H = cvs.height = cvs.offsetHeight;
    stars = Array.from({ length: STAR_COUNT }, () => {
      const s = makeStar(); s.ox = s.x; s.oy = s.y; return s;
    });
    if (!rm) setTimeout(triggerN, 3200);
  }

  function triggerN() {
    const pts = getNPoints(W * .5, H * .44, Math.min(W, H) * .2);
    const n = Math.min(pts.length, stars.length);
    for (let i = 0; i < n; i++) {
      stars[i].tx = pts[i].x; stars[i].ty = pts[i].y; stars[i].inN = true;
    }
    nPhase = 'forming'; nTimer = 0; nActive = true;
  }

  // Name sparkles on constellation canvas
  const nspk = [];
  function spawnNSpk() {
    const el = qs('#heroName'); if (!el) return;
    const er = el.getBoundingClientRect();
    const cr = cvs.getBoundingClientRect();
    const colors = ['#a78bfa','#38bdf8','#f472b6','#e2e8ff','#22d3ee'];
    nspk.push({
      x: (er.left - cr.left) + Math.random() * er.width,
      y: (er.top  - cr.top)  + Math.random() * er.height,
      vx: (Math.random() - .5) * 1.6,
      vy: -(Math.random() * 1.8 + .6),
      life: 1, decay: .022 + Math.random() * .014,
      r: Math.random() * 1.8 + .7,
      color: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * Math.PI,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Move stars
    stars.forEach(s => {
      if (nActive && s.inN) {
        const tx = nPhase === 'returning' ? s.ox : s.tx;
        const ty = nPhase === 'returning' ? s.oy : s.ty;
        s.x += (tx - s.x) * .04; s.y += (ty - s.y) * .04;
      } else {
        s.x += s.vx; s.y += s.vy;
        if (s.x < -10) s.x = W + 10; if (s.x > W + 10) s.x = -10;
        if (s.y < -10) s.y = H + 10; if (s.y > H + 10) s.y = -10;
      }
      s.twinkle += s.twinkleSpeed;
      s.lineFade += s.lineFadeSpd;
    });

    // N timer
    if (nActive) {
      nTimer++;
      if      (nPhase === 'forming'   && nTimer > N_FORM) { nPhase = 'holding';   nTimer = 0; }
      else if (nPhase === 'holding'   && nTimer > N_HOLD) { nPhase = 'returning'; nTimer = 0; }
      else if (nPhase === 'returning' && nTimer > N_RET)  {
        nActive = false; stars.forEach(s => { s.inN = false; }); nPhase = 'idle';
      }
    }

    // Connection lines with per-line fade breathing
    for (let i = 0; i < stars.length; i++) {
      for (let j = i + 1; j < stars.length; j++) {
        const dist = Math.hypot(stars[i].x - stars[j].x, stars[i].y - stars[j].y);
        if (dist >= CONNECT_DIST) continue;
        const bothInN = nActive && stars[i].inN && stars[j].inN;
        const prox = 1 - dist / CONNECT_DIST;
        const fade = 0.5 + 0.5 * Math.sin(stars[i].lineFade);
        const op   = prox * (bothInN ? 0.55 : 0.2) * fade;

        // Use a gradient line: lavender → cosmic-blue
        const lg = ctx.createLinearGradient(stars[i].x, stars[i].y, stars[j].x, stars[j].y);
        if (bothInN) {
          lg.addColorStop(0, `rgba(167,139,250,${op})`);
          lg.addColorStop(1, `rgba(244,114,182,${op})`);
        } else {
          lg.addColorStop(0, `rgba(167,139,250,${op})`);
          lg.addColorStop(1, `rgba(56,189,248,${op * .7})`);
        }
        ctx.beginPath();
        ctx.moveTo(stars[i].x, stars[i].y);
        ctx.lineTo(stars[j].x, stars[j].y);
        ctx.strokeStyle = lg;
        ctx.lineWidth = bothInN ? 1.2 : 0.55;
        ctx.stroke();
      }
    }

    // Stars with radial glow halo + core
    stars.forEach(s => {
      const tw = 1 - s.twinkleAmp + s.twinkleAmp * Math.sin(s.twinkle);
      const a  = Math.min(s.alpha * tw, 0.92);
      const r  = s.r * (nActive && s.inN ? 1.8 : 1);
      const glowR = r * 7;

      const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, glowR);
      g.addColorStop(0,   `rgba(${s.color.r},${s.color.g},${s.color.b},${a * .55})`);
      g.addColorStop(0.3, `rgba(${s.color.r},${s.color.g},${s.color.b},${a * .18})`);
      g.addColorStop(1,   `rgba(${s.color.r},${s.color.g},${s.color.b},0)`);
      ctx.beginPath(); ctx.arc(s.x, s.y, glowR, 0, Math.PI * 2);
      ctx.fillStyle = g; ctx.fill();

      // Core dot
      ctx.beginPath(); ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${s.color.r},${s.color.g},${s.color.b},${Math.min(a * 1.7, 0.92)})`;
      ctx.fill();

      // Bright stars: tiny cross spike
      if (s.r > 1.7 && a > 0.6) {
        const sp = r * 3.5;
        ctx.beginPath();
        ctx.moveTo(s.x - sp, s.y); ctx.lineTo(s.x + sp, s.y);
        ctx.moveTo(s.x, s.y - sp); ctx.lineTo(s.x, s.y + sp);
        ctx.strokeStyle = `rgba(${s.color.r},${s.color.g},${s.color.b},${a * .35})`;
        ctx.lineWidth = .6;
        ctx.stroke();
      }
    });

    // Name sparkles
    for (let i = nspk.length - 1; i >= 0; i--) {
      const p = nspk[i];
      p.x += p.vx; p.y += p.vy; p.vy += .03; p.life -= p.decay;
      if (p.life <= 0) { nspk.splice(i, 1); continue; }
      ctx.save();
      ctx.globalAlpha = p.life * .75;
      ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      // 4-point star
      const r = p.r;
      ctx.beginPath();
      ctx.moveTo(0, -r*2.6); ctx.lineTo(r*.7, -r*.7);
      ctx.lineTo(r*2.6, 0);  ctx.lineTo(r*.7,  r*.7);
      ctx.lineTo(0,  r*2.6); ctx.lineTo(-r*.7,  r*.7);
      ctx.lineTo(-r*2.6, 0); ctx.lineTo(-r*.7, -r*.7);
      ctx.closePath();
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color; ctx.shadowBlur = 8;
      ctx.fill();
      ctx.restore();
    }

    animId = requestAnimationFrame(draw);
  }

  setup(); draw();

  if (!rm) {
    setTimeout(() => {
      const iv = setInterval(spawnNSpk, 280);
      setTimeout(() => clearInterval(iv), 5500);
    }, 1700);
  }

  let rt;
  window.addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(() => { cancelAnimationFrame(animId); setup(); draw(); }, 200);
  });
})();

/* ============================================================
   4. COSMIC ORB — rotating galaxy energy core with rings
   ============================================================ */
(function initCosmicOrb() {
  const cvs = qs('#cosmicOrb');
  if (!cvs) return;
  const ctx = cvs.getContext('2d');
  const S = 380;
  cvs.width = S; cvs.height = S;
  const CX = S / 2, CY = S / 2;

  let rotY = 0, rotX = 0.28;
  let mouseOX = 0, mouseOY = 0;
  let targetOX = 0, targetOY = 0;

  const hero = qs('#hero');
  if (hero) {
    hero.addEventListener('mousemove', e => {
      const r = hero.getBoundingClientRect();
      targetOX = ((e.clientX - r.left) / r.width  - .5) * .35;
      targetOY = ((e.clientY - r.top)  / r.height - .5) * .35;
    });
    hero.addEventListener('mouseleave', () => { targetOX = 0; targetOY = 0; });
  }

  // ── Icosahedron approximation via sphere points ──────────── //
  // Use a geodesic-like structure: 12 vertices of icosahedron + 1 center
  const φ = (1 + Math.sqrt(5)) / 2;
  const R = 82;
  const rawV = [
    [ 0,  1,  φ], [ 0, -1,  φ], [ 0,  1, -φ], [ 0, -1, -φ],
    [ 1,  φ,  0], [-1,  φ,  0], [ 1, -φ,  0], [-1, -φ,  0],
    [ φ,  0,  1], [-φ,  0,  1], [ φ,  0, -1], [-φ,  0, -1],
  ];
  const len = Math.sqrt(1 + φ * φ);
  const VERTS = rawV.map(([x, y, z]) => [x / len * R, y / len * R, z / len * R]);

  // Edges: connect vertices within threshold distance
  const EDGE_THRESH = R * 1.22;
  const EDGES = [];
  for (let i = 0; i < VERTS.length; i++)
    for (let j = i + 1; j < VERTS.length; j++) {
      const d = Math.hypot(...VERTS[i].map((v, k) => v - VERTS[j][k]));
      if (d < EDGE_THRESH) EDGES.push([i, j]);
    }

  // Ring params (3 orbital rings at different tilts)
  const RINGS = [
    { rx: 0.5,  ry: 0.0,  rz: 0,   color: '#a78bfa', r: 108, w: 1.8, op: 0.55, speed:  1.0 },
    { rx: 1.1,  ry: 0.4,  rz: 0.8, color: '#38bdf8', r: 122, w: 1.2, op: 0.40, speed: -0.7 },
    { rx: 0.2,  ry: 0.9,  rz: 0.5, color: '#f472b6', r: 96,  w: 1.0, op: 0.32, speed:  1.3 },
  ];

  // Rotation helpers
  function rotY3(v, a) {
    const [x, y, z] = v, c = Math.cos(a), s = Math.sin(a);
    return [x * c + z * s, y, -x * s + z * c];
  }
  function rotX3(v, a) {
    const [x, y, z] = v, c = Math.cos(a), s = Math.sin(a);
    return [x, y * c - z * s, y * s + z * c];
  }
  function proj(v) {
    const fov = 420, z = v[2] + 380;
    return [CX + (v[0] * fov) / z, CY + (v[1] * fov) / z, z];
  }

  // Draw a ring as ellipse in 3D
  function drawRing(ring, angle) {
    const segments = 64;
    const pts = [];
    for (let i = 0; i <= segments; i++) {
      const a = (i / segments) * Math.PI * 2 + angle * ring.speed;
      let v = [Math.cos(a) * ring.r, Math.sin(a) * ring.r, 0];
      v = rotX3(v, ring.rx); v = rotX3(v, mouseOY);
      v = rotY3(v, ring.ry + rotY + mouseOX);
      const [px, py] = proj(v);
      pts.push([px, py]);
    }
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.closePath();
    ctx.strokeStyle = ring.color;
    ctx.globalAlpha = ring.op;
    ctx.lineWidth = ring.w;
    ctx.shadowColor = ring.color;
    ctx.shadowBlur = 14;
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  }

  let angle = 0;
  function draw() {
    if (!rm) {
      rotY += 0.009;
      mouseOX += (targetOX - mouseOX) * 0.05;
      mouseOY += (targetOY - mouseOY) * 0.05;
      angle += 0.008;
    }

    ctx.clearRect(0, 0, S, S);

    const rX = rotX + mouseOY;
    const rY = rotY + mouseOX;

    // 1. Outer corona glow
    const corona = ctx.createRadialGradient(CX, CY, 55, CX, CY, 160);
    corona.addColorStop(0,   'rgba(167,139,250,0.22)');
    corona.addColorStop(0.35,'rgba(56,189,248,0.12)');
    corona.addColorStop(0.7, 'rgba(244,114,182,0.06)');
    corona.addColorStop(1,   'transparent');
    ctx.beginPath(); ctx.arc(CX, CY, 160, 0, Math.PI * 2);
    ctx.fillStyle = corona; ctx.fill();

    // 2. Transform icosahedron vertices
    const v3d = VERTS.map(v => rotX3(rotY3(v, rY), rX));
    const v2d = v3d.map(proj);

    // 3. Back edges (z < average, behind sphere)
    ctx.lineWidth = 0.7;
    EDGES.forEach(([a, b]) => {
      const za = v3d[a][2], zb = v3d[b][2];
      if (za > 0 && zb > 0) return; // front face, skip here
      const [x0,y0] = v2d[a], [x1,y1] = v2d[b];
      const lg = ctx.createLinearGradient(x0, y0, x1, y1);
      lg.addColorStop(0, 'rgba(167,139,250,0.18)');
      lg.addColorStop(1, 'rgba(56,189,248,0.12)');
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1);
      ctx.strokeStyle = lg; ctx.globalAlpha = 0.5;
      ctx.stroke(); ctx.globalAlpha = 1;
    });

    // 4. Central sphere — layered glass look
    const sphereGrad = ctx.createRadialGradient(CX - 22, CY - 22, 4, CX, CY, 72);
    sphereGrad.addColorStop(0,   'rgba(255,255,255,0.22)');
    sphereGrad.addColorStop(0.2, 'rgba(167,139,250,0.30)');
    sphereGrad.addColorStop(0.5, 'rgba(56,189,248,0.18)');
    sphereGrad.addColorStop(0.8, 'rgba(244,114,182,0.14)');
    sphereGrad.addColorStop(1,   'rgba(13,10,36,0.55)');
    ctx.beginPath(); ctx.arc(CX, CY, 72, 0, Math.PI * 2);
    ctx.fillStyle = sphereGrad; ctx.fill();

    // Inner nebula swirl
    const swirl = ctx.createRadialGradient(CX + 18, CY + 10, 0, CX, CY, 68);
    swirl.addColorStop(0,   `rgba(34,211,238,${0.15 + 0.08 * Math.sin(angle * 1.5)})`);
    swirl.addColorStop(0.45,`rgba(167,139,250,${0.12 + 0.06 * Math.sin(angle)})`);
    swirl.addColorStop(1,   'transparent');
    ctx.beginPath(); ctx.arc(CX, CY, 68, 0, Math.PI * 2);
    ctx.fillStyle = swirl; ctx.fill();

    // 5. Orbital rings
    RINGS.forEach(r => drawRing(r, angle));

    // 6. Front edges
    EDGES.forEach(([a, b]) => {
      const za = v3d[a][2], zb = v3d[b][2];
      if (za <= 0 && zb <= 0) return;
      const depth = (v3d[a][2] + v3d[b][2]) / 2 / R;
      const alpha = 0.3 + depth * 0.45;
      const [x0,y0] = v2d[a], [x1,y1] = v2d[b];
      const lg = ctx.createLinearGradient(x0, y0, x1, y1);
      lg.addColorStop(0, `rgba(167,139,250,${alpha})`);
      lg.addColorStop(1, `rgba(56,189,248,${alpha * .7})`);
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1);
      ctx.strokeStyle = lg; ctx.lineWidth = 1.0;
      ctx.shadowColor = '#a78bfa'; ctx.shadowBlur = 8;
      ctx.stroke(); ctx.shadowBlur = 0;
    });

    // 7. Vertex dots (front visible nodes)
    v2d.forEach(([x, y], i) => {
      const z = v3d[i][2];
      if (z < -20) return;
      const bright = 0.4 + (z + R) / (R * 2) * 0.6;
      const dotR = 1.8 + bright * 1.8;
      const gc = ctx.createRadialGradient(x, y, 0, x, y, dotR * 4);
      gc.addColorStop(0,   `rgba(226,232,255,${bright * .9})`);
      gc.addColorStop(0.4, `rgba(167,139,250,${bright * .4})`);
      gc.addColorStop(1,   'transparent');
      ctx.beginPath(); ctx.arc(x, y, dotR * 4, 0, Math.PI * 2);
      ctx.fillStyle = gc; ctx.fill();
      ctx.beginPath(); ctx.arc(x, y, dotR, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(226,232,255,${bright})`;
      ctx.fill();
    });

    // 8. Specular highlight
    const spec = ctx.createRadialGradient(CX - 24, CY - 28, 0, CX - 24, CY - 28, 32);
    spec.addColorStop(0,   'rgba(255,255,255,0.28)');
    spec.addColorStop(1,   'transparent');
    ctx.beginPath(); ctx.arc(CX - 24, CY - 28, 32, 0, Math.PI * 2);
    ctx.fillStyle = spec; ctx.fill();

    requestAnimationFrame(draw);
  }

  draw();
})();

/* ============================================================
   5. NAVIGATION
   ============================================================ */
(function initNav() {
  const navbar = qs('#navbar');
  const toggle = qs('#navToggle');
  const menu   = qs('#navMenu');
  const links  = qsa('.nav-link');

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 20);
    let current = '';
    qsa('section[id]').forEach(s => { if (s.offsetTop - 110 <= y) current = s.id; });
    links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${current}`));
  }, { passive: true });

  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });
  links.forEach(l => l.addEventListener('click', () => {
    menu.classList.remove('open'); toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }));
})();

/* ============================================================
   6. SCROLL REVEAL
   ============================================================ */
(function initReveal() {
  const els = qsa('.reveal-up,.reveal-left,.reveal-right');
  if (!els.length) return;
  if (rm) { els.forEach(e => e.classList.add('revealed')); return; }
  const io = new IntersectionObserver(entries =>
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); io.unobserve(e.target); } }),
    { threshold: 0.1 }
  );
  els.forEach(e => io.observe(e));
})();

/* ============================================================
   7. SKILL BARS
   ============================================================ */
(function initSkillBars() {
  const bars = qsa('.skill-fill');
  if (!bars.length) return;
  const io = new IntersectionObserver(entries =>
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.style.width = `${e.target.dataset.width || 0}%`; io.unobserve(e.target); }
    }), { threshold: 0.3 }
  );
  bars.forEach(b => io.observe(b));
})();

/* ============================================================
   8. PROJECT CARD GLOW (cursor-tracking)
   ============================================================ */
(function initCardGlow() {
  qsa('.project-card').forEach(c => {
    c.addEventListener('mousemove', e => {
      const r = c.getBoundingClientRect();
      c.style.setProperty('--mouse-x', `${((e.clientX - r.left) / r.width)  * 100}%`);
      c.style.setProperty('--mouse-y', `${((e.clientY - r.top)  / r.height) * 100}%`);
    });
  });
})();

/* ============================================================
   9. MAGNETIC BUTTONS
   ============================================================ */
(function initMagnetic() {
  if (rm) return;
  qsa('.magnetic').forEach(b => {
    b.addEventListener('mousemove', e => {
      const r = b.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width  / 2)) * 0.30;
      const dy = (e.clientY - (r.top  + r.height / 2)) * 0.30;
      b.style.transform = `translate(${dx}px,${dy}px)`;
    });
    b.addEventListener('mouseleave', () => { b.style.transform = ''; });
  });
})();

/* ============================================================
   10. CONTACT FORM
   ============================================================ */
(function initForm() {
  const form = qs('#contactForm'), ok = qs('#formSuccess');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Sending…';
    setTimeout(() => {
      form.reset(); btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      ok.hidden = false;
      setTimeout(() => { ok.hidden = true; }, 5000);
    }, 1200);
  });
})();

/* Initial scroll event */
window.dispatchEvent(new Event('scroll'));
