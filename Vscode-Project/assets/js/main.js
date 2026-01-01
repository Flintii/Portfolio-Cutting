
/* header show/hide on scroll + scroll-to-section-top for nav links */
'use strict';
(function(){
  let lastScroll = window.pageYOffset || document.documentElement.scrollTop;
  const header = document.querySelector('.header');
  const threshold = 150; // only hide after more significant scrolling (avoids accidental hide)
  const transparentThreshold = 8; // when closer than this to top, make header transparent

  if (header) {
    // enforce fixed positioning (fallback)
    header.style.position = 'fixed';
    header.style.left = '0';
    header.style.width = '100%';
    header.classList.remove('header--hidden');

    // set initial transparency state
    if ((window.pageYOffset || document.documentElement.scrollTop) <= transparentThreshold) {
      header.classList.add('header--transparent');
    }

    // ensure body has top padding equal to header height (so fixed header doesn't cover content)
    function updateBodyPadding() {
      const h = header.offsetHeight;
      document.body.style.paddingTop = h + 'px';
      document.documentElement.style.setProperty('--header-height', h + 'px');
    }

    // initial padding and on resize
    updateBodyPadding();
    // re-run after a short delay to account for fonts/layout
    setTimeout(updateBodyPadding, 80);
    window.addEventListener('resize', updateBodyPadding, {passive:true});

    window.addEventListener('scroll', function(){
      const current = window.pageYOffset || document.documentElement.scrollTop;
      // toggle transparent state near top
      if (current <= transparentThreshold) {
        header.classList.add('header--transparent');
      } else {
        header.classList.remove('header--transparent');
      }

      // keep header visible at all times (disable hide-on-scroll)
      // ensure we update lastScroll to keep consistent behavior for other features
      lastScroll = current <= 0 ? 0 : current;
    }, {passive:true});
  }

  function scrollToSectionTop(target, extraRevealPct = 0.08){
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const targetTop = window.pageYOffset + rect.top;
    const headerHeight = header ? header.offsetHeight : 0;
    const extra = Math.round(window.innerHeight * extraRevealPct); // reveal a bit of previous section
    const top = Math.max(0, targetTop - headerHeight - extra);
    window.scrollTo({ top: top, behavior: 'smooth' });
  }

  document.querySelectorAll('.nav__items a[href^="#"]').forEach(function(link){
    link.addEventListener('click', function(e){
      e.preventDefault();
      const href = this.getAttribute('href');
      const target = document.querySelector(href);
      if (!target) return;
      // reveal a bit of the previous section so heading remains visible
      scrollToSectionTop(target, 0.08);
      // update the hash without instant jump
      history.pushState(null, '', href);
    });
  });

  // If page loads with a hash, scroll to top of section
  window.addEventListener('load', function(){
    if (location.hash) {
      const target = document.querySelector(location.hash);
      if (target) {
        // small timeout to allow layout/reflow
        setTimeout(function(){ scrollToSectionTop(target, 0.08); }, 30);
      }
    }
  });
})();
