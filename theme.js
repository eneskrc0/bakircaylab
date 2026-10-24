// Theme (light/dark) and language (TR/EN). Loaded in <head> so the theme applies before first paint.
(() => {
  const read = key => { try { return localStorage.getItem(key); } catch { return null; } };
  const write = (key, value) => { try { localStorage.setItem(key, value); } catch {} };

  // Theme: a saved choice wins; otherwise follow the device setting.
  const system = matchMedia('(prefers-color-scheme: dark)');
  const savedTheme = read('bakircay-theme');
  const root = document.documentElement;
  root.dataset.theme = savedTheme === 'dark' || savedTheme === 'light' ? savedTheme : (system.matches ? 'dark' : 'light');

  // Language: Turkish text is in the page; English lives in data-en / data-en-<attr> attributes.
  let language = read('bakircay-language') === 'en' ? 'en' : 'tr';
  const words = {
    'Arka plan videosunu oynat': 'Play background video', 'Arka plan videosunu durdur': 'Pause background video',
    'Koyu temaya geç': 'Switch to dark theme', 'Açık temaya geç': 'Switch to light theme',
    'Menüyü aç': 'Open menu', 'Menüyü kapat': 'Close menu',
    'Açık tema': 'Light theme', 'Koyu tema': 'Dark theme'
  };
  window.labText = text => language === 'en' ? words[text] || text : text;
  window.labLanguage = () => language;

  const pageTitles = {
    'biz-kimiz': ['Biz Kimiz?', 'About us'],
    'amacimiz': ['Amacımız', 'Our purpose'],
    '': ['Biyosensör Teknolojileri', 'Biosensor Technologies']
  };
  const setTitle = () => {
    const key = location.hash.slice(1);
    const names = pageTitles[key] || pageTitles[''];
    document.title = names[language === 'en' ? 1 : 0] + (language === 'en' ? ' | Bakircay Lab' : ' | Bakırçay Lab');
  };

  const updateThemeButton = () => {
    const dark = root.dataset.theme === 'dark';
    document.querySelectorAll('.theme-toggle').forEach(button => {
      const icon = dark ? '☀' : '☾';
      button.textContent = 'withLabel' in button.dataset ? icon + ' ' + window.labText(dark ? 'Açık tema' : 'Koyu tema') : icon;
      button.setAttribute('aria-label', window.labText(dark ? 'Açık temaya geç' : 'Koyu temaya geç'));
      button.setAttribute('aria-pressed', String(dark));
    });
  };

  document.addEventListener('DOMContentLoaded', () => {
    const texts = [...document.querySelectorAll('[data-en]')].map(element => ({element, tr: element.innerHTML, en: element.dataset.en}));
    const attrs = [];
    document.querySelectorAll('*').forEach(element => {
      for (const {name, value} of [...element.attributes]) {
        if (!name.startsWith('data-en-')) continue;
        const attr = name.slice(8);
        attrs.push({element, attr, tr: element.getAttribute(attr), en: value});
      }
    });
    const description = document.querySelector('meta[name="description"]');
    const descriptionTR = description ? description.content : '';
    const descriptionEN = 'Bakircay Lab develops sensor systems for saliva-based stress monitoring and on-site screening of antibiotic residues in milk.';

    const apply = () => {
      root.lang = language;
      texts.forEach(item => { item.element.innerHTML = item[language]; });
      attrs.forEach(item => { if (item[language] != null) item.element.setAttribute(item.attr, item[language]); });
      document.querySelectorAll('[data-language]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.language === language)));
      if (description) description.content = language === 'en' ? descriptionEN : descriptionTR;
      setTitle();
      updateThemeButton();
      window.dispatchEvent(new Event('lab-language-change'));
    };

    document.querySelectorAll('[data-language]').forEach(button => button.addEventListener('click', () => {
      if (language === button.dataset.language) return;
      language = button.dataset.language;
      write('bakircay-language', language);
      apply();
    }));
    document.querySelectorAll('.theme-toggle').forEach(button => button.addEventListener('click', () => {
      root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      write('bakircay-theme', root.dataset.theme);
      updateThemeButton();
    }));
    window.addEventListener('hashchange', setTitle);
    apply();
  });

  system.addEventListener('change', () => {
    if (read('bakircay-theme')) return;
    root.dataset.theme = system.matches ? 'dark' : 'light';
    updateThemeButton();
  });
  window.addEventListener('storage', event => {
    if (event.key !== 'bakircay-theme') return;
    root.dataset.theme = event.newValue === 'dark' ? 'dark' : 'light';
    updateThemeButton();
  });
})();
