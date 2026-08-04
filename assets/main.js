/* ---------- language switch (PT/EN) ---------- */
const LANG_STORAGE_KEY = 'mozsupport-lang';

function isEnglish(){ return document.documentElement.lang === 'en'; }

function normalizeLang(lang){
  return lang === 'en' ? 'en' : 'pt-MZ';
}

function getPreferredLang(){
  const params = new URLSearchParams(window.location.search);
  const paramLang = params.get('lang');
  if(paramLang === 'en' || paramLang === 'pt') return paramLang;

  const storedLang = localStorage.getItem(LANG_STORAGE_KEY);
  if(storedLang === 'en' || storedLang === 'pt-MZ') return storedLang === 'en' ? 'en' : 'pt';

  return 'pt';
}

function setLang(lang, options = {}){
  const normalizedLang = normalizeLang(lang);
  const uiLang = normalizedLang === 'en' ? 'en' : 'pt';
  const { persist = true, updateUrl = true } = options;

  document.documentElement.lang = normalizedLang;
  if(persist) localStorage.setItem(LANG_STORAGE_KEY, normalizedLang);

  document.querySelectorAll('.lang-menu button').forEach(b=>b.classList.toggle('active', b.dataset.lang===uiLang));
  document.querySelectorAll('.lang-btn .code').forEach(el=> el.textContent = uiLang.toUpperCase());
  document.querySelectorAll('.lang-btn .flag img').forEach(el=> el.src = uiLang==='en' ? 'assets/icons/flag-us.webp' : 'assets/icons/flag-pt.webp');
  document.querySelectorAll('[data-pt][data-en]').forEach(el=>{
    const val = uiLang==='en' ? el.dataset.en : el.dataset.pt;
    if(el.innerHTML.includes('<span') || el.innerHTML.includes('<br')){ el.innerHTML = val; } else { el.textContent = val; }
  });
  document.querySelectorAll('[data-pt-ph]').forEach(el=>{
    el.setAttribute('placeholder', uiLang==='en' ? el.dataset.enPh : el.dataset.ptPh);
  });

  if(updateUrl){
    const params = new URLSearchParams(window.location.search);
    if(uiLang === 'en') params.set('lang', 'en');
    else params.delete('lang');

    const nextUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}${window.location.hash}`;
    window.history.replaceState({}, '', nextUrl);
  }
}

function applyStoredLang(){
  setLang(getPreferredLang(), { persist: true, updateUrl: false });
}

function decorateInternalLinks(){
  const langToUse = getPreferredLang();
  document.querySelectorAll('a[href]').forEach(link=>{
    const href = link.getAttribute('href');
    if(!href || /^https?:\/\//i.test(href) || /^mailto:/i.test(href) || /^tel:/i.test(href)) return;

    try{
      const url = new URL(href, window.location.href);
      if(url.origin !== window.location.origin) return;
      if(langToUse === 'en') url.searchParams.set('lang', 'en');
      else url.searchParams.delete('lang');
      link.setAttribute('href', `${url.pathname}${url.search}${url.hash}`);
    } catch (error) {
      console.warn('Invalid link', href, error);
    }
  });
}

document.querySelectorAll('.lang-switch').forEach(sw=>{
  const btn = sw.querySelector('.lang-btn');
  const menu = sw.querySelector('.lang-menu');
  if(!btn || !menu) return;
  btn.addEventListener('click', (e)=>{
    e.stopPropagation();
    document.querySelectorAll('.lang-switch.open').forEach(o=>{ if(o!==sw) o.classList.remove('open'); });
    sw.classList.toggle('open');
  });
  menu.querySelectorAll('button').forEach(b=>{
    b.addEventListener('click', ()=>{
      setLang(b.dataset.lang);
      sw.classList.remove('open');
    });
  });
});
document.addEventListener('click', ()=>{
  document.querySelectorAll('.lang-switch.open').forEach(o=>o.classList.remove('open'));
});

applyStoredLang();
decorateInternalLinks();

document.addEventListener('click', (event)=>{
  const link = event.target.closest('a[href]');
  if(!link) return;
  const href = link.getAttribute('href');
  if(!href || /^https?:\/\//i.test(href) || /^mailto:/i.test(href) || /^tel:/i.test(href)) return;
  try{
    const url = new URL(href, window.location.href);
    if(url.origin !== window.location.origin) return;
    const langToUse = getPreferredLang();
    if(langToUse === 'en') url.searchParams.set('lang', 'en');
    else url.searchParams.delete('lang');
    link.setAttribute('href', `${url.pathname}${url.search}${url.hash}`);
  } catch (error) {
    console.warn('Invalid link', href, error);
  }
});

/* ---------- mobile nav drawer (hamburger menu) ---------- */
const burgerBtn = document.querySelector('.burger');
const navLinksEl = document.querySelector('.nav-links');
const MOBILE_NAV_BREAKPOINT = 1024; /* tem de coincidir com o breakpoint do CSS onde o menu colapsa */
const NAV_TRANSITION_MS = 260; /* ligeiramente acima da transição definida no CSS, para evitar cliques duplicados a meio da animação */
const mobileNavQuery = window.matchMedia(`(max-width: ${MOBILE_NAV_BREAKPOINT}px)`);
let navIsAnimating = false;
let navIsOpen = false;

function lockNavToggle(){
  navIsAnimating = true;
  window.setTimeout(()=>{ navIsAnimating = false; }, NAV_TRANSITION_MS);
}

/* aria-hidden só faz sentido quando o menu é uma drawer (mobile/tablet);
   no desktop o .nav-links está sempre visível e nunca deve ficar aria-hidden */
function syncNavAriaHidden(){
  if(!navLinksEl) return;
  if(mobileNavQuery.matches) navLinksEl.setAttribute('aria-hidden', navIsOpen ? 'false' : 'true');
  else navLinksEl.removeAttribute('aria-hidden');
}

function closeMobileNav(opts){
  const returnFocus = opts && opts.returnFocus;
  if(!navLinksEl || !navIsOpen) return;
  navIsOpen = false;
  lockNavToggle();
  navLinksEl.classList.remove('open');
  document.body.classList.remove('nav-open');
  syncNavAriaHidden();
  if(burgerBtn){
    burgerBtn.setAttribute('aria-expanded', 'false');
    if(returnFocus) burgerBtn.focus();
  }
}

function openMobileNav(){
  if(!navLinksEl || navIsOpen) return;
  navIsOpen = true;
  lockNavToggle();
  navLinksEl.classList.add('open');
  document.body.classList.add('nav-open');
  syncNavAriaHidden();
  if(burgerBtn) burgerBtn.setAttribute('aria-expanded', 'true');
  const firstLink = navLinksEl.querySelector('a, button');
  if(firstLink) firstLink.focus();
}

function toggleMobileNav(){
  if(navIsAnimating) return; /* impede bugs de múltiplos cliques durante a transição */
  if(navIsOpen) closeMobileNav({returnFocus:true});
  else openMobileNav();
}

if (burgerBtn && navLinksEl){
  syncNavAriaHidden();
  mobileNavQuery.addEventListener ? mobileNavQuery.addEventListener('change', syncNavAriaHidden) : mobileNavQuery.addListener(syncNavAriaHidden);

  burgerBtn.addEventListener('click', (e)=>{
    e.stopPropagation();
    toggleMobileNav();
  });

  /* fecha ao clicar num link do menu */
  navLinksEl.querySelectorAll('a').forEach(a=>{
    a.addEventListener('click', ()=> closeMobileNav());
  });

  /* fecha ao clicar fora do menu (mas não durante a animação de abertura) */
  document.addEventListener('click', (e)=>{
    if(!navIsOpen) return;
    if(navLinksEl.contains(e.target) || e.target === burgerBtn || burgerBtn.contains(e.target)) return;
    closeMobileNav();
  });

  /* impede que um clique dentro do próprio menu (fora dos links) o feche */
  navLinksEl.addEventListener('click', (e)=> e.stopPropagation());

  /* fecha com a tecla Escape e devolve o foco ao botão do menu */
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape' && navIsOpen) closeMobileNav({returnFocus:true});
  });

  /* fecha automaticamente ao redimensionar para desktop */
  window.addEventListener('resize', ()=>{
    if (window.innerWidth > MOBILE_NAV_BREAKPOINT) closeMobileNav();
  });
}

/* ---------- stat count-up ---------- */
const counters = document.querySelectorAll('.stat-item .num[data-count]');
let counted = false;
function runCounters(){
  if(counted) return; counted = true;
  counters.forEach(c=>{
    const target = parseInt(c.dataset.count,10);
    let cur = 0; const step = Math.max(1, Math.round(target/50));
    const tick = ()=>{
      cur += step;
      if(cur >= target){ c.textContent = c.dataset.prefix ? c.dataset.prefix+target.toLocaleString('pt-PT') : target.toLocaleString('pt-PT'); return; }
      c.textContent = (c.dataset.prefix||'') + cur.toLocaleString('pt-PT');
      requestAnimationFrame(tick);
    };
    tick();
  });
}
const statObs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting) runCounters(); });
},{threshold:0.4});
document.querySelectorAll('.stats-band').forEach(el=>statObs.observe(el));

/* ---------- reveal on scroll ---------- */
const revealObs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('show'); revealObs.unobserve(e.target);} });
},{threshold:0.12});
document.querySelectorAll('.reveal').forEach(el=>revealObs.observe(el));

/* ---------- contact form (visual demo) ---------- */
document.querySelectorAll('form.form-box').forEach(f=>{
  f.addEventListener('submit', (e)=>{
    e.preventDefault();
    const note = f.querySelector('.form-note');
    if(note) note.textContent = isEnglish() ? 'Thanks — this is a visual demo, no data was sent.' : 'Obrigado — esta é uma demo visual, nenhum dado foi enviado.';
  });
});
