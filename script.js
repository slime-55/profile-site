const menuButton = document.querySelector('.menu-toggle');
const navLinks = [...document.querySelectorAll('.sidebar__link')];
const mobileLayout = window.matchMedia('(max-width: 800px)');

function syncMenuButton() {
  const expanded = mobileLayout.matches
    ? document.body.classList.contains('menu-open')
    : !document.body.classList.contains('nav-collapsed');

  menuButton.setAttribute('aria-expanded', String(expanded));
  menuButton.setAttribute('aria-label', expanded ? 'メニューを閉じる' : 'メニューを開く');
}

menuButton.addEventListener('click', () => {
  document.body.classList.toggle(mobileLayout.matches ? 'menu-open' : 'nav-collapsed');
  syncMenuButton();
});

mobileLayout.addEventListener('change', () => {
  document.body.classList.remove('menu-open', 'nav-collapsed');
  syncMenuButton();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && document.body.classList.contains('menu-open')) {
    document.body.classList.remove('menu-open');
    syncMenuButton();
    menuButton.focus();
  }
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    if (mobileLayout.matches) {
      document.body.classList.remove('menu-open');
      syncMenuButton();
    }
  });
});

const sections = ['home', 'works', 'about', 'contact']
  .map((id) => document.getElementById(id))
  .filter(Boolean);

const sectionObserver = new IntersectionObserver((entries) => {
  const visible = entries
    .filter((entry) => entry.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

  if (!visible) return;
  navLinks.forEach((link) => {
    const active = link.hash === `#${visible.target.id}`;
    link.classList.toggle('is-active', active);
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}, { rootMargin: '-20% 0px -55% 0px', threshold: [0, 0.2, 0.5] });

sections.forEach((section) => sectionObserver.observe(section));
syncMenuButton();
