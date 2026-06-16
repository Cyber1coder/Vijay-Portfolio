/* ============ RULER TICKS (timecode) ============ */
(function buildRulerCodes(){
  const ruler = document.querySelector('.ruler');
  if(!ruler) return;
  const span = document.createElement('div');
  span.style.cssText = 'position:absolute;inset:0;display:flex;justify-content:space-around;align-items:flex-end;padding:0 8px 4px;font-family:"JetBrains Mono",monospace;font-size:.6rem;color:rgba(255,255,255,.35);';
  for(let i=0;i<10;i++){
    const t = document.createElement('span');
    t.textContent = `00:${String(i*6).padStart(2,'0')}:00`;
    span.appendChild(t);
  }
  ruler.appendChild(span);
})();

/* ============ HORIZONTAL TIMELINE: WHEEL → SCROLL X ============ */
const tScroll = document.getElementById('timelineScroll');
if(tScroll){
  tScroll.addEventListener('wheel', e => {
    if(Math.abs(e.deltaY) > Math.abs(e.deltaX)){
      e.preventDefault();
      tScroll.scrollLeft += e.deltaY;
    }
  }, {passive:false});

  /* drag-to-scrub */
  let isDown=false,startX=0,startLeft=0;
  tScroll.addEventListener('pointerdown', e=>{
    isDown=true;startX=e.pageX;startLeft=tScroll.scrollLeft;
    tScroll.style.cursor='grabbing';
  });
  window.addEventListener('pointerup', ()=>{isDown=false;tScroll.style.cursor=''});
  window.addEventListener('pointermove', e=>{
    if(!isDown) return;
    tScroll.scrollLeft = startLeft - (e.pageX - startX);
  });

  /* scrub progress bar follows scroll */
  const progress = document.getElementById('scrubProgress');
  tScroll.addEventListener('scroll', ()=>{
    const max = tScroll.scrollWidth - tScroll.clientWidth;
    const pct = max > 0 ? (tScroll.scrollLeft / max) * 100 : 0;
    progress.style.width = pct + '%';
  });
}

/* ============ HOVER PREVIEW (project clips) ============ */
const preview = document.getElementById('preview');
document.querySelectorAll('.proj-clip').forEach(clip=>{
  const img = clip.dataset.img;
  if(!img) return;
  clip.addEventListener('mouseenter', ()=>{
    preview.style.backgroundImage = `url(${img})`;
    preview.classList.add('show');
  });
  clip.addEventListener('mousemove', e=>{
    const x = Math.min(e.clientX + 16, window.innerWidth - 260);
    const y = Math.min(e.clientY + 16, window.innerHeight - 160);
    preview.style.left = x + 'px';
    preview.style.top  = y + 'px';
  });
  clip.addEventListener('mouseleave', ()=>preview.classList.remove('show'));
  clip.addEventListener('click', ()=>{
    const name = clip.querySelector('.cname')?.textContent || 'Clip';
    alert(`▶ Now playing: ${name}`);
  });
});

/* ============ SMOOTH SCROLL ============ */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const id = a.getAttribute('href');
    if(id.length>1){
      const el = document.querySelector(id);
      if(el){e.preventDefault();el.scrollIntoView({behavior:'smooth',block:'start'})}
    }
  });
});

/* ============ CONTACT FORM ============ */
const form = document.getElementById('contactForm');
form?.addEventListener('submit', e=>{
  e.preventDefault();
  const n = document.getElementById('cname').value.trim();
  const m = document.getElementById('cmail').value.trim();
  const b = document.getElementById('cmsg').value.trim();
  if(!n||!m||!b){alert('All fields required.');return;}
  alert(`▶ Transmission sent. Talk soon, ${n}.`);
  form.reset();
});
