(function(){
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('js');

  // Entrance animation
  if(!prefersReduced){
    document.body.classList.add('page-enter');

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.body.classList.add('ready');
      });
    });
  }

  // Reveal sections/cards as they enter the viewport
  const revealables = document.querySelectorAll(
    'section, .card, .step, .stage, .timeline article, .photo-panel, .video, footer'
  );

  if(!prefersReduced && 'IntersectionObserver' in window){
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -36px 0px'
    });

    revealables.forEach(el => {
      el.classList.add('reveal');
      io.observe(el);
    });
  }

  // Mobile navigation
  const nav = document.querySelector('.nav');
  const links = document.querySelector('.navlinks');

  if(nav && links){
    const btn = document.createElement('button');

    btn.className = 'mobile-menu-btn';
    btn.setAttribute('aria-label', 'Open menu');
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = '<span></span>';

    nav.appendChild(btn);

    const drawer = document.createElement('div');

    drawer.className = 'mobile-drawer';
    drawer.innerHTML = links.innerHTML;

    document.body.appendChild(drawer);

    const closeMenu = () => {
      btn.classList.remove('open');
      drawer.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    };

    btn.addEventListener('click', () => {
      const open = !drawer.classList.contains('open');

      btn.classList.toggle('open', open);
      drawer.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
    });

    drawer.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', (e) => {
      if(!drawer.contains(e.target) && !btn.contains(e.target)){
        closeMenu();
      }
    });
  }

  // Soft parallax effect on desktop
  if(!prefersReduced && innerWidth > 920){
    const panels = document.querySelectorAll(
      '.hero, .photo-panel, .factory'
    );

    let ticking = false;

    const parallax = () => {
      const y = window.scrollY;

      panels.forEach(el => {
        const rect = el.getBoundingClientRect();

        if(rect.bottom > 0 && rect.top < innerHeight){
          const shift = (rect.top - innerHeight / 2) * -0.035;

          el.style.setProperty(
            '--parallax',
            shift.toFixed(1) + 'px'
          );
        }
      });

      ticking = false;
    };

    addEventListener(
      'scroll',
      () => {
        if(!ticking){
          requestAnimationFrame(parallax);
          ticking = true;
        }
      },
      { passive: true }
    );

    parallax();
  }

  // Falling tea leaves while scrolling
  let leafCooldown = 0;

  function spawnLeaf(){
    if(prefersReduced || Date.now() - leafCooldown < 120){
      return;
    }

    leafCooldown = Date.now();

    const leaf = document.createElement('span');

    leaf.className = 'falling-leaf';
    leaf.textContent = '🍃';

    leaf.style.left =
      (8 + Math.random() * 84) + 'vw';

    leaf.style.fontSize =
      (12 + Math.random() * 14) + 'px';

    leaf.style.setProperty(
      '--dur',
      (2.8 + Math.random() * 2.6) + 's'
    );

    leaf.style.setProperty(
      '--drift',
      (Math.random() * 160 - 80) + 'px'
    );

    document.body.appendChild(leaf);

    setTimeout(() => {
      leaf.remove();
    }, 6200);
  }

  addEventListener(
    'scroll',
    spawnLeaf,
    { passive: true }
  );

  // Smooth page-to-page transition
  if(!prefersReduced){
    document.querySelectorAll('a[href]').forEach(a => {

      a.addEventListener('click', e => {

        if(
          e.defaultPrevented ||
          a.target === '_blank' ||
          a.hasAttribute('download')
        ){
          return;
        }

        const url = new URL(a.href, location.href);

        // Ignore external links
        if(url.origin !== location.origin){
          return;
        }

        // Ignore same-page anchor links
        if(
          url.pathname === location.pathname &&
          url.hash
        ){
          return;
        }

        // Ignore non-web protocols
        if(
          url.protocol !== 'http:' &&
          url.protocol !== 'https:'
        ){
          return;
        }

        e.preventDefault();

        closeMobileMenuIfAny();

        document.body.classList.remove('ready');
        document.body.classList.add('page-leaving');

        setTimeout(() => {
          location.href = url.href;
        }, 320);

      });

    });
  }

  function closeMobileMenuIfAny(){
    const drawer =
      document.querySelector('.mobile-drawer');

    const btn =
      document.querySelector('.mobile-menu-btn');

    if(drawer){
      drawer.classList.remove('open');
    }

    if(btn){
      btn.classList.remove('open');
      btn.setAttribute(
        'aria-expanded',
        'false'
      );
    }
  }

})();
