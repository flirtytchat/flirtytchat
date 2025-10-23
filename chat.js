// FlirtyTchat — Demo client-only chat with multi-room + selector
(function(){
  const $ = (sel)=>document.querySelector(sel);
  const messages = $('#messages');
  const input = $('#chatInput');
  const form = $('#chatForm');
  const typingState = $('#typingState');
  const usersList = $('#usersList');
  const connectedCount = $('#connectedCount');
  const roomTitle = $('#roomTitle');
  const roomSelect = $('#roomSelect');

  // ---- Rooms mapping
  const ROOMS = {
    // Regions
    IDF: 'Île‑de‑France', ARA: 'Auvergne‑Rhône‑Alpes', PACA: 'Provence‑Alpes‑Côte d’Azur',
    OCC: 'Occitanie', NAQ: 'Nouvelle‑Aquitaine', GES: 'Grand Est', HDF: 'Hauts‑de‑France',
    NOR: 'Normandie', BRE: 'Bretagne', BFC: 'Bourgogne‑Franche‑Comté', CVL: 'Centre‑Val de Loire',
    PDL: 'Pays de la Loire', COR: 'Corse', OM: 'Outre‑mer',
    // Themes
    COQ: 'Rencontre coquine soft', CAM: 'Cam 18+', DET: 'Détente & discussion',
    IRL: 'Rencontre réelle (IRL)', NEW: 'Nouveaux arrivants', NIGHT: 'Nuit chaude 🌙'
  };

  function getParam(name){
    const u = new URL(location.href);
    return u.searchParams.get(name);
  }
  function setParam(name, value){
    const u = new URL(location.href);
    u.searchParams.set(name, value);
    location.href = u.toString();
  }

  // Populate selector
  if(roomSelect){
    // Grouped options
    const groups = [
      ['Régions', ['IDF','ARA','PACA','OCC','NAQ','GES','HDF','NOR','BRE','BFC','CVL','PDL','COR','OM']],
      ['Thèmes',  ['COQ','CAM','DET','IRL','NEW','NIGHT']]
    ];
    groups.forEach(([label, codes])=>{
      const optgroup = document.createElement('optgroup');
      optgroup.label = label;
      codes.forEach(code=>{
        const opt = document.createElement('option');
        opt.value = code;
        opt.textContent = ROOMS[code];
        optgroup.appendChild(opt);
      });
      roomSelect.appendChild(optgroup);
    });
  }

  const roomCode = (getParam('room')||'IDF').toUpperCase();
  if(roomSelect){ roomSelect.value = roomCode; }
  const roomName = ROOMS[roomCode] || 'Salon public';
  roomTitle.textContent = 'Salon — ' + roomName;

  // Handle change
  if(roomSelect){
    roomSelect.addEventListener('change', ()=> setParam('room', roomSelect.value));
  }

  // -------- Utilities
  const nowTime = ()=> {
    const d = new Date();
    const h = String(d.getHours()).padStart(2,'0');
    const m = String(d.getMinutes()).padStart(2,'0');
    return h + ':' + m;
  };

  // Generate or read pseudo from localStorage
  function getPseudo(){
    const key = 'ft_pseudo';
    let p = localStorage.getItem(key);
    if(!p){
      const n = Math.floor(100 + Math.random()*900);
      p = 'Flirty_' + n;
      localStorage.setItem(key, p);
    }
    return p;
  }
  const pseudo = getPseudo();

  // Seed connected count and a small list
  function seedConnected(){
    const base = 8 + Math.floor(Math.random()*7); // 8-14
    connectedCount.textContent = base;
    const people = [
      'Alice • 24 • Paris', 'Max • 28 • 92', 'Léa • 26 • 69', 'Noah • 23 • 13'
    ];
    usersList.innerHTML = people.slice(0,3).map(p=>`<div class="user">${p}</div>`).join('')
      + `<div class="user">${pseudo} • 22 • 03</div>`;
  }
  seedConnected();

  // Seed welcome messages
  function seedMessages(){
    const welcome = [
      {a:'Alice', t:'Salut à tous 😄'},
      {a:'Max', t:`Bienvenue dans ${roomName} !`},
      {a:'Système', t:'Rappel : 18+, pas de liens, pas d'argent.'}
    ];
    welcome.forEach(m=> addMessage(m.a, m.t));
  }

  // Typing indicator (self demo)
  let typingTimer;
  input.addEventListener('input', ()=>{
    typingState.textContent = `${pseudo} est en train d'écrire…`;
    clearTimeout(typingTimer);
    typingTimer = setTimeout(()=> typingState.textContent = '', 1200);
  });

  // Forbidden filters
  const forbidden = new RegExp([
    '(?:https?:\\/\\/|www\\.|\\.(?:fr|com|net|io)\\b)',
    '(?:t\\.me|wa\\.me|instagram|snap|onlyfans|facebook|x\\.com|@)',
    '(?:\\b(?:€|eur|iban|paypal|revolut|tarif|prix|payer|cash|virement|booking)\\b)',
    '(?:escort|GFE|PSE|plan tarif|dodo contre)'
  ].join('|'), 'i');

  // Client-side rate limit: 1 message / 3s
  let lastSent = 0;

  function addMessage(author, text, mine=false){
    const card = document.createElement('div');
    card.className = 'msg' + (mine ? ' me' : '');
    card.innerHTML = `<strong>${author}</strong> <span class="meta">• ${nowTime()}</span><br>${escapeHtml(text)}`;
    messages.appendChild(card);
    messages.scrollTop = messages.scrollHeight;
  }

  function escapeHtml(s){
    return s.replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
  }

  seedMessages();

  form.addEventListener('submit', ()=>{
    const text = input.value.trim();
    if(!text) return;
    const now = Date.now();
    if(now - lastSent < 3000){
      alert('Trop rapide ! Merci d'attendre 3 secondes entre deux messages.');
      return;
    }
    if(forbidden.test(text)){
      alert('Message bloqué (mot/lien interdit). Règles : pas de liens, pas de'argent, pas de prostitution.');
      return;
    }
    lastSent = now;
    addMessage(pseudo, text, true);
    input.value='';
  });
})();