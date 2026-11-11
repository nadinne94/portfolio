/*
 * Todo o conteúdo já está no index.html. Este script só organiza a navegação:
 * sem JavaScript, as seções aparecem uma embaixo da outra e continuam legíveis.
 */

const TABS = ['sobre', 'projetos', 'skills', 'timeline'];

// ---------- Abas (Sobre, Projetos, Skills, Timeline) ----------
function switchTab(id, { scroll = true } = {}) {
  if (!TABS.includes(id)) id = 'sobre';

  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.toggle('active', tab.id === `tab-${id}`);
  });

  document.querySelectorAll('.tab-btn[data-tab]').forEach(button => {
    const ativo = button.dataset.tab === id;
    button.classList.toggle('active', ativo);
    if (ativo) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
  });

  revealIn(document.getElementById(`tab-${id}`));

  if (scroll) {
    const hero = document.querySelector('.hero-nav');
    const topo = hero ? hero.getBoundingClientRect().top + window.scrollY - 90 : 0;
    window.scrollTo({ top: Math.max(topo, 0), behavior: 'smooth' });
  }
}

// O endereço guarda a aba aberta (#projetos), então dá para compartilhar o link
// direto de uma seção e o botão "voltar" do navegador funciona.
document.addEventListener('click', event => {
  const link = event.target.closest('a[data-tab]');
  if (!link) return;
  event.preventDefault();
  const id = link.dataset.tab;
  if (location.hash !== `#${id}`) history.pushState(null, '', `#${id}`);
  switchTab(id);
  closeMenu();
});

window.addEventListener('popstate', () => switchTab(location.hash.slice(1), { scroll: false }));

// ---------- Menu do celular ----------
const menu = document.getElementById('mobile-menu');
const toggle = document.querySelector('.nav-toggle');

function closeMenu() {
  menu?.classList.remove('open');
  toggle?.setAttribute('aria-expanded', 'false');
}

toggle?.addEventListener('click', () => {
  const aberto = menu.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(aberto));
});

// ---------- Filtro de projetos ----------
document.querySelectorAll('.project-filter-btn[data-category]').forEach(button => {
  button.addEventListener('click', () => {
    const categoria = button.dataset.category;

    document.querySelectorAll('.project-panel').forEach(panel => {
      panel.classList.toggle('active', panel.id === `project-${categoria}`);
    });
    document.querySelectorAll('.project-filter-btn').forEach(outro => {
      outro.classList.toggle('active', outro === button);
    });

    revealIn(document.getElementById(`project-${categoria}`));
  });
});

// ---------- Entrada suave ao rolar ----------
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

function revealIn(root) {
  if (!root) return;
  const alvos = root.matches('[data-reveal]') ? [root] : [];
  alvos.push(...root.querySelectorAll('[data-reveal]'));
  alvos.forEach(el => observer.observe(el));
}

// ---------- Início ----------
switchTab(location.hash.slice(1), { scroll: false });
revealIn(document.querySelector('.hero'));
