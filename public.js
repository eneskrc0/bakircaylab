// Page switching (#biz-kimiz, #amacimiz, everything else = home), header, mobile menu and videos.
// Every video has an MP4 source and a smaller WebM fallback for browsers without H.264.
const mp4 = src => ({src, type: 'video/mp4'});
const webm = src => ({src, type: 'video/webm'});
const setSources = (el, sources) => {
  el.replaceChildren(...sources.map(s => Object.assign(document.createElement('source'), s)));
  el.load();
};
const clearSources = el => { el.pause(); el.replaceChildren(); el.removeAttribute('src'); el.load(); };
const hasSources = el => el.querySelector('source') !== null;
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const body = document.body;
const header = document.querySelector('#site-header');

// ---------- Header: solid background once the page scrolls (home only starts transparent) ----------
const updateHeader = () => header.classList.toggle('is-solid', !body.classList.contains('is-home') || scrollY > 24 || body.classList.contains('menu-open'));
addEventListener('scroll', updateHeader, {passive: true});

// ---------- Mobile menu ----------
const nav = document.querySelector('#main-nav');
const menuButton = document.querySelector('.menu-btn');
const setMenu = open => {
  nav.classList.toggle('is-open', open);
  body.classList.toggle('menu-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', window.labText(open ? 'Menüyü kapat' : 'Menüyü aç'));
  updateHeader();
};
menuButton.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
nav.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
addEventListener('keydown', event => { if (event.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); menuButton.focus(); } });
addEventListener('lab-language-change', () => setMenu(nav.classList.contains('is-open')));

// ---------- Home hero video ----------
let homeReady = false;
let pauseHome = () => {};
let resumeHome = () => {};
const initHome = () => {
  const video = document.querySelector('#background-video');
  const toggle = document.querySelector('#video-toggle');
  const projectLink = document.querySelector('#hero-project-link');
  const slides = [
    [mp4('media/bakir-background.mp4'), webm('media/bakir-background.webm')],
    [mp4('media/milk-background.mp4'), webm('media/milk-background.webm')]
  ];
  let active = 0;
  let playbackRequested = false;
  let retryArmed = false;
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  const update = () => {
    toggle.textContent = video.paused ? '▶' : 'Ⅱ';
    toggle.setAttribute('aria-label', window.labText(video.paused ? 'Arka plan videosunu oynat' : 'Arka plan videosunu durdur'));
  };
  const play = async () => {
    if (!hasSources(video)) setSources(video, slides[active]);
    try { await video.play(); } catch {
      update();
      // Autoplay was refused: start on the visitor's first tap or key press instead.
      if (retryArmed) return;
      retryArmed = true;
      const retry = () => {
        retryArmed = false;
        removeEventListener('pointerdown', retry);
        removeEventListener('keydown', retry);
        if (playbackRequested && video.paused && !document.querySelector('#home-view').hidden) play();
      };
      addEventListener('pointerdown', retry);
      addEventListener('keydown', retry);
    }
  };
  ['play', 'pause', 'error'].forEach(type => video.addEventListener(type, update));
  toggle.addEventListener('click', () => {
    playbackRequested = video.paused;
    if (playbackRequested) play(); else video.pause();
  });
  addEventListener('lab-language-change', update);
  const select = index => {
    active = (index + slides.length) % slides.length;
    clearSources(video);
    document.querySelectorAll('[data-project]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.project) === active)));
    projectLink.setAttribute('href', active === 0 ? '#stress-project' : '#milk-project');
    if (playbackRequested) play(); else update();
  };
  document.querySelector('.hero-prev').addEventListener('click', () => { playbackRequested = !motion.matches; select(active - 1); });
  document.querySelector('.hero-next').addEventListener('click', () => { playbackRequested = !motion.matches; select(active + 1); });
  // Horizontal swipe on the hero switches projects on touch screens.
  const hero = document.querySelector('.hero');
  let touchX = null, touchY = null;
  hero.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; touchY = e.touches[0].clientY; }, {passive: true});
  hero.addEventListener('touchend', e => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX, dy = e.changedTouches[0].clientY - touchY;
    touchX = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) { playbackRequested = !motion.matches; select(active + (dx < 0 ? 1 : -1)); }
  }, {passive: true});
  document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => {
    playbackRequested = true;
    select(Number(button.dataset.project));
  }));
  document.querySelector('.project-preview').addEventListener('click', () => {
    playbackRequested = !motion.matches;
    select(1);
    scrollTo({top: 0, behavior: motion.matches ? 'instant' : 'smooth'});
    document.querySelector('[data-project="1"]').focus({preventScroll: true});
  });
  motion.addEventListener('change', () => { if (motion.matches) { playbackRequested = false; video.pause(); } });
  let pausedByVisitor = motion.matches;
  pauseHome = () => { pausedByVisitor = !playbackRequested; playbackRequested = false; video.pause(); };
  resumeHome = () => { if (!pausedByVisitor && !motion.matches) { playbackRequested = true; play(); } };
  playbackRequested = !motion.matches;
  select(0);
};

// ---------- About page logo animation ----------
const aboutVideo = document.querySelector('#about-video');
setSources(aboutVideo, [mp4('media/logo-animation.mp4'), webm('media/logo-animation.webm')]);
const playAbout = () => { aboutVideo.currentTime = 0; aboutVideo.play().catch(() => {}); };
document.querySelector('.replay-btn').addEventListener('click', playAbout);

// ---------- Router ----------
const views = {home: document.querySelector('#home-view'), about: document.querySelector('#about-view'), purpose: document.querySelector('#purpose-view')};
const render = () => {
  const target = location.hash.slice(1);
  const page = target === 'biz-kimiz' ? 'about' : target === 'amacimiz' ? 'purpose' : 'home';
  const wasHome = !views.home.hidden;
  const changed = views[page].hidden;
  Object.entries(views).forEach(([name, el]) => {
    el.hidden = name !== page;
    el.classList.toggle('view-enter', name === page && changed);
  });
  body.classList.toggle('is-home', page === 'home');
  document.querySelectorAll('[data-page]').forEach(a => {
    if (a.dataset.page === page) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
  if (page === 'home') {
    aboutVideo.pause();
    if (!homeReady) { homeReady = true; initHome(); } else if (!wasHome) resumeHome();
    const anchor = target && document.getElementById(target);
    if (anchor) requestAnimationFrame(() => anchor.scrollIntoView({behavior: 'instant', block: 'start'}));
    else if (changed || !target) scrollTo({top: 0, behavior: 'instant'});
  } else {
    if (wasHome) pauseHome();
    if (page === 'about' && !motion.matches) playAbout(); else aboutVideo.pause();
    scrollTo({top: 0, behavior: 'instant'});
  }
  updateHeader();
};
addEventListener('hashchange', render);
render();
