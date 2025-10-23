// FlirtyTchat — Demo client-only chat logic
(function(){
  const $ = (sel)=>document.querySelector(sel);
  const messages = $('#messages');
  const input = $('#chatInput');
  const form = $('#chatForm');
  const typingState = $('#typingState');
  const meTag = $('#meTag');
  const usersList = $('#usersList');
  const connectedCount = $('#connectedCount');

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
  meTag.textContent = `(tu es connecté en tant que ${pseudo})`;

  // Seed "connected" count and list
  function seedConnected(){
    const base = 7 + Math.floor(Math.random()*6); // 7-12
    connectedCount.textContent = base;
    // Add "me" entry
    const meDiv = document.createElement('div');
    meDiv.className = 'user';
    meDiv.textContent = `${pseudo} • 22 • 03`;
    usersList.appendChild(meDiv);
  }
  seedConnected();

  // Typing indicator (simulated other user)
  let typingTimer;
  input.addEventListener('input', ()=>{
    typingState.textContent = `${pseudo} est en train d'écrire…`;
    clearTimeout(typingTimer);
    typingTimer = setTimeout(()=> typingState.textContent = '', 1200);
  });

  // Stronger forbidden filters
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

  // Welcome line for me
  setTimeout(()=> addMessage('Système', `Bienvenue ${pseudo} ! Rappel : 18+, pas de liens, pas d'argent.`), 800);

  form.addEventListener('submit', ()=>{
    const text = input.value.trim();
    if(!text) return;
    // rate limit
    const now = Date.now();
    if(now - lastSent < 3000){
      alert('Trop rapide ! Merci d'attendre 3 secondes entre deux messages.');
      return;
    }
    // filter
    if(forbidden.test(text)){
      alert('Message bloqué (mot/lien interdit). Règles : pas de liens, pas d'argent, pas de prostitution.');
      return;
    }
    lastSent = now;
    addMessage(pseudo, text, true);
    input.value='';
    // Simulate reply from Alice
    setTimeout(()=> addMessage('Alice', '😉'), 1000);
  });
})();