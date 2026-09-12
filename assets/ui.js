(function(){
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('js');
  // Reveal sections/cards as they enter the viewport.
  const revealables = document.querySelectorAll('section, .card, .step, .stage, .timeline article, .photo-panel, .video, footer');
  if(!prefersReduced && 'IntersectionObserver' in window){
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('is-visible'); io.unobserve(e.target); }});
    },{threshold:.12, rootMargin:'0px 0px -40px 0px'});
    revealables.forEach(el=>{el.classList.add('reveal'); io.observe(el);});
  }
  // Soft parallax on hero/photo panels.
  if(!prefersReduced){
    const panels=document.querySelectorAll('.hero, .photo-panel, .factory');
    let ticking=false;
    const parallax=()=>{
      const y=window.scrollY;
      panels.forEach((el)=>{ const r=el.getBoundingClientRect(); if(r.bottom>0&&r.top<innerHeight){ const shift=(r.top-innerHeight/2)*-0.035; el.style.setProperty('--parallax', shift.toFixed(1)+'px'); }});
      ticking=false;
    };
    addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(parallax);ticking=true;}},{passive:true});
    parallax();
  }
  // Falling tea leaves while scrolling.
  let leafCooldown=0;
  function spawnLeaf(){
    if(prefersReduced || Date.now()-leafCooldown<90) return;
    leafCooldown=Date.now();
    const leaf=document.createElement('span'); leaf.className='falling-leaf';
    leaf.textContent='🍃';
    leaf.style.left=(8+Math.random()*84)+'vw';
    leaf.style.fontSize=(12+Math.random()*14)+'px';
    leaf.style.setProperty('--dur',(2.8+Math.random()*2.6)+'s');
    leaf.style.setProperty('--drift',(Math.random()*160-80)+'px');
    document.body.appendChild(leaf);
    setTimeout(()=>leaf.remove(),6200);
  }
  addEventListener('scroll',spawnLeaf,{passive:true});
  // Page-to-page fade transition. Use View Transitions when available.
  if(!prefersReduced){
    document.querySelectorAll('a[href$=".html"]').forEach(a=>{
      a.addEventListener('click',e=>{
        const href=a.href;
        if(href && new URL(href).origin===location.origin){
          e.preventDefault(); document.body.classList.add('page-leaving');
          if(document.startViewTransition){ document.startViewTransition(()=>location.href=href); }
          else setTimeout(()=>location.href=href,260);
        }
      });
    });
  }
})();
