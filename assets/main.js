/* ---------- language toggle ---------- */
const langButtons = document.querySelectorAll('.lang-toggle button');
function setLang(lang){
  document.documentElement.lang = lang === 'en' ? 'en' : 'pt-MZ';
  langButtons.forEach(b=>b.classList.toggle('active', b.dataset.lang===lang));
  document.querySelectorAll('[data-pt][data-en]').forEach(el=>{
    const val = lang==='en' ? el.dataset.en : el.dataset.pt;
    if(el.tagName==='OPTION' || el.tagName==='SPAN' || el.tagName==='A' || el.tagName==='BUTTON' || el.tagName==='H1' || el.tagName==='H2' || el.tagName==='H3' || el.tagName==='H4' || el.tagName==='P' || el.tagName==='LABEL' || el.tagName==='DIV' || el.tagName==='TH' || el.tagName==='TD' || el.tagName==='LI'){
      if(el.innerHTML.includes('<span')){ el.innerHTML = val; } else { el.textContent = val; }
    }
  });
  document.querySelectorAll('[data-pt-ph]').forEach(el=>{
    el.setAttribute('placeholder', lang==='en' ? el.dataset.enPh : el.dataset.ptPh);
  });
}
langButtons.forEach(b=>b.addEventListener('click', ()=>setLang(b.dataset.lang)));

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
const counters = document.querySelectorAll('.stat .num[data-count]');
let counted = false;
function runCounters(){
  if(counted) return; counted = true;
  counters.forEach(c=>{
    const target = parseInt(c.dataset.count,10);
    let cur = 0; const step = Math.max(1, Math.round(target/60));
    const tick = ()=>{
      cur += step;
      if(cur >= target){ c.textContent = target.toLocaleString('pt-PT'); return; }
      c.textContent = cur.toLocaleString('pt-PT');
      requestAnimationFrame(tick);
    };
    tick();
  });
}
const statObs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting) runCounters(); });
},{threshold:0.4});
document.querySelectorAll('.stat-strip').forEach(el=>statObs.observe(el));

/* ---------- reveal on scroll ---------- */
const revealObs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('show'); revealObs.unobserve(e.target);} });
},{threshold:0.12});
document.querySelectorAll('.reveal').forEach(el=>revealObs.observe(el));

/* ---------- plan tabs ---------- */
document.querySelectorAll('.plan-tab').forEach(tab=>{
  tab.addEventListener('click', ()=>{
    document.querySelectorAll('.plan-tab').forEach(t=>t.classList.remove('active'));
    document.querySelectorAll('.plan-panel').forEach(p=>p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.target).classList.add('active');
  });
});

/* ---------- calculator ---------- */
const plans = {
  '1-1':{namePt:'Pacote Inicial',nameEn:'Pacote Inicial',speed:'15 Mbps / 15 Mbps ilimitado',price:'MZM 2.550,00'},
  '1-2':{namePt:'Pacote Família',speed:'20 Mbps / 20 Mbps ilimitado',price:'MZM 3.400,00'},
  '1-3':{namePt:'Pacote Dedicado 1',speed:'2 Mbps / 2 Mbps dedicados',price:'MZM 21.000,00'},
  '2-1':{namePt:'Pacote Família',speed:'20 Mbps / 20 Mbps ilimitado',price:'MZM 3.400,00'},
  '2-2':{namePt:'Pacote Super Família',speed:'30 Mbps / 30 Mbps ilimitado',price:'MZM 5.050,00'},
  '2-3':{namePt:'Pacote Dedicado 1',speed:'2 Mbps / 2 Mbps dedicados',price:'MZM 21.000,00'},
  '3-1':{namePt:'Pacote Super Família',speed:'30 Mbps / 30 Mbps ilimitado',price:'MZM 5.050,00'},
  '3-2':{namePt:'Pacote Super Família',speed:'30 Mbps / 30 Mbps ilimitado',price:'MZM 5.050,00'},
  '3-3':{namePt:'Pacote Dedicado 2',speed:'4 Mbps / 4 Mbps dedicados',price:'MZM 42.000,00'},
};
let calcState = {people:'1', usage:'1'};
function updateCalc(){
  const key = calcState.people+'-'+calcState.usage;
  const p = plans[key] || plans['1-1'];
  document.getElementById('calc-name').textContent = p.namePt;
  document.getElementById('calc-speed').textContent = p.speed;
}
document.querySelectorAll('.calc-opts').forEach(group=>{
  group.querySelectorAll('.calc-opt').forEach(opt=>{
    opt.addEventListener('click', ()=>{
      group.querySelectorAll('.calc-opt').forEach(o=>o.classList.remove('sel'));
      opt.classList.add('sel');
      calcState[group.dataset.group] = opt.dataset.val;
      updateCalc();
    });
  });
});
updateCalc();

/* ---------- chat widget: guided assistant ---------- */
const chatFab = document.getElementById('chatFab');
const chatPanel = document.getElementById('chatPanel');
const chatBody = document.getElementById('chatBody');
const chatQuick = document.getElementById('chatQuick');
const chatInputField = document.getElementById('chatInputField');
const chatSendBtn = document.getElementById('chatSendBtn');
const chatResetBtn = document.getElementById('chatReset');
const WHATSAPP_NUMBER = '258847026991';

if (chatFab && chatPanel) {
  chatFab.addEventListener('click', ()=>{
    chatPanel.classList.toggle('open');
    if (chatPanel.classList.contains('open') && chatBody && chatBody.children.length === 0) {
      startChat();
    }
  });
}

function isEnglish(){ return document.documentElement.lang === 'en'; }

function scrollChat(){ if(chatBody) chatBody.scrollTop = chatBody.scrollHeight; }

function botSay(textPt, textEn){
  const div = document.createElement('div');
  div.className = 'msg bot';
  div.textContent = isEnglish() ? (textEn || textPt) : textPt;
  chatBody.appendChild(div);
  scrollChat();
}

function botSayHTML(html){
  const div = document.createElement('div');
  div.className = 'msg bot';
  div.innerHTML = html;
  chatBody.appendChild(div);
  scrollChat();
}

function userSay(text){
  const div = document.createElement('div');
  div.className = 'msg user';
  div.textContent = text;
  chatBody.appendChild(div);
  scrollChat();
}

function clearQuick(){ if(chatQuick) chatQuick.innerHTML=''; }

function showQuick(options, onPick){
  clearQuick();
  options.forEach(opt=>{
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = isEnglish() ? opt.en : opt.pt;
    btn.addEventListener('click', ()=>{
      clearQuick();
      userSay(isEnglish() ? opt.en : opt.pt);
      onPick(opt);
    });
    chatQuick.appendChild(btn);
  });
}

function setInputEnabled(enabled, placeholderPt, placeholderEn){
  if(!chatInputField) return;
  chatInputField.disabled = !enabled;
  chatSendBtn.disabled = !enabled;
  if(placeholderPt){
    chatInputField.setAttribute('data-pt-ph', placeholderPt);
    chatInputField.setAttribute('data-en-ph', placeholderEn || placeholderPt);
    chatInputField.setAttribute('placeholder', isEnglish() ? (placeholderEn || placeholderPt) : placeholderPt);
  }
}

function normalize(str){
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
}

/* ---------- knowledge base ---------- */
const KB = [
  { keys:['sem internet','nao tenho internet','internet caiu','sem sinal','rede caiu','nao consigo navegar','wifi nao funciona','router nao liga','sem net','caiu a net'],
    pt:"Vamos tentar resolver isto:\n1. Verifique se as luzes do router estão acesas (Power e Internet).\n2. Desligue o router da tomada, aguarde 30 segundos e ligue novamente.\n3. Aguarde 2 minutos para reconectar.\n\nSe mesmo assim continuar sem sinal, pode ser um corte na sua zona — vamos confirmar com a equipa técnica.",
    en:"Let's try to fix this:\n1. Check if the router lights (Power and Internet) are on.\n2. Unplug the router, wait 30 seconds, and plug it back in.\n3. Wait 2 minutes to reconnect.\n\nIf it's still down, it may be an outage in your area — we'll confirm with our technical team." },
  { keys:['lenta','lentidao','devagar','demora muito','baixa velocidade','internet lenta','net lenta'],
    pt:"Para internet lenta, experimente:\n1. Reiniciar o router (desligar 30s e ligar).\n2. Verificar quantos dispositivos estão ligados ao mesmo tempo.\n3. Aproximar-se do router ou ligar por cabo, se possível.\n4. Testar em horário diferente (picos à noite podem afectar a velocidade).\n\nSe a lentidão persistir, o nosso técnico pode analisar o seu pacote e sinal.",
    en:"For slow internet, try:\n1. Restart the router (unplug 30s, plug back in).\n2. Check how many devices are connected at once.\n3. Move closer to the router or connect via cable if possible.\n4. Test at a different time (evening peaks can affect speed).\n\nIf it's still slow, our technician can review your package and signal." },
  { keys:['fatura','factura','pagamento','pagar','valor a pagar','como pago','boleto','conta em atraso'],
    pt:"As facturas podem ser consultadas e pagas através do Portal do Cliente. Se ainda não tem acesso, vamos activá-lo e enviar-lhe os detalhes da sua factura actual.",
    en:"Invoices can be viewed and paid through the Client Portal. If you don't have access yet, we'll activate it and send you your current invoice details." },
  { keys:['instalar','instalacao','contratar','novo pacote','quero internet','aderir','assinar','quero contratar'],
    pt:"Óptimo! Temos pacotes residenciais a partir de MZM 2.550,00/mês e planos empresariais dedicados. Um técnico vai entrar em contacto para confirmar a disponibilidade na sua zona e agendar a instalação.",
    en:"Great! We have residential packages from MZM 2,550.00/month and dedicated business plans. A technician will contact you to confirm availability in your area and schedule installation." },
  { keys:['camara','cctv','alarme','cerca eletrica','cerca electrica','seguranca nao funciona','camera offline'],
    pt:"Para equipamentos de segurança offline:\n1. Verifique a alimentação eléctrica do equipamento.\n2. Confirme se o gravador/DVR está ligado à rede.\n3. Reinicie o equipamento.\n\nSe continuar offline, a equipa de Segurança vai agendar uma visita técnica.",
    en:"For offline security equipment:\n1. Check the equipment's power supply.\n2. Confirm the recorder/DVR is connected to the network.\n3. Restart the equipment.\n\nIf it's still offline, our Security team will schedule a technical visit." },
  { keys:['preco','quanto custa','pacotes','planos','valores','tabela de precos'],
    pt:"Os nossos pacotes residenciais vão de MZM 2.550,00 a MZM 5.050,00/mês (sem IVA), consoante a velocidade. Pode ver todos os detalhes e usar a calculadora na página de Internet.",
    en:"Our residential packages range from MZM 2,550.00 to MZM 5,050.00/month (excl. VAT), depending on speed. You can see full details and use the calculator on the Internet page." },
  { keys:['horario','atendimento','que horas','aberto','funcionam ate que horas'],
    pt:"O nosso horário é de Segunda a Sexta, das 07:30 às 17:00. Clientes corporativos têm suporte técnico 24 horas.",
    en:"Our hours are Monday to Friday, 07:30 to 17:00. Corporate clients have 24-hour technical support." },
  { keys:['reclamacao','reclamar','insatisfeito','mau servico','queixa','muito mau'],
    pt:"Lamentamos a sua experiência. O seu caso foi registado como prioritário e será encaminhado directamente à nossa equipa de gestão de qualidade.",
    en:"We're sorry about your experience. Your case has been logged as a priority and will be forwarded directly to our quality management team." },
  { keys:['sugestao','sugiro','ideia','melhoria','proposta'],
    pt:"Obrigado pela sua sugestão! Vamos encaminhá-la à nossa equipa de inovação — feedback como o seu ajuda-nos a melhorar.",
    en:"Thank you for your suggestion! We'll forward it to our innovation team — feedback like yours helps us improve." },
  { keys:['cobertura','chega ate','tem sinal em','tem cobertura','ha rede em'],
    pt:"A nossa cobertura actual é mais forte na região de Sofala. Com base na localização que indicou, vamos confirmar a disponibilidade de instalação para si.",
    en:"Our current coverage is strongest in the Sofala region. Based on the location you gave us, we'll confirm installation availability for you." },
];

function matchKB(text){
  const norm = normalize(text);
  for (const entry of KB){
    if (entry.keys.some(k => norm.includes(normalize(k)))){
      return entry;
    }
  }
  return null;
}

function waLink(data){
  const msg = `Olá MozSupport! Nome: ${data.name}. Localização: ${data.location}. Assunto: ${data.subject}. Mensagem: ${data.message}`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

function waButtonHTML(data){
  const label = isEnglish() ? 'Continue with a human agent →' : 'Continuar com um agente humano →';
  return `<a class="wa-btn" href="${waLink(data)}" target="_blank" rel="noopener">${label}</a>`;
}

/* ---------- conversation flow ---------- */
const chatData = { name:'', location:'', subject:'' };
let chatStep = 0;

const SUBJECT_OPTIONS = [
  { pt:'Suporte técnico', en:'Technical support' },
  { pt:'Internet / Instalação', en:'Internet / Installation' },
  { pt:'Segurança Electrónica', en:'Electronic Security' },
  { pt:'Facturação', en:'Billing' },
  { pt:'Sugestão', en:'Suggestion' },
  { pt:'Reclamação', en:'Complaint' },
];

function startChat(){
  chatStep = 0;
  chatData.name = ''; chatData.location = ''; chatData.subject = '';
  chatBody.innerHTML = '';
  clearQuick();
  botSay(
    'Olá! Sou o assistente virtual da MozSupport. Para começar, qual é o seu nome completo?',
    "Hi! I'm the MozSupport virtual assistant. To start, what's your full name?"
  );
  setInputEnabled(true, 'O seu nome completo...', 'Your full name...');
  chatStep = 1;
  chatInputField.focus();
}

function handleUserMessage(text){
  if (!text.trim()) return;

  if (chatStep === 1){
    userSay(text);
    chatData.name = text.trim();
    botSay(`Prazer, ${chatData.name}! Em que cidade ou zona está?`, `Nice to meet you, ${chatData.name}! What city or area are you in?`);
    setInputEnabled(true, 'A sua cidade / zona...', 'Your city / area...');
    chatStep = 2;
    return;
  }

  if (chatStep === 2){
    userSay(text);
    chatData.location = text.trim();
    botSay('Qual é o motivo do seu contacto?', 'What is the reason for your contact?');
    setInputEnabled(false, 'Escolha uma opção acima ↑', 'Choose an option above ↑');
    showQuick(SUBJECT_OPTIONS, (opt)=>{
      chatData.subject = isEnglish() ? opt.en : opt.pt;
      botSay(
        'Perfeito. Pode explicar, com as suas palavras, o que se passa ou o que precisa? Vou tentar ajudar já.',
        "Perfect. Can you explain, in your own words, what's going on or what you need? I'll try to help right away."
      );
      setInputEnabled(true, 'Escreva aqui a sua mensagem...', 'Write your message here...');
      chatStep = 3;
      chatInputField.focus();
    });
    return;
  }

  if (chatStep === 3 || chatStep === 4){
    userSay(text);
    chatData.message = text.trim();
    const hit = matchKB(text);
    if (hit){
      botSay(hit.pt, hit.en);
      botSayHTML(
        (isEnglish()
          ? 'Did this solve your issue? If not, or you\'d like to talk to someone directly:'
          : 'Isto resolveu o seu problema? Se não, ou preferir falar directamente com alguém:')
        + '<br>' + waButtonHTML(chatData)
      );
    } else {
      botSay(
        'Registei o seu pedido e vou encaminhá-lo para um técnico humano, que lhe responde em breve.',
        "I've logged your request and will forward it to a human technician, who will get back to you shortly."
      );
      botSayHTML(waButtonHTML(chatData));
    }
    setInputEnabled(true, 'Pode continuar a escrever...', 'You can keep writing...');
    chatStep = 4;
    return;
  }
}

if (chatSendBtn && chatInputField){
  chatSendBtn.addEventListener('click', ()=>{
    const val = chatInputField.value;
    chatInputField.value = '';
    handleUserMessage(val);
  });
  chatInputField.addEventListener('keydown', (e)=>{
    if (e.key === 'Enter' && !chatInputField.disabled){
      const val = chatInputField.value;
      chatInputField.value = '';
      handleUserMessage(val);
    }
  });
}
if (chatResetBtn){
  chatResetBtn.addEventListener('click', startChat);
}
