/* ─── SHARED COMPONENTS ─── */

/* Nav & Mobile Menu */
(function(){
  const nav = document.querySelector('.site-nav');
  const toggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.querySelector('.nav-mobile');
  const closeBtn = document.querySelector('.nav-close');

  if(nav){
    // If nav already has 'scrolled' in HTML (inner pages), lock it — never go transparent
    const alwaysScrolled = nav.classList.contains('scrolled');
    if(!alwaysScrolled){
      window.addEventListener('scroll',()=>{
        nav.classList.toggle('scrolled', window.scrollY > 60);
      });
    }
  }

  // Mobile menu open/close
  if(toggle && mobileMenu){
    toggle.addEventListener('click',()=>{
      mobileMenu.classList.add('open');
      toggle.setAttribute('aria-expanded','true');
      document.body.style.overflow='hidden';
    });
    const closeMobile = ()=>{
      mobileMenu.classList.remove('open');
      toggle.setAttribute('aria-expanded','false');
      document.body.style.overflow='';
    };
    if(closeBtn) closeBtn.addEventListener('click', closeMobile);
    mobileMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click', closeMobile));
    // Close on backdrop click
    mobileMenu.addEventListener('click',(e)=>{ if(e.target===mobileMenu) closeMobile(); });
  }

  // Active nav link highlight
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(a=>{
    const href = a.getAttribute('href');
    if(href === currentPage || (currentPage==='' && href==='index.html')) a.classList.add('active');
  });
})();

/* Hero Slider */
(function(){
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  if(!slides.length) return;
  let cur = 0, timer;

  function goTo(i){
    slides[cur].classList.remove('active');
    dots[cur]?.classList.remove('active');
    cur = (i + slides.length) % slides.length;
    slides[cur].classList.add('active');
    dots[cur]?.classList.add('active');
    resetTimer();
  }

  function resetTimer(){
    clearInterval(timer);
    timer = setInterval(()=>goTo(cur+1), 5500);
  }

  dots.forEach((d,i)=>d.addEventListener('click',()=>goTo(i)));
  slides[0].classList.add('active');
  dots[0]?.classList.add('active');
  resetTimer();
})();

/* Counter Animation */
(function(){
  const counters = document.querySelectorAll('.counter-num');
  if(!counters.length) return;
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.target;
      const dur = 1800;
      const step = target / (dur / 16);
      let cur = 0;
      const tick = setInterval(()=>{
        cur = Math.min(cur + step, target);
        el.textContent = Math.floor(cur).toLocaleString('en-IN') + (el.dataset.suffix||'');
        if(cur >= target) clearInterval(tick);
      }, 16);
      obs.unobserve(el);
    });
  },{threshold:.3});
  counters.forEach(c=>obs.observe(c));
})();

/* Scroll Reveal */
(function(){
  const els = document.querySelectorAll('[data-reveal]');
  if(!els.length) return;
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('revealed');
        obs.unobserve(e.target);
      }
    });
  },{threshold:.12,rootMargin:'0px 0px -40px 0px'});
  els.forEach(el=>obs.observe(el));
})();

/* Testimonial Slider */
(function(){
  const track = document.querySelector('.testi-track');
  if(!track) return;
  const cards = track.querySelectorAll('.testi-card-wrap');
  const prevBtn = document.querySelector('.testi-prev');
  const nextBtn = document.querySelector('.testi-next');
  let cur = 0;

  function show(i){
    cur = (i + cards.length) % cards.length;
    track.style.transform = `translateX(-${cur * 100}%)`;
  }

  prevBtn?.addEventListener('click',()=>show(cur-1));
  nextBtn?.addEventListener('click',()=>show(cur+1));
  setInterval(()=>show(cur+1), 6000);
})();

/* Blog Loader for index.html — first 2 posts */
(function(){
  const container = document.getElementById('blog-preview');
  if(!container) return;
  fetch('data/blogs.json')
    .then(r=>r.json())
    .then(blogs=>{
      const posts = blogs.slice(0,2);
      container.innerHTML = posts.map(p=>`
        <article class="blog-card" data-reveal>
          <a href="blog-single.html?slug=${p.slug}" class="blog-img-wrap" aria-label="${p.title}">
            <img src="${p.image}" alt="${p.title}" loading="lazy">
          </a>
          <div class="blog-body">
            <span class="blog-cat">${p.category}</span>
            <h3 class="blog-title"><a href="blog-single.html?slug=${p.slug}">${p.title}</a></h3>
            <p class="blog-excerpt">${p.excerpt}</p>
            <div class="blog-meta">
              <span>${p.author}</span>
              <span>${new Date(p.date).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</span>
              <span>${p.readTime}</span>
            </div>
          </div>
        </article>`).join('');
    })
    .catch(()=>{ container.style.display='none'; });
})();

/* Blog page — all posts */
(function(){
  const container = document.getElementById('blog-all');
  if(!container) return;
  fetch('data/blogs.json')
    .then(r=>r.json())
    .then(blogs=>{
      container.innerHTML = blogs.map(p=>`
        <article class="blog-card" data-reveal>
          <a href="blog-single.html?slug=${p.slug}" class="blog-img-wrap" aria-label="${p.title}">
            <img src="${p.image}" alt="${p.title}" loading="lazy">
          </a>
          <div class="blog-body">
            <span class="blog-cat">${p.category}</span>
            <h3 class="blog-title"><a href="blog-single.html?slug=${p.slug}">${p.title}</a></h3>
            <p class="blog-excerpt">${p.excerpt}</p>
            <div class="blog-meta">
              <span>${p.author}</span>
              <span>${new Date(p.date).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</span>
              <span>${p.readTime}</span>
            </div>
          </div>
        </article>`).join('');
      // re-run reveal for newly added cards
      document.querySelectorAll('[data-reveal]:not(.revealed)').forEach(el=>{
        const obs = new IntersectionObserver(entries=>{
          entries.forEach(e=>{ if(e.isIntersecting){e.target.classList.add('revealed');obs.unobserve(e.target);} });
        },{threshold:.12});
        obs.observe(el);
      });
    });
})();

/* Blog Single page */
(function(){
  const article = document.getElementById('blog-article');
  if(!article) return;
  const params = new URLSearchParams(location.search);
  const slug = params.get('slug');
  if(!slug){ article.innerHTML='<p>Post not found.</p>'; return; }
  fetch('data/blogs.json')
    .then(r=>r.json())
    .then(blogs=>{
      const p = blogs.find(b=>b.slug===slug);
      if(!p){ article.innerHTML='<p>Post not found.</p>'; return; }
      document.title = p.title + ' | Modular Kitchen';
      document.querySelector('.bs-hero').style.backgroundImage=`url('${p.image}')`;
      document.querySelector('.bs-hero-title').textContent = p.title;
      document.querySelector('.bs-breadcrumb-title').textContent = p.title;
      document.querySelector('.bs-cat').textContent = p.category;
      document.querySelector('.bs-author').textContent = p.author;
      document.querySelector('.bs-date').textContent = new Date(p.date).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'});
      document.querySelector('.bs-read').textContent = p.readTime;
      // render content
      article.innerHTML = p.content.split('\n\n').map(para=>{
        if(para.startsWith('**') && para.endsWith('**')) return `<h2>${para.slice(2,-2)}</h2>`;
        return `<p>${para.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>')}</p>`;
      }).join('');
    });
})();
