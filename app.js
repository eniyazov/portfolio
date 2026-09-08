const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const intro = document.getElementById('intro');
let introTimers = [];
let introDismissed = false;
function dismissIntro() {
  if (introDismissed) return;
  introDismissed = true;
  introTimers.forEach(clearTimeout);
  intro.classList.add('leaving');
  document.getElementById('intro-skip').tabIndex = -1;
  document.querySelectorAll('header, main, footer').forEach(el => el.inert = false);
  document.body.style.overflow = '';
  if (document.activeElement === document.getElementById('intro-skip')) document.querySelector('.logo').focus({ preventScroll: true });
  setTimeout(() => intro.remove(), 900);
}
if (!reducedMotion && !location.hash) {
  intro.classList.add('active');
  document.querySelectorAll('header, main, footer').forEach(el => el.inert = true);
  document.body.style.overflow = 'hidden';
  document.getElementById('intro-skip').tabIndex = 0;
  const greetings = ['Hello', 'Salam', 'Привет', 'Hallo', 'Merhaba'];
  greetings.forEach((word, i) => introTimers.push(setTimeout(() => {
    document.getElementById('intro-word').textContent = word;
  }, i * 350)));
  introTimers.push(setTimeout(dismissIntro, 2000));
  document.getElementById('intro-skip').addEventListener('click', dismissIntro);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && intro.isConnected) dismissIntro(); });
} else intro.remove();

const nav = document.getElementById('navigation');
let ticking = false;
function updateScroll() {
  nav.classList.toggle('scrolled', window.scrollY > 100);

  ticking = false;
}
window.addEventListener('scroll', () => {
  if (!ticking) { requestAnimationFrame(updateScroll); ticking = true; }
}, { passive: true });
updateScroll();
if ('IntersectionObserver' in window && !reducedMotion) {
  document.body.classList.add('motion-ready');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target); }
    });
  }, { threshold: .06 });
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => observer.observe(el));
}
document.getElementById('year').textContent = new Date().getFullYear();

document.querySelector('form').addEventListener('submit', event => {
  event.preventDefault();
  const values = new FormData(event.currentTarget);
  const subject = encodeURIComponent(`Portfolio enquiry from ${values.get('name')}`);
  const body = encodeURIComponent(`${values.get('message')}\n\nFrom: ${values.get('name')}\nEmail: ${values.get('email')}`);
  window.location.href = `mailto:emil.niyazov55@gmail.com?subject=${subject}&body=${body}`;
});

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const closeButton = document.createElement('button');
closeButton.className = 'lightbox-close';
closeButton.setAttribute('aria-label', 'Close image');
closeButton.textContent = '×';
lightbox.append(closeButton);
lightbox.setAttribute('role', 'dialog');
lightbox.setAttribute('aria-modal', 'true');
lightbox.setAttribute('aria-label', 'Image preview');
let imageTrigger;
document.querySelectorAll('[data-img]').forEach(button => {
  button.addEventListener('click', () => {
    imageTrigger = button;
    lightboxImg.src = button.dataset.img;
    lightboxImg.alt = button.querySelector('img')?.alt || button.getAttribute('aria-label') || 'Project preview';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeButton.focus();
  });
});
function closeImage() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  lightboxImg.removeAttribute('src');
  document.body.style.overflow = '';
  imageTrigger?.focus();
}
lightbox.addEventListener('click', e => { if (e.target !== lightboxImg) closeImage(); });
lightbox.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeImage();
  if (e.key === 'Tab') { e.preventDefault(); closeButton.focus(); }
});
