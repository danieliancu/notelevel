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
