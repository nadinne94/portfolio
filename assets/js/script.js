const sections = [
  { id: 'sobre', file: 'sections/sobre.html' },
  { id: 'camara', file: 'sections/projeto-camara.html' },
  { id: 'skills', file: 'sections/skills.html' },
  { id: 'projetos', file: 'sections/projetos.html' },
  { id: 'timeline', file: 'sections/timeline.html' }
];

async function loadSection(id, file) {
  const container = document.getElementById(`tab-${id}`);
  if (!container) return;

  try {
    const response = await fetch(file);
    if (!response.ok) throw new Error(`Erro ao carregar ${file}`);
    container.innerHTML = await response.text();
  } catch (error) {
    container.innerHTML = `
      <section class="section">
        <div class="resume-card">
          <h3>Erro ao carregar seção</h3>
          <p>Não foi possível carregar o conteúdo de ${file}.</p>
        </div>
      </section>
    `;
    console.error(error);
  }
}

async function loadAllSections() {
  await Promise.all(sections.map(section => loadSection(section.id, section.file)));
  initRevealAnimations();
}

function toggleMenu() {
  document.getElementById('mobile-menu')?.classList.toggle('open');
}

function switchTab(id) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(button => button.classList.remove('active'));

  document.getElementById(`tab-${id}`)?.classList.add('active');

  const labels = {
    sobre: 'Sobre',
    camara: 'Projeto Câmara',
    skills: 'Skills',
    projetos: 'Projetos',
    timeline: 'Timeline'
  };

  document.querySelectorAll('.tab-btn').forEach(button => {
    if (button.textContent.trim() === labels[id]) {
      button.classList.add('active');
    }
  });

  document.querySelectorAll(`#tab-${id} [data-reveal]`).forEach(element => {
    element.classList.remove('revealed');
    requestAnimationFrame(() => observer.observe(element));
  });

  window.scrollTo({ top: 96, behavior: 'smooth' });
}

let observer;

function initRevealAnimations() {
  observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('[data-reveal]').forEach(element => observer.observe(element));
}

function showProjectCategory(category) {
  document.querySelectorAll('.project-panel').forEach(panel => {
    panel.classList.remove('active');
  });

  document.querySelectorAll('.project-filter-btn').forEach(button => {
    button.classList.remove('active');
  });

  document.getElementById(`project-${category}`)?.classList.add('active');

  const buttonLabels = {
    engenharia: 'Engenharia de Dados',
    analytics: 'Analytics & BI',
    bootcamp: 'Data Analytics Bootcamp'
  };

  document.querySelectorAll('.project-filter-btn').forEach(button => {
    if (button.textContent.trim() === buttonLabels[category]) {
      button.classList.add('active');
    }
  });
}

window.addEventListener('scroll', () => {
  document.getElementById('navbar')?.classList.toggle('scrolled', window.scrollY > 50);
});

window.addEventListener('DOMContentLoaded', loadAllSections);
