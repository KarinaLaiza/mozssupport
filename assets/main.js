/* ---------- language switch (PT/EN) ---------- */
function isEnglish(){ return document.documentElement.lang === 'en'; }

function setLang(lang){
  document.documentElement.lang = lang === 'en' ? 'en' : 'pt-MZ';
  document.querySelectorAll('.lang-menu button').forEach(b=>b.classList.toggle('active', b.dataset.lang===lang));
  document.querySelectorAll('.lang-btn .code').forEach(el=> el.textContent = lang.toUpperCase());
  document.querySelectorAll('.lang-btn .flag img').forEach(el=> el.src = lang==='en' ? 'assets/icons/flag-us.webp' : 'assets/icons/flag-pt.webp');
  document.querySelectorAll('[data-pt][data-en]').forEach(el=>{
    const val = lang==='en' ? el.dataset.en : el.dataset.pt;
    if(el.innerHTML.includes('<span') || el.innerHTML.includes('<br')){ el.innerHTML = val; } else { el.textContent = val; }
  });
  document.querySelectorAll('[data-pt-ph]').forEach(el=>{
    el.setAttribute('placeholder', lang==='en' ? el.dataset.enPh : el.dataset.ptPh);
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

/* ---------- mobile nav drawer ---------- */
const burgerBtn = document.querySelector('.burger');
const navLinksEl = document.querySelector('.nav-links');
function closeMobileNav(){
  if(!navLinksEl) return;
  navLinksEl.classList.remove('open');
  document.body.classList.remove('nav-open');
  if(burgerBtn) burgerBtn.setAttribute('aria-expanded', 'false');
}
function openMobileNav(){
  if(!navLinksEl) return;
  navLinksEl.classList.add('open');
  document.body.classList.add('nav-open');
  if(burgerBtn) burgerBtn.setAttribute('aria-expanded', 'true');
}
if (burgerBtn && navLinksEl){
  burgerBtn.addEventListener('click', ()=>{
    if (navLinksEl.classList.contains('open')) closeMobileNav();
    else openMobileNav();
  });
  navLinksEl.querySelectorAll('a').forEach(a=>{
    a.addEventListener('click', closeMobileNav);
  });
  window.addEventListener('resize', ()=>{
    if (window.innerWidth > 1080) closeMobileNav();
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
