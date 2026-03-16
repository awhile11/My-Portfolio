// ═══════════════════════════════
//  RADIAL NAV — nav.js
// ═══════════════════════════════

// Dynamically resolve the root of the site regardless of hosting
function getRootPath() {
  const path = window.location.pathname;
  // Count how many directories deep we are
  const parts = path.split('/').filter(p => p.length > 0 && p.includes('.html') === false);
  // If we're in /src/pages/ we need to go up 2 levels
  if (path.includes('/src/pages/')) {
    return '../../';
  }
  return './';
}
const ROOT = getRootPath();

const pages = [
  {
    id: 'about',
    label: 'About Me',
    angle: 270,
    href: `${ROOT}src/pages/about.html`,
    color: '#00f5ff',
    desc: 'Who I am, where I come from, and what drives me.',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>`
  },
  {
    id: 'projects',
    label: 'Projects',
    angle: 330,
    href: `${ROOT}src/pages/projects.html`,
    color: '#f97316',
    desc: 'A showcase of things I\'ve built and shipped.',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>`
  },
  {
    id: 'skills',
    label: 'Skills',
    angle: 30,
    href: `${ROOT}src/pages/skills.html`,
    color: '#a78bfa',
    desc: 'The tools, languages and frameworks I work with.',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`
  },
  {
    id: 'contact',
    label: 'Contact',
    angle: 90,
    href: `${ROOT}src/pages/contact.html`,
    color: '#34d399',
    desc: 'Let\'s talk — I\'m always open to new opportunities.',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`
  },
  {
    id: 'resume',
    label: 'Resume',
    angle: 150,
    href: `${ROOT}src/pages/resume.html`,
    color: '#fbbf24',
    desc: 'My experience, education and achievements.',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><polyline points="9 15 12 18 15 15"/></svg>`
  },
  {
    id: 'cert',
    label: 'Certificates',
    angle: 210,
    href: `${ROOT}src/pages/certificates.html`,
    color: '#f472b6',
    desc: 'Verified credentials and completed courses.',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M9 21l3-3 3 3V14.5a6 6 0 0 1-6 0V21z"/></svg>`
  }
];

// ── BUILD NAV ──
function buildNav() {
  const nav = document.getElementById('navScene');
  if (!nav) return;

  const homeBtn  = document.getElementById('homeBtn');
  const ring     = document.getElementById('ring');
  const panel    = document.getElementById('summaryPanel');
  const closeBtn = document.getElementById('closePanel');
  const rowsWrap = document.getElementById('summaryRows');

  // Dynamic radius based on scene size
  const RADIUS = Math.round(nav.offsetWidth * 0.41) || 130;

  let orbitOpen  = false;
  let panelOpen  = false;
  let closeTimer = null;

  // ── BUILD ORBIT ICONS ──
  const iconEls = pages.map(p => {
    const rad = (p.angle * Math.PI) / 180;
    const tx  = Math.cos(rad) * RADIUS;
    const ty  = Math.sin(rad) * RADIUS;

    const el = document.createElement('div');
    el.className    = 'orbit-icon';
    el.dataset.page = p.id;
    el.title        = p.label;
    el.style.setProperty('--tx', tx + 'px');
    el.style.setProperty('--ty', ty + 'px');
    el.innerHTML = `
      <div class="ico" style="color:${p.color}">${p.icon}</div>
      <div class="lbl">${p.label}</div>`;

    el.addEventListener('mouseenter', () => clearTimeout(closeTimer));
    el.addEventListener('mouseleave', () => { if (!panelOpen) scheduleClose(); });
    // clicking an orbit icon navigates directly to that page
    el.addEventListener('click', () => { window.location.href = p.href; });

    nav.appendChild(el);
    return { el, tx, ty };
  });

  // ── BUILD SUMMARY ROWS (info only — no links) ──
  pages.forEach(p => {
    const row = document.createElement('div');
    row.className = 'summary-row';
    row.innerHTML = `
      <div class="row-icon" style="border-color:${p.color}33">
        <div style="color:${p.color}">${p.icon}</div>
      </div>
      <div class="row-text">
        <div class="row-name">${p.label}</div>
        <div class="row-desc">${p.desc}</div>
      </div>`;
    rowsWrap.appendChild(row);
  });

  // ── ORBIT OPEN / CLOSE ──
  function openOrbit() {
    if (orbitOpen || panelOpen) return;
    orbitOpen = true;
    homeBtn.classList.add('open');
    ring.classList.add('visible');
    iconEls.forEach(({ el, tx, ty }, i) => {
      setTimeout(() => {
        el.style.transitionDelay = `${i * 35}ms`;
        el.style.transform = `translate(${tx}px, ${ty}px) scale(1)`;
        el.classList.add('visible');
      }, 10);
    });
  }

  function closeOrbit() {
    if (!orbitOpen) return;
    orbitOpen = false;
    homeBtn.classList.remove('open');
    ring.classList.remove('visible');
    iconEls.forEach(({ el }, i) => {
      const rev = iconEls.length - 1 - i;
      el.style.transitionDelay = `${rev * 28}ms`;
      el.style.transform = `translate(0, 0) scale(0.2)`;
      el.classList.remove('visible');
    });
  }

  function scheduleClose() {
    clearTimeout(closeTimer);
    closeTimer = setTimeout(closeOrbit, 200);
  }

  // ── PANEL OPEN / CLOSE ──
  function openPanel() {
    panelOpen = true;
    closeOrbit();
    panel.classList.add('visible');
  }

  function closePanel() {
    panelOpen = false;
    panel.classList.remove('visible');
  }

  // ── EVENT LISTENERS ──
  homeBtn.addEventListener('mouseenter', () => {
    if (panelOpen) return;
    clearTimeout(closeTimer);
    openOrbit();
  });
  homeBtn.addEventListener('mouseleave', () => {
    if (panelOpen) return;
    scheduleClose();
  });
  homeBtn.addEventListener('click', () => {
    panelOpen ? closePanel() : openPanel();
  });

  nav.addEventListener('mouseleave', () => {
    if (!panelOpen) scheduleClose();
  });

  closeBtn.addEventListener('click', e => {
    e.stopPropagation();
    closePanel();
  });

  document.addEventListener('click', e => {
    if (panelOpen && !nav.contains(e.target)) closePanel();
  });
}

// ── CUSTOM CURSOR ──
function buildCursor() {
  const dot = document.getElementById('cursor');
  if (!dot) return;

  let visible = false;

  document.addEventListener('mousemove', e => {
    dot.style.left = e.clientX + 'px';
    dot.style.top  = e.clientY + 'px';
    if (!visible) {
      dot.style.opacity = '1';
      visible = true;
    }
  });

  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    visible = false;
  });

  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
    visible = true;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  buildNav();
  buildCursor();
});