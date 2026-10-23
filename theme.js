(() => {
  // A saved choice wins; otherwise follow the device's light/dark setting.
  let saved = null;
  try { saved = localStorage.getItem('bakircay-theme'); } catch {}
  const system = matchMedia('(prefers-color-scheme: dark)');
  const systemTheme = () => system.matches ? 'dark' : 'light';
  document.documentElement.dataset.theme = saved === 'dark' || saved === 'light' ? saved : systemTheme();
  function updateButtons() {
    document.querySelectorAll('.theme-toggle').forEach(button => {
      const dark = document.documentElement.dataset.theme === 'dark';
      button.textContent = window.labText(dark ? '☀ Açık tema' : '☾ Koyu tema');
      button.setAttribute('aria-label', window.labText(dark ? 'Açık temaya geç' : 'Koyu temaya geç'));
      button.setAttribute('aria-pressed', String(dark));
    });
  }
  document.addEventListener('DOMContentLoaded', () => {
    updateButtons();
    document.querySelectorAll('.theme-toggle').forEach(button => button.addEventListener('click', () => {
      const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      try { localStorage.setItem('bakircay-theme', next); } catch {}
      updateButtons();
    }));
  });
  window.addEventListener('lab-language-change', updateButtons);
  system.addEventListener('change', () => {
    let current = null;
    try { current = localStorage.getItem('bakircay-theme'); } catch {}
    if (current) return;
    document.documentElement.dataset.theme = systemTheme();
    updateButtons();
  });
  window.addEventListener('storage', event => {
    if (event.key !== 'bakircay-theme') return;
    document.documentElement.dataset.theme = event.newValue === 'dark' ? 'dark' : 'light';
    updateButtons();
  });
})();

// Marketing-site language support. Keep the selected language across pages.
(() => {
  let language = 'tr';
  try { if (localStorage.getItem('bakircay-language') === 'en') language = 'en'; } catch {}
  const words = {
    'Stres takibi': 'Stress monitoring',
    'Sütte antibiyotik taraması': 'Antibiotic screening in milk',
    'SALİVA TEMELLİ ÖLÇÜM TEKNOLOJİSİ': 'SALIVA-BASED MEASUREMENT TECHNOLOGY',
    'YERİNDE TARAMA İÇİN TAŞINABİLİR SENSÖR SİSTEMİ': 'A PORTABLE SENSOR SYSTEM FOR ON-SITE SCREENING',
    'BAKIRCAY LAB · BİYOSENSÖR TEKNOLOJİLERİ': 'BAKIRCAY LAB · BIOSENSOR TECHNOLOGIES',
    'BAKIRCAY LAB · GIDA TEKNOLOJİLERİ': 'BAKIRCAY LAB · FOOD TECHNOLOGIES',
    'Projeyi keşfedin ↗': 'Explore the project ↗',
    '▶ Videoyu oynat': '▶ Play video', 'Ⅱ Videoyu durdur': 'Ⅱ Pause video',
    'Arka plan videosunu oynat': 'Play background video', 'Arka plan videosunu durdur': 'Pause background video',
    '☀ Açık tema': '☀ Light theme', '☾ Koyu tema': '☾ Dark theme',
    'Açık temaya geç': 'Switch to light theme', 'Koyu temaya geç': 'Switch to dark theme'
  };
  window.labText = text => language === 'en' ? words[text] || text : text;
  const entries = {
    '.wordmark small': 'BIOSENSOR TECHNOLOGIES',
    '[data-page="home"]': 'Home', 'nav a[href="#projects"]': 'Projects',
    '[data-page="about"]': 'About us', '[data-page="purpose"]': 'Our purpose',
    '[data-project="0"]': '<span>01</span> Stress monitoring',
    '[data-project="1"]': '<span>02</span> Antibiotics in milk',
    '.hero-bottom>a': 'DISCOVER ↓',
    '.project-heading .section-label': 'RESEARCH & DEVELOPMENT',
    '.project-heading h2': 'Our projects',
    '.project-heading p': 'Research and development at Bakircay Lab.',
    '#stress-project .project-number': '01 / SALIVA-BASED MEASUREMENT',
    '#stress-project h3': 'Stress monitoring',
    '#stress-project p': 'We aim to make stress measurement using a saliva sample accessible to everyone.',
    '#stress-project .inline-link': 'Discover the project <span>↗</span>',
    '#milk-project .project-number': '02 / RESEARCH & DEVELOPMENT',
    '#milk-project h3': 'Antibiotic screening in milk',
    '#milk-project p:nth-of-type(1)': 'We are developing a compact, portable sensor system for on-site screening of antibiotic residues, such as tetracycline, in milk samples.',
    '#milk-project p:nth-of-type(2)': 'Our pipette-shaped device concept combines a disposable sampling tip with a reusable electronic reader.',
    '#milk-project .project-stage': 'Currently in research and development. Calibration, selectivity and repeatability studies are planned to validate the measurement approach.',
    '.project-preview': 'Watch the project video <span>↗</span>',
    '#home-intro .section-label': 'PEOPLE AT THE HEART OF SCIENCE',
    '#home-intro h2': 'From science to life,<br>new solutions.',
    '#home-intro p': 'At Bakircay Lab, we bring together projects in saliva-based stress monitoring and antibiotic residue screening in milk. Our research and development focuses on creating accessible, easy-to-use solutions.',
    '#home-intro .inline-link': 'Meet Bakircay Lab <span>↗</span>',
    '#about-view .info-heading .section-label': 'ABOUT US',
    '#about-view .info-heading h1': 'Ideas born from science,<br>solutions that <em>touch lives.</em>',
    '#about-view .info-heading p': 'Bakircay Lab is a research and development team working on biosensors and measurement technologies for health and food applications. We combine scientific research with portable device design and digital monitoring to develop easy-to-use solutions.',
    '.about-copy .section-label': 'OUR APPROACH',
    '.about-copy h2': 'Understanding needs.<br>Developing through science.',
    '.about-copy p:nth-of-type(1)': 'We begin by identifying a real need, considering sensor development, experimental evaluation and user experience together. We investigate measurement performance and operating conditions to turn ideas into practical solutions.',
    '.about-copy p:nth-of-type(2)': 'Saliva-based stress monitoring and on-site screening of antibiotic residues in milk are current examples of this approach. Each project has its own requirements, but our focus remains the same: clear, accessible measurement technologies supported by scientific evidence.',
    '.about-copy .inline-link': 'Explore our projects <span>↗</span>',
    '.principles article:nth-child(1) h3': 'A scientific approach',
    '.principles article:nth-child(1) p': 'We evaluate design decisions through experimental data, with attention to reproducibility and the limitations of each measurement.',
    '.principles article:nth-child(2) h3': 'User-centred design',
    '.principles article:nth-child(2) p': 'From sample collection to viewing results, we design a simple, clear experience suited to its intended use.',
    '.principles article:nth-child(3) h3': 'Benefits across fields',
    '.principles article:nth-child(3) p': 'We aim to help translate research into practice through sensor solutions that address different needs in health and food applications.',
    '#purpose-view .info-heading .section-label': 'OUR PURPOSE',
    '#purpose-view .info-heading h1': 'Bringing measurement<br>closer to <em>everyday life.</em>',
    '#purpose-view .info-heading p': 'Our purpose is to use biosensor technologies to make measurement and screening more accessible, portable and practical. From health monitoring to food analysis, we aim to develop solutions that give people access to understandable data.',
    '.purpose-callout .section-label': 'OUR FOCUS',
    '.purpose-callout h2': 'Scientific.<br>Accessible.<br><em>Practical.</em>',
    '.purpose-callout p': 'We work to turn ideas at the research stage into measurement solutions that respond to real needs.',
    '.purpose-steps article:nth-child(1) h3': 'Taking measurement where it is needed',
    '.purpose-steps article:nth-child(1) p': 'Developing approaches to on-site measurement and preliminary screening using compact sensors and portable devices.',
    '.purpose-steps article:nth-child(2) h3': 'Making results understandable',
    '.purpose-steps article:nth-child(2) p': 'Presenting measurement data through simple interfaces that help users review results, follow their records and see changes over time.',
    '.purpose-steps article:nth-child(3) h3': 'Guiding development with scientific evidence',
    '.purpose-steps article:nth-child(3) p': 'Planning calibration, selectivity and repeatability studies around each project, and using the findings to evaluate performance and operating limits.',
    '.scope-note': 'Our projects are in the research and development stage. Their intended scope and performance targets are shaped by the validation studies carried out for each project.',
    '.info-cta h2': 'Different needs. A shared research approach.',
    '.info-cta p': 'Discover the projects we are developing at Bakircay Lab.',
    '.info-cta .button-link': 'Explore our projects <span>→</span>',
    '.about-replay': '↻ Watch again',
    '.public-footer span:last-child': 'A research and development initiative'
  };
  document.addEventListener('DOMContentLoaded', () => {
    if (!document.querySelector('.public-header')) return;
    const originals = [];
    for (const [selector, en] of Object.entries(entries)) {
      document.querySelectorAll(selector).forEach(element => originals.push({element, tr: element.innerHTML, en}));
    }
    const attributes = [];
    const labels = {'Bakircay Lab ana sayfa':'Bakircay Lab home','Ana menü':'Main navigation','slayt gösterisi':'slideshow','Bakircay Lab projeleri':'Bakircay Lab projects','Önceki proje':'Previous project','Sonraki proje':'Next project','Proje seç':'Select a project','Bakircay Lab hakkında daha fazla bilgi':'Learn more about Bakircay Lab','Bakircay Lab logo animasyonu':'Bakircay Lab logo animation'};
    document.querySelectorAll('[aria-label], [aria-roledescription]').forEach(element => {
      for (const attr of ['aria-label','aria-roledescription']) {
        const tr = element.getAttribute(attr);
        if (labels[tr]) attributes.push({element, attr, tr, en: labels[tr]});
      }
    });
    const group = document.createElement('div');
    group.className = 'language-switch'; group.setAttribute('role','group');
    group.innerHTML = '<button type="button" lang="tr" data-language="tr" aria-label="Türkçe">TR</button><button type="button" lang="en" data-language="en" aria-label="English">EN</button>';
    document.querySelector('.public-header nav').append(group);
    const description = document.querySelector('meta[name="description"]');
    const descriptionTR = description?.content;
    function apply() {
      document.documentElement.lang = language;
      originals.forEach(item => { item.element.innerHTML = item[language]; });
      attributes.forEach(item => item.element.setAttribute(item.attr,item[language]));
      group.setAttribute('aria-label', language === 'en' ? 'Language' : 'Dil');
      group.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.language === language)));
      setTitle();
      if (description) description.content = language === 'tr' ? descriptionTR : 'Bakircay Lab develops sensor systems for saliva-based stress monitoring and on-site screening of antibiotic residues in milk.';
      window.dispatchEvent(new Event('lab-language-change'));
    }
    function setTitle() {
      const page = location.hash.slice(1);
      const names = page === 'biz-kimiz' ? ['Biz Kimiz?','About us'] : page === 'amacimiz' ? ['Amacımız','Our purpose'] : ['Biyosensör Teknolojileri','Biosensor Technologies'];
      document.title = names[language === 'en' ? 1 : 0] + ' | Bakircay Lab';
    }
    window.addEventListener('hashchange', setTitle);
    group.addEventListener('click', event => {
      const button = event.target.closest('[data-language]');
      if (!button) return;
      language = button.dataset.language;
      try { localStorage.setItem('bakircay-language',language); } catch {}
      apply();
    });
    apply();
  });
})();
