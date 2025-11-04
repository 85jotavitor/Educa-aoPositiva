
document.addEventListener('DOMContentLoaded', () => {
  const conteudo = document.querySelector('#conteudo');
  const remotePages = ['index.html','sobre.html','projetos.html','contato.html'];
  // theme toggles
  const setTheme = (t) => { document.documentElement.setAttribute('data-theme', t); localStorage.setItem('theme', t); };
  const saved = localStorage.getItem('theme'); if(saved) setTheme(saved);
  const bt = document.getElementById('toggleTheme'); const hc = document.getElementById('highContrast');
  if(bt) bt.addEventListener('click', ()=> { const cur = document.documentElement.getAttribute('data-theme') || 'default'; setTheme(cur==='dark' ? 'default' : 'dark'); bt.setAttribute('aria-pressed', document.documentElement.getAttribute('data-theme')==='dark'); });
  if(hc) hc.addEventListener('click', ()=> { const cur = document.documentElement.getAttribute('data-theme') || 'default'; setTheme(cur==='hc' ? 'default' : 'hc'); hc.setAttribute('aria-pressed', document.documentElement.getAttribute('data-theme')==='hc'); });

  // load initial content (index main is here, but we keep SPA behavior)
  // attach click handler for data-link
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-link]');
    if(!a) return;
    e.preventDefault();
    const href = a.getAttribute('href');
    fetch(href).then(r=>r.text()).then(html=>{
      const doc = new DOMParser().parseFromString(html,'text/html');
      const main = doc.querySelector('main');
      if(main){
        conteudo.innerHTML = main.innerHTML;
        if(window.runAfterLoad) window.runAfterLoad();
      }
      const navToggle = document.querySelector('.nav-toggle');
      if(navToggle && navToggle.checked) navToggle.checked = false;
    }).catch(()=>{ conteudo.innerHTML = '<p>Erro ao carregar o conteúdo.</p>'; });
  });

  // accessibility: close menus on Escape
  document.addEventListener('keydown', (e) => { if(e.key==='Escape'){ const navToggle = document.querySelector('.nav-toggle'); if(navToggle && navToggle.checked) navToggle.checked=false; }});

  // runAfterLoad for forms etc.
  window.runAfterLoad = function(){
    const form = document.getElementById('formContato');
    const aviso = document.getElementById('aviso');
    if(!form) return;
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const nome = form.nome.value.trim();
      const email = form.email.value.trim();
      const msg = form.mensagem.value.trim();
      const errors = [];
      if(nome.length < 3) errors.push('Nome precisa ter ao menos 3 caracteres.');
      if(!email.includes('@')) errors.push('E-mail inválido.');
      if(msg.length < 5) errors.push('Mensagem muito curta.');
      if(errors.length){ aviso.innerHTML = '<ul>' + errors.map(x=>'<li>'+x+'</li>').join('') + '</ul>'; return; }
      aviso.innerHTML = '<p>Mensagem enviada com sucesso! Obrigado.</p>';
      form.reset();
    });
  };
});
