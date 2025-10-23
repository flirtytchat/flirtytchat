// Prototype local (sans serveur). Remplacera plus tard par Socket.IO
(function(){
  const form = document.getElementById('chatForm');
  const input = document.getElementById('chatInput');
  const list = document.getElementById('messages');

  function addMessage(text, me=false){
    if(!text.trim()) return;
    // Filtres simples (anti-liens et argent) — même logique que sur la landing
    const forbidden = /(http|www\.|\.fr|\.com|t\.me|wa\.me|instagram|snap|onlyfans|\b(?:€|eur|iban|paypal|tarif|prix|payer|cash)\b)/i;
    if(forbidden.test(text)){
      alert('Message bloqué (mot ou lien interdit).');
      return;
    }
    const el = document.createElement('div');
    el.className = 'msg' + (me ? ' me' : '');
    el.innerHTML = (me ? '<strong>Moi:</strong> ' : '<strong>Inconnu:</strong> ') + text;
    list.appendChild(el);
    list.scrollTop = list.scrollHeight;
  }

  form.addEventListener('submit', () => {
    addMessage(input.value, true);
    input.value = '';
  });

  // Démo: message robot après 1,5s
  setTimeout(()=> addMessage('Bienvenue dans le salon ! Rappel: 18+, pas d\'argent, pas de liens.'), 1500);
})();