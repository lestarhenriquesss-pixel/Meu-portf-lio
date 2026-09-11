/* Premium motion layer. No dependencies, no scroll interception and no forced autoplay video. */
window.PortfolioExperience = (() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const html = document.documentElement;
  const core = window.PortfolioMotionCore;
  const finePointer = matchMedia('(hover:hover) and (pointer:fine)');
  function init(motion, projects) {
    const settings = JSON.parse($('#experienceData').textContent);
    function safely(name, fn) { try { fn(); } catch (e) { console.warn(`[Portfólio] ${name}:`, e); } }
    safely('vitrine editorial', () => story(motion, projects, settings));
    safely('fundo procedural', () => ambient(motion));
    safely('texto em rolagem', () => textScrub(motion));
    safely('resposta ao ponteiro', () => interactions(motion));
    safely('acordeões', () => accordions(motion));
    const visibility = () => html.classList.toggle('tab-hidden', document.hidden);
    document.addEventListener('visibilitychange', visibility); visibility();
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => entries.forEach(e => e.target.classList.toggle('offscreen-motion', !e.isIntersecting)));
      $$('.tech-marquee,.contact-section,.portrait-composition,.manifesto,.hero-signature').forEach(el=>observer.observe(el));
    }
  }
  function story(motion, projects, settings) {
    const selected = settings.selected.map(id => projects.find(p=>p.id===id)).filter(Boolean);
    const section = $('#storySection'), pin = $('.story-pin'), stage = $('#storyStage');
    const tabs = $$('[data-story-index]');
    const media = matchMedia('(min-width:1101px) and (min-height:740px)');
    let current = -1, frame = 0, start = 0, height = 0, offset = 0, pinHeight = 0;
    const pinned = () => media.matches && !motion.reduced;
    html.classList.add('has-story');
    function render(index, manual=false) {
      index = (index+selected.length)%selected.length;
      if (index === current) return;
      const first = current === -1;
      current = index;
      const p = selected[index];
      $('#storyNumber').textContent = String(index+1).padStart(2,'0');
      $('#storyClient').textContent = p.client;
      $('#storyTitle').textContent = p.title;
      $('#storySummary').textContent = p.summary;
      $('#storyCategory').textContent = p.categoryLabel.toUpperCase();
      $('#storyMedium').textContent = p.video ? 'Demonstração em vídeo' : p.category==='aplicacao' ? 'Aplicação para a operação' : 'Dashboard interativo';
      $('#storyImage').src = p.preview;
      $('#storyImage').alt = `Tela real do projeto ${p.title}`;
      ['#storyOpen','#storyImageLink'].forEach(s=>{
        const a=$(s);a.href=`#caso-${p.id}`;a.dataset.openProject=p.id;
      });
      $('#storyImageLink').setAttribute('aria-label', `Abrir detalhes de ${p.title}`);
      $('#storyTags').replaceChildren(...p.labels.map(label=>{const s=document.createElement('span');s.textContent=label;return s;}));
      tabs.forEach((t,i)=>t.setAttribute('aria-pressed',String(i===index)));
      if (!motion.reduced && !first) { stage.classList.remove('is-changing'); void stage.offsetWidth; stage.classList.add('is-changing'); }
      if (manual) $('#storyStatus').textContent = `Projeto ${index+1} de ${selected.length}: ${p.title}`;
    }
    function measure() {
      if (pinned()) {
        const available = Math.min(1180, innerHeight - parseFloat(getComputedStyle(html).getPropertyValue('--header-h')) - 25);
        section.style.setProperty('--story-height', `${available + selected.length * innerHeight * .57}px`);
      } else section.style.removeProperty('--story-height');
      start = section.getBoundingClientRect().top + scrollY;
      height = section.offsetHeight;
      offset = parseFloat(getComputedStyle(pin).top) || 0;
      pinHeight = pin.offsetHeight;
    }
    function update() {
      frame=0;
      if (!pinned() || document.body.classList.contains('modal-open')) return;
      const top = section.getBoundingClientRect().top;
      // Re-read offset after dynamic content changes; catalog pagination cannot corrupt the geometry.
      start = top + scrollY;
      if (top <= offset+2 && top >= -height+pinHeight-2) {
        render(core.stepIndex(core.scrollProgress(scrollY,start,height,pinHeight+offset,offset), selected.length));
      }
    }
    const queue=()=>{if(!frame) frame=requestAnimationFrame(update);};
    function select(index) {
      index=(index+selected.length)%selected.length;
      if (pinned()) {
        measure();
        const target = core.stepPosition(index,selected.length,start,height,pinHeight+offset,offset);
        window.scrollTo({top:target,behavior:'smooth'});
        // The animation follows the actual scroll, avoiding desynchronised labels.
      } else render(index,true);
      $('#storyStatus').textContent=`Projeto ${index+1} de ${selected.length}: ${selected[index].title}`;
      const list=$('.story-tabs'), tab=tabs[index];
      if(list.scrollWidth>list.clientWidth) list.scrollTo({left:tab.offsetLeft-list.offsetLeft-16,behavior:motion.reduced?'instant':'smooth'});
    }
    tabs.forEach((t,i)=>t.addEventListener('click',()=>select(i)));
    $('#storyPrev').addEventListener('click',()=>select(current-1));
    $('#storyNext').addEventListener('click',()=>select(current+1));
    $('.story-tabs').addEventListener('keydown',e=>{
      if(!['ArrowRight','ArrowLeft','Home','End'].includes(e.key))return;
      e.preventDefault();
      const target=e.key==='Home'?0:e.key==='End'?selected.length-1:(current+(e.key==='ArrowRight'?1:-1)+selected.length)%selected.length;
      tabs[target].focus({preventScroll:true});select(target);
    });
    swipe($('#storyImageLink'), delta=>select(current+delta));
    window.addEventListener('scroll',queue,{passive:true});
    window.addEventListener('resize',()=>{measure();queue();},{passive:true});
    media.addEventListener('change',()=>{measure();queue();});
    motion.subscribe(()=>{measure();stage.classList.remove('is-changing');queue();});
    // Images/fonts settling can change the section's absolute position.
    window.addEventListener('load',()=>{measure();queue();});
    render(0); measure(); queue();
  }
  function ambient(motion) {
    const canvas=$('#ambientCanvas'), hero=$('.hero'), ctx=canvas.getContext('2d',{alpha:true});
    if(!ctx)return;
    let w=1,h=1,dpr=1,raf=0,previous=0,clock=0,visible=true,px=0,py=0,tx=0,ty=0;
    function draw(t) {
      ctx.clearRect(0,0,w,h);
      const mobile=w<800;
      const cx=w*(mobile?.67:.83)+px*17, cy=h*(mobile?.73:.50)+py*12;
      const radius=Math.min(w*(mobile?.57:.37),770);
      const lines=mobile?20:38, segments=mobile?80:124;
      ctx.lineWidth=.72;
      for(let j=0;j<lines;j++) {
        const r=radius+(j-lines/2)*4.7;
        ctx.beginPath();
        for(let k=0;k<=segments;k++) {
          const a=k/segments*Math.PI*2;
          const wave=1+.083*Math.sin(a*3+t*.22+j*.072);
          const x=cx+Math.cos(a)*r*wave;
          const y=cy+Math.sin(a)*r*.72*wave+Math.cos(a*2+t*.17)*r*.06;
          if(k===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
        }
        const alpha=.07+.12*(Math.sin(j*.20+t*.22)+1)/2;
        ctx.strokeStyle=`rgba(132,150,255,${alpha})`;ctx.stroke();
      }
      // Slower traveling points emphasize the data paths, without a particle storm.
      for(let i=0;i<7;i++) {
        const a=t*.075+i*.91;
        const x=cx+Math.cos(a)*radius,y=cy+Math.sin(a)*radius*.72;
        ctx.beginPath();ctx.arc(x,y,i%2?1.6:2.3,0,Math.PI*2);
        ctx.fillStyle=i%2?'#a3acffa0':'#ffc39eaa';ctx.fill();
      }
    }
    function stop(){cancelAnimationFrame(raf);raf=0;previous=0;}
    function canPlay(){return !document.hidden&&visible;}
    function frame(now){
      raf=0;if(!canPlay()){previous=0;return;}
      if(!previous)previous=now;
      if(now-previous>=32){clock+=Math.min(now-previous,80)/1000;previous=now;px+=(tx-px)*.08;py+=(ty-py)*.08;draw(clock);}
      raf=requestAnimationFrame(frame);
    }
    function run(){if(!canPlay()){stop();return;}if(!raf)raf=requestAnimationFrame(frame);}
    function resize(){
      const r=canvas.getBoundingClientRect();w=r.width;h=r.height;dpr=Math.min(devicePixelRatio||1,1.5);
      canvas.width=Math.max(1,Math.round(w*dpr));canvas.height=Math.max(1,Math.round(h*dpr));ctx.setTransform(dpr,0,0,dpr,0,0);draw(clock);
    }
    if('ResizeObserver' in window)new ResizeObserver(resize).observe(hero);else addEventListener('resize',resize,{passive:true});
    hero.addEventListener('pointermove',e=>{if(!finePointer.matches||motion.reduced)return;tx=e.clientX/innerWidth-.5;ty=e.clientY/innerHeight-.5;},{passive:true});
    hero.addEventListener('pointerleave',()=>{tx=0;ty=0;});
    if('IntersectionObserver' in window)new IntersectionObserver(es=>{visible=es[0].isIntersecting;run();}).observe(hero);
    document.addEventListener('visibilitychange',run);
    motion.subscribe(()=>{run();if(motion.reduced){tx=ty=px=py=0;draw(clock);}});
    resize();run();
  }
  function textScrub(motion) {
    const heading=$('[data-scrub-text]'), section=$('.manifesto'), process=$('.process-grid');
    const words=heading.textContent.trim().split(/\s+/);
    heading.setAttribute('aria-label',words.join(' '));
    heading.replaceChildren(...words.flatMap((word,i)=>{
      const span=document.createElement('span');span.className='scrub-word';span.setAttribute('aria-hidden','true');span.textContent=word;
      return i===words.length-1?[span]:[span,document.createTextNode(' ')];
    }));
    const spans=[...heading.children];let raf=0;
    function update(){
      raf=0;
      if(motion.reduced){spans.forEach(s=>s.classList.add('is-lit'));process.style.setProperty('--process-progress','1');return;}
      const rect=heading.getBoundingClientRect();
      const fraction=core.clamp((innerHeight*.82-rect.top)/Math.min(innerHeight*.7,rect.height+innerHeight*.25));
      spans.forEach((s,i)=>s.classList.toggle('is-lit',fraction>=(i+.25)/spans.length));
      const p=process.getBoundingClientRect();
      process.style.setProperty('--process-progress',core.clamp((innerHeight*.85-p.top)/(innerHeight*.7)).toFixed(3));
    }
    const schedule=()=>{if(!raf)raf=requestAnimationFrame(update);};
    addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule,{passive:true});motion.subscribe(schedule);update();
  }
  function interactions(motion) {
    const surface = $('#showcase'), frame = $('#showcaseSheet');
    if (surface && frame) {
      surface.addEventListener('pointermove', event => {
        if (!finePointer.matches || motion.reduced) return;
        const r = surface.getBoundingClientRect();
        frame.style.setProperty('--tilt-x', `${core.clamp((.5-(event.clientY-r.top)/r.height)*4,-2,2)}deg`);
        frame.style.setProperty('--tilt-y', `${core.clamp(((event.clientX-r.left)/r.width-.5)*5,-2.5,2.5)}deg`);
      }, {passive:true});
      surface.addEventListener('pointerleave', () => {
        frame.style.removeProperty('--tilt-x'); frame.style.removeProperty('--tilt-y');
      });
    }
    $$('[data-magnetic]').forEach(el=>{
      el.addEventListener('pointermove',e=>{
        if(motion.reduced||!finePointer.matches)return;
        const r=el.getBoundingClientRect();
        el.style.translate=`${core.clamp((e.clientX-r.left-r.width/2)*.045,-5,5)}px ${core.clamp((e.clientY-r.top-r.height/2)*.06,-4,4)}px`;
      },{passive:true});
      const clear=()=>el.style.removeProperty('translate');
      el.addEventListener('pointerleave',clear);motion.subscribe(clear);
    });
    $$('.catalog-card').forEach(el=>{
      let frame=0,x=0,y=0;
      el.addEventListener('pointermove',e=>{
        if(motion.reduced||!finePointer.matches)return;
        x=e.clientX;y=e.clientY;if(frame)return;
        frame=requestAnimationFrame(()=>{frame=0;const r=el.getBoundingClientRect();el.style.setProperty('--mx',`${x-r.left}px`);el.style.setProperty('--my',`${y-r.top}px`);});
      },{passive:true});
    });
  }
  function accordions(motion) {
    $$('.expertise-item').forEach(el=>{
      const summary=el.querySelector('summary');let animation=null,opening=false;
      summary.addEventListener('click',event=>{
        if(motion.reduced||!el.animate)return;
        event.preventDefault();
        const start=el.getBoundingClientRect().height;
        const targetOpen=animation?!opening:!el.open;
        if(animation)animation.cancel();
        animation=null;opening=targetOpen;
        el.style.height='';el.open=true;
        const end=targetOpen?el.scrollHeight:summary.offsetHeight;
        el.style.height=`${start}px`;
        animation=el.animate({height:[`${start}px`,`${end}px`]}, {duration:360,easing:'cubic-bezier(.22,1,.36,1)'});
        animation.onfinish=()=>{el.open=targetOpen;el.style.height='';animation=null;};
        animation.oncancel=()=>{el.style.height='';};
      });
      motion.subscribe(()=>{if(animation){animation.cancel();animation=null;el.open=opening;el.style.height='';}});
    });
  }
  function swipe(el, action) {
    let start=null,suppress=false;
    el.addEventListener('touchstart',e=>{if(e.touches.length===1)start={x:e.touches[0].clientX,y:e.touches[0].clientY};},{passive:true});
    el.addEventListener('touchend',e=>{
      if(!start||!e.changedTouches.length)return;
      const dx=e.changedTouches[0].clientX-start.x,dy=e.changedTouches[0].clientY-start.y;start=null;
      if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.5){suppress=true;action(dx<0?1:-1);setTimeout(()=>{suppress=false;},500);}
    },{passive:true});
    el.addEventListener('click',e=>{if(suppress){e.preventDefault();e.stopPropagation();suppress=false;}},true);
  }
  return Object.freeze({init,swipe});
})();
