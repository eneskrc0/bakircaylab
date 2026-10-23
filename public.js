// Pages are switched with in-page links: #biz-kimiz, #amacimiz; anything else is the home page.
// Every video has an MP4 source and a smaller WebM fallback for browsers without H.264.
const mp4 = src => ({src, type: 'video/mp4'});
const webm = src => ({src, type: 'video/webm'});
const setSources = (el, sources) => {
  el.replaceChildren(...sources.map(s => Object.assign(document.createElement('source'), s)));
  el.load();
};
const clearSources = el => {
  el.pause();
  el.replaceChildren();
  el.removeAttribute('src');
  el.load();
};
const hasSources = el => el.querySelector('source') !== null;
const motion = matchMedia('(prefers-reduced-motion: reduce)');

let homeReady = false;
let pauseHome = () => {};
let resumeHome = () => {};
const initHome = () => {
  const video = document.querySelector('#background-video');
  const toggle = document.querySelector('#video-toggle');
  const slides = [
    {title: 'Stres takibi', subtitle: 'SALİVA TEMELLİ ÖLÇÜM TEKNOLOJİSİ', eyebrow: 'BAKIRCAY LAB · BİYOSENSÖR TEKNOLOJİLERİ', href: '#stress-project',
      sources: [mp4('media/bakir-background.mp4'), webm('media/bakir-background.webm')]},
    {title: 'Sütte antibiyotik taraması', subtitle: 'YERİNDE TARAMA İÇİN TAŞINABİLİR SENSÖR SİSTEMİ', eyebrow: 'BAKIRCAY LAB · GIDA TEKNOLOJİLERİ', href: '#milk-project',
      sources: [mp4('media/milk-background.mp4'), webm('media/milk-background.webm')]}
  ];
  let activeProject = 0;
  let playbackRequested = false;
  let retryArmed = false;
  const mobileVideo = matchMedia('(max-width: 700px)');
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.setAttribute('webkit-playsinline', '');
  video.preload = 'metadata';
  const ambient = video.cloneNode(false);
  ambient.removeAttribute('id');
  ambient.className = 'video-ambient';
  ambient.muted = true;
  video.before(ambient);
  const update = () => {
    toggle.textContent = window.labText(video.paused ? '▶ Videoyu oynat' : 'Ⅱ Videoyu durdur');
    toggle.setAttribute('aria-label', window.labText(video.paused ? 'Arka plan videosunu oynat' : 'Arka plan videosunu durdur'));
  };
  const startAmbient = () => {
    if (mobileVideo.matches) return;
    if (!hasSources(ambient)) setSources(ambient, slides[activeProject].sources);
    ambient.currentTime = video.currentTime;
    ambient.play().catch(() => {});
  };
  const play = async () => {
    if (!hasSources(video)) setSources(video, slides[activeProject].sources);
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
  video.addEventListener('play', () => { update(); startAmbient(); });
  mobileVideo.addEventListener('change', () => {
    if (mobileVideo.matches) clearSources(ambient);
    else if (!video.paused) startAmbient();
  });
  video.addEventListener('pause', () => { update(); ambient.pause(); });
  video.addEventListener('error', () => { update(); ambient.pause(); });
  toggle.addEventListener('click', () => {
    playbackRequested = video.paused;
    if (playbackRequested) play(); else video.pause();
  });
  const showSlideText = () => {
    const slide = slides[activeProject];
    document.querySelector('.hero-copy h1').textContent = window.labText(slide.title);
    document.querySelector('.hero-copy p').textContent = window.labText(slide.subtitle);
    document.querySelector('.hero-eyebrow').textContent = window.labText(slide.eyebrow);
    const link = document.querySelector('.hero-link');
    link.href = slide.href;
    link.textContent = window.labText('Projeyi keşfedin ↗');
  };
  window.addEventListener('lab-language-change', () => { showSlideText(); update(); });
  const selectProject = index => {
    activeProject = (index + slides.length) % slides.length;
    clearSources(video);
    clearSources(ambient);
    showSlideText();
    document.querySelectorAll('[data-project]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.project) === activeProject)));
    if (playbackRequested) play(); else update();
  };
  document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => selectProject(Number(button.dataset.project))));
  document.querySelector('.project-prev').addEventListener('click', () => selectProject(activeProject - 1));
  document.querySelector('.project-next').addEventListener('click', () => selectProject(activeProject + 1));
  document.querySelector('.project-preview').addEventListener('click', () => {
    selectProject(1);
    document.querySelector('.home-hero').scrollIntoView({behavior: motion.matches ? 'instant' : 'smooth'});
    document.querySelector('[data-project="1"]').focus({preventScroll: true});
  });
  motion.addEventListener('change', () => { if (motion.matches) { playbackRequested = false; video.pause(); } });
  // Leaving the home page pauses the video; coming back resumes it unless the visitor had paused it.
  let pausedByVisitor = motion.matches;
  pauseHome = () => { pausedByVisitor = !playbackRequested; playbackRequested = false; video.pause(); };
  resumeHome = () => { if (!pausedByVisitor && !motion.matches) { playbackRequested = true; play(); } };
  playbackRequested = !motion.matches;
  selectProject(0);
};

const aboutVideo = document.querySelector('#about-video');
setSources(aboutVideo, [mp4('media/logo-animation.mp4'), webm('media/logo-animation.webm')]);
const playAbout = () => {
  aboutVideo.currentTime = 0;
  aboutVideo.play().catch(() => {});
};
document.querySelector('.about-replay').addEventListener('click', playAbout);

const render = () => {
  const target = location.hash.slice(1);
  const info = target === 'biz-kimiz' ? 'about' : target === 'amacimiz' ? 'purpose' : null;
  const home = !info;
  const wasHome = !document.querySelector('#home-view').hidden;
  document.body.classList.toggle('home-page', home);
  document.querySelector('#home-view').hidden = !home;
  document.querySelector('#about-view').hidden = info !== 'about';
  document.querySelector('#purpose-view').hidden = info !== 'purpose';
  document.querySelectorAll('[data-page]').forEach(a => {
    if (a.dataset.page === (home ? 'home' : info)) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
  if (home) {
    aboutVideo.pause();
    if (!homeReady) { homeReady = true; initHome(); }
    else if (!wasHome) resumeHome();
    const anchor = target && document.getElementById(target);
    if (anchor) requestAnimationFrame(() => anchor.scrollIntoView({behavior: 'instant'}));
    else window.scrollTo(0, 0);
  } else {
    if (wasHome) pauseHome();
    if (info === 'about' && !motion.matches) playAbout(); else aboutVideo.pause();
    window.scrollTo(0, 0);
  }
};
window.addEventListener('hashchange', render);
render();
