const menuToggle = document.getElementById('menu-toggle');
const mobileNav = document.getElementById('mobile-nav');

if (menuToggle && mobileNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const a11yWidgetBtn = document.getElementById('a11yWidgetBtn');
const a11yWidgetPanel = document.getElementById('a11yWidgetPanel');

if (a11yWidgetBtn && a11yWidgetPanel) {
  const highContrastToggle = document.getElementById('a11yWidgetHighContrast');
  const largeTextToggle = document.getElementById('a11yWidgetLargeText');
  const reduceMotionToggle = document.getElementById('a11yWidgetReduceMotion');

  const applyClass = (className, enabled) => {
    document.documentElement.classList.toggle(className, enabled);
  };

  const savePreferences = () => {
    localStorage.setItem('notelevel.a11y', JSON.stringify({
      highContrast: highContrastToggle.checked,
      largeText: largeTextToggle.checked,
      reduceMotion: reduceMotionToggle.checked,
    }));
  };

  const loadPreferences = () => {
    let prefs = {};
    try {
      prefs = JSON.parse(localStorage.getItem('notelevel.a11y') || '{}');
    } catch (error) {
      prefs = {};
    }
    const systemReducedMotion = Boolean(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    highContrastToggle.checked = Boolean(prefs.highContrast);
    largeTextToggle.checked = Boolean(prefs.largeText);
    reduceMotionToggle.checked = typeof prefs.reduceMotion === 'boolean' ? prefs.reduceMotion : systemReducedMotion;
    applyClass('a11y-high-contrast', highContrastToggle.checked);
    applyClass('a11y-large-text', largeTextToggle.checked);
    applyClass('a11y-reduce-motion', reduceMotionToggle.checked);
  };

  const closePanel = () => {
    a11yWidgetPanel.hidden = true;
    a11yWidgetBtn.setAttribute('aria-expanded', 'false');
  };

  const openPanel = () => {
    a11yWidgetPanel.hidden = false;
    a11yWidgetBtn.setAttribute('aria-expanded', 'true');
  };

  a11yWidgetBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    if (a11yWidgetPanel.hidden) {
      openPanel();
    } else {
      closePanel();
    }
  });

  document.addEventListener('click', (event) => {
    if (!a11yWidgetPanel.hidden && !a11yWidgetPanel.contains(event.target) && event.target !== a11yWidgetBtn) {
      closePanel();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !a11yWidgetPanel.hidden) {
      closePanel();
      a11yWidgetBtn.focus();
    }
  });

  [highContrastToggle, largeTextToggle, reduceMotionToggle].forEach((toggle) => {
    toggle.addEventListener('change', () => {
      applyClass('a11y-high-contrast', highContrastToggle.checked);
      applyClass('a11y-large-text', largeTextToggle.checked);
      applyClass('a11y-reduce-motion', reduceMotionToggle.checked);
      savePreferences();
    });
  });

  loadPreferences();
}

const productDemoVideo = document.querySelector('.product-demo-video');

if (productDemoVideo) {
  const canShowVideo = window.matchMedia('(min-width: 601px)');
  let hasRequestedVideo = false;

  productDemoVideo.addEventListener('loadedmetadata', () => {
    if (canShowVideo.matches && productDemoVideo.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
      productDemoVideo.currentTime = 0.001;
    }
  }, { once: true });

  const requestVideo = () => {
    if (hasRequestedVideo || !canShowVideo.matches) return;

    hasRequestedVideo = true;
    productDemoVideo.preload = 'auto';

    const playWhenReady = () => {
      productDemoVideo.play().catch(() => {});
    };

    if (productDemoVideo.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      playWhenReady();
      return;
    }

    productDemoVideo.addEventListener('canplay', playWhenReady, { once: true });
    productDemoVideo.load();
  };

  if ('IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        requestVideo();
        videoObserver.disconnect();
      }
    }, { rootMargin: '320px 0px' });

    videoObserver.observe(productDemoVideo);
  } else {
    window.addEventListener('load', requestVideo, { once: true });
  }
}
