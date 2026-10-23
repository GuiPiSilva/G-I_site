(()=>{
  'use strict';
  const root=document.documentElement;
  const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const overlay=document.getElementById('intro-overlay');
  const skip=document.querySelector('.intro-skip');
  let done=false,loadFrame=0,finishTimer=0;
  const finishIntro=()=>{
    if(done)return;
    done=true;
    cancelAnimationFrame(loadFrame);
    clearTimeout(finishTimer);
    root.classList.add('site-ready');
    overlay.classList.add('is-exiting');
    overlay.setAttribute('aria-hidden','true');
    window.setTimeout(()=>{overlay.classList.add('is-gone');overlay.remove()},1000);
  };
  if(reduceMotion){overlay.remove();root.classList.add('site-ready');}
  else{
    document.querySelectorAll('.intro-logo-svg .logo-trace').forEach(path=>{
      try{path.style.setProperty('--length',String(Math.ceil(path.getTotalLength()+10)))}catch(e){}
    });
    const bar=document.querySelector('.intro-load-bar');
    const percent=document.querySelector('.intro-percent');
    const start=performance.now(),duration=2350;
    const animateProgress=(time)=>{
      if(done)return;
      const p=Math.min(1,(time-start)/duration);
      const eased=1-Math.pow(1-p,2.5);
      bar.style.width=(eased*100).toFixed(1)+'%';
      percent.textContent=String(Math.round(eased*100)).padStart(2,'0')+'%';
      if(p<1)loadFrame=requestAnimationFrame(animateProgress);else finishIntro();
    };
    loadFrame=requestAnimationFrame(animateProgress);
    finishTimer=setTimeout(finishIntro,3800); // fail-safe if frame updates stall
    skip.addEventListener('click',finishIntro);
    addEventListener('keydown',e=>{if(e.key==='Escape'&&!done)finishIntro()});
  }

  const progress=document.querySelector('.progress');
  const hero=document.querySelector('.hero');
  let ticking=false;
  const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
  const foundersPhoto=document.querySelector('.founders-photo');
  const manifesto=document.querySelector('.manifesto');
  const footer=document.querySelector('.footer');
  const sectionReadout=document.querySelector('.rail-num');
  const bodySections=[hero,...document.querySelectorAll('[data-scroll-section]')];
  const tiles=[...document.querySelectorAll('[data-kinetic-tile]')];
  let priorY=0, priorT=performance.now();
  const updateScroll=()=>{
    const y=scrollY, h=innerHeight;
    const max=Math.max(1,document.documentElement.scrollHeight-h);
    const pageRatio=clamp(y/max,0,1);
    progress.style.width=(pageRatio*100).toFixed(3)+'%';
    root.style.setProperty('--page-progress',pageRatio.toFixed(4));
    if(!reduceMotion){
      const now=performance.now(), dt=Math.max(16,now-priorT);
      const velocity=clamp(Math.abs(y-priorY)/dt,0,2.4);
      root.style.setProperty('--scroll-speed',velocity.toFixed(3));
      document.querySelector('.ticker-track').style.setProperty('--ticker-speed',(24/(1+velocity*.2)).toFixed(2)+'s');
      const heroProgress=clamp(y/Math.max(1,hero.offsetHeight),0,1);
      hero.style.setProperty('--hero-shift',(Math.min(y,h)*.12).toFixed(1)+'px');
      hero.style.setProperty('--hero-progress',heroProgress.toFixed(3));
      if(foundersPhoto){
        const r=foundersPhoto.getBoundingClientRect();
        const p=clamp((h-r.top)/(h+r.height),0,1);
        foundersPhoto.style.setProperty('--photo-y',((.5-p)*60).toFixed(1)+'px');
      }
      tiles.forEach((tile,i)=>{
        const r=tile.getBoundingClientRect();
        if(r.top<h+150&&r.bottom>-150){
          const p=clamp((h-r.top)/(h+r.height),0,1);
          tile.style.setProperty('--kinetic-y',((.5-p)*(i%2===0?35:-32)).toFixed(2)+'px');
          tile.style.setProperty('--kinetic-rotate',((p-.5)*(i===1?10:-7)).toFixed(2)+'deg');
        }
      });
      if(manifesto){const r=manifesto.getBoundingClientRect();const p=clamp((h-r.top)/(h+r.height),0,1);manifesto.style.setProperty('--manifesto-rotation',(p*130).toFixed(1)+'deg')}
      if(footer){const r=footer.getBoundingClientRect();const p=clamp((h-r.top)/(h+r.height),0,1);footer.style.setProperty('--footer-shift',((p-.5)*25).toFixed(1)+'px')}
      priorY=y;priorT=now;
    }
    let active=0;
    for(let i=0;i<bodySections.length;i++)if(bodySections[i].getBoundingClientRect().top<h*.46)active=i;
    sectionReadout.textContent=String(active+1).padStart(2,'0');
    ticking=false;
  };
  const requestScroll=()=>{if(!ticking){ticking=true;requestAnimationFrame(updateScroll)}};
  addEventListener('scroll',requestScroll,{passive:true});
  addEventListener('resize',requestScroll,{passive:true});
  updateScroll();

  const button=document.querySelector('.menu-button'),menu=document.querySelector('.mobile-menu');
  const close=()=>{document.body.classList.remove('menu-open');menu.classList.remove('is-open');button.setAttribute('aria-expanded','false');button.setAttribute('aria-label','Abrir menu');menu.inert=true};
  button.addEventListener('click',()=>{if(menu.classList.contains('is-open')){close();return}document.body.classList.add('menu-open');menu.classList.add('is-open');menu.inert=false;button.setAttribute('aria-expanded','true');button.setAttribute('aria-label','Fechar menu')});
  menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
  addEventListener('keydown',e=>{if(e.key==='Escape')close()});

  const revealEls=[...document.querySelectorAll('.reveal')];
  revealEls.forEach((el,i)=>el.style.setProperty('--reveal-delay',Math.min((i%4)*75,225)+'ms'));
  if('IntersectionObserver'in window&&!reduceMotion){
    const obs=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');obs.unobserve(entry.target)}})},{threshold:.06,rootMargin:'0px 0px 60px 0px'});
    revealEls.forEach(el=>obs.observe(el));
  }else revealEls.forEach(el=>el.classList.add('in-view'));
  const photo=document.querySelector('[data-photo-reveal]');
  if(photo){
    if('IntersectionObserver'in window&&!reduceMotion){
      const photoObs=new IntersectionObserver(entries=>{
        for(const e of entries)if(e.isIntersecting){e.target.classList.add('photo-in-view');photoObs.disconnect()}
      },{threshold:.12});photoObs.observe(photo);
    }else photo.classList.add('photo-in-view');
  }

  // WhatsApp oficial da G&I Agência.
  const CONTACT_WHATSAPP='5511921211397';
  const contactButton=document.querySelector('[data-contact-channel="whatsapp"]');
  if(contactButton&&/^55\d{10,11}$/.test(CONTACT_WHATSAPP)){
    const msg='Olá! Vim pelo site da G&I Agência e gostaria de conversar sobre um projeto.';
    contactButton.href='https://wa.me/'+CONTACT_WHATSAPP+'?text='+encodeURIComponent(msg);
    contactButton.textContent='CHAMAR NO WHATSAPP ↗';
    contactButton.setAttribute('aria-label','Conversar com a G&I pelo WhatsApp');
    document.querySelectorAll('[data-direct-contact]').forEach(a=>{a.href=contactButton.href;a.target='_blank';a.rel='noopener noreferrer'});
  } else if(contactButton){
    contactButton.href='https://www.instagram.com/lime.next_/'; // destino temporário até confirmação do número
    contactButton.target='_blank';contactButton.rel='noopener noreferrer';
    contactButton.innerHTML='CHAMAR NO INSTAGRAM <span aria-hidden="true">↗</span>';
    contactButton.setAttribute('aria-label','Contato pelo Instagram provisório. WhatsApp aguardando configuração.');
  }

  if(!reduceMotion&&matchMedia('(hover: hover) and (pointer: fine)').matches){
    document.querySelectorAll('.service-item').forEach(item=>item.addEventListener('pointermove',e=>{
      const r=item.getBoundingClientRect();
      item.style.setProperty('--mx',e.clientX-r.left+'px');
      item.style.setProperty('--my',e.clientY-r.top+'px');
    },{passive:true}));
    document.querySelectorAll('.magnetic').forEach(link=>{
      link.addEventListener('pointermove',e=>{
        const r=link.getBoundingClientRect();
        const x=(e.clientX-r.left-r.width/2)*.12;
        const y=(e.clientY-r.top-r.height/2)*.12;
        link.style.translate=x+'px '+y+'px';
      },{passive:true});
      link.addEventListener('pointerleave',()=>{link.style.translate='0 0'});
    });
  }
  document.getElementById('year').textContent=new Date().getFullYear();
})();
