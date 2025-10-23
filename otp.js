// FlirtyTchat — OTP front (simulation)
(function(){
  const form = document.getElementById('quickAccessForm');
  const emailEl = document.getElementById('email');
  const pseudoEl = document.getElementById('pseudo');
  const otpArea = document.getElementById('otpArea');
  const otpInfo = document.getElementById('otpInfo');
  const otpCode = document.getElementById('otpCode');
  const verifyBtn = document.getElementById('verifyBtn');
  const resendBtn = document.getElementById('resendBtn');

  const LSK = {
    email:'ft_email',
    pseudo:'ft_pseudo',
    otp:'ft_otp',
    verified:'ft_verified_at'
  };

  function setLS(k,v){ localStorage.setItem(k, v); }
  function getLS(k){ return localStorage.getItem(k); }
  function now(){ return Date.now(); }

  function generateOTP(){
    return String(Math.floor(100000 + Math.random() * 900000));
  }

  function sendOTP(){
    const mail = emailEl.value.trim();
    const pseudo = pseudoEl.value.trim();
    if(!mail || !pseudo) return;
    // Save pseudo/email
    setLS(LSK.email, mail);
    setLS(LSK.pseudo, pseudo);
    // Generate and store
    const code = generateOTP();
    setLS(LSK.otp, JSON.stringify({code, at: now()}));
    otpArea.style.display = 'block';
    otpInfo.textContent = `Code envoyé à ${maskEmail(mail)} (démo : ${code}).`;
    // reset input
    otpCode.value='';
  }

  function maskEmail(m){
    const [u, d] = m.split('@');
    if(!d) return m;
    return u.slice(0,2) + '***@' + d;
  }

  function verifyOTP(){
    const raw = getLS(LSK.otp);
    const val = otpCode.value.trim();
    if(!raw){ alert('Aucun code actif. Clique sur “Renvoyer”.'); return; }
    let obj;
    try{ obj = JSON.parse(raw); } catch(e){ alert('Code invalide.'); return; }
    if(val !== obj.code){ alert('Mauvais code.'); return; }
    // 10 minutes validity in demo
    if(now() - obj.at > 10*60*1000){ alert('Code expiré. Renvoyer un nouveau code.'); return; }
    setLS(LSK.verified, String(now()));
    otpInfo.textContent = '✅ Adresse vérifiée. Bienvenue !';
    // Redirect to salons
    setTimeout(()=> location.href = 'rooms.html', 600);
  }

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    if(!form.checkValidity()) return;
    sendOTP();
  });
  verifyBtn.addEventListener('click', verifyOTP);
  resendBtn.addEventListener('click', sendOTP);

  // Prefill if user already verified
  const already = getLS(LSK.verified);
  if(already){
    otpArea.style.display = 'block';
    otpInfo.textContent = 'Ton email est déjà vérifié ✅ (tu peux continuer).';
  }
})();