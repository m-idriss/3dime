/* =========================
   Load content from JSON
   ========================= */
async function loadContent() {
  const res = await fetch('assets/content.json');
  const content = await res.json();

  const main = document.querySelector('.cards-container');

  content.groups.forEach(group => {
    const groupDiv = document.createElement('div');
    groupDiv.classList.add('group-column');

    group.sections.forEach(section => {
      const container = document.createElement('section');
      container.classList.add('container');
      container.setAttribute('aria-label', section.name);

      let html = '';

      if (section.logo) {
        html += `<header>`;
        html += `<img src="${section.logo}" alt="Logo" class="logo">`;
        html += `</header>`;
      }

      if (section.title) html += `<h2>${section.title}</h2>`;
      if (section.description) html += `<p>${section.description}</p>`;

      if (section.items) {
        if (section.itemsClass) html += `<div class="${section.itemsClass}">`;

        html += section.items.map(item => {
          const classes = [];
          if (item.linkType) classes.push(item.linkType);
          if (!item.iconClass && item.name) classes.push('link');
          if (item.extraClasses) classes.push(...item.extraClasses.split(' '));

          let linkHtml = `<a href="${item.url}" target="_blank"`;
          if (classes.length) {
            linkHtml += ` class="${classes.join(' ')}"`;
          }
          linkHtml += '>';
          if (item.iconClass) linkHtml += `<i class="fa ${item.iconClass}"></i>`;
          if (!item.iconClass && item.name) linkHtml += item.name;
          if (item.badge) {
            const badgeId = item.badgeId ? ` id="${item.badgeId}"` : '';
            linkHtml += `<span class="badge"${badgeId} style="display: none;">${item.badge}</span>`;
          }
          linkHtml += `</a>`;
          return item.wrapperClass ? `<div class="${item.wrapperClass}">${linkHtml}</div>` : linkHtml;
        }).join('');

        if (section.itemsClass) html += `</div>`;
      }

      container.innerHTML = html;
      groupDiv.appendChild(container);
    });

    main.appendChild(groupDiv);
  });

  // All content loaded, now trigger global stagger animation
  animateAllCardsOnScroll();
  updateBadge('github', 'badge-github', 'repos');
  updateBadge('trakt', 'badge-trakt', 'movies');
  updateBadge('facebook', 'badge-facebook', 'friends');
  setupLogoReload();
}

/* =========================
   Global Scroll-triggered Staggered Animation
   ========================= */
function animateAllCardsOnScroll() {
  const cards = document.querySelectorAll('.container');
  if (!cards.length) return; // safety check

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('visible')) {
        const index = Array.from(cards).indexOf(entry.target);
        setTimeout(() => entry.target.classList.add('visible'), index * 150);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(card => observer.observe(card));
}

/* =========================
   Logo Reload
   ========================= */
function setupLogoReload() {
  const logos = document.querySelectorAll('.logo');
  logos.forEach(logo => {
    logo.addEventListener('click', () => {
      document.body.classList.add('fade-out');
      setTimeout(() => location.reload(), 400);
    });
  });
}

/* =========================
   Update Badge
   ========================= */
function updateBadge(service, badgeId, field) {
    fetch("proxy.php?service=" + service)
        .then(res => {
            if (!res.ok) {
                throw new Error(`Network response was not ok (${res.status})`);
            }
            return res.json();
        })
        .then(data => {
        console.log(`Données ${service}:`, data);
            const badge = document.getElementById(badgeId);
            const count = data[field] || 0;
            if (badge) {
                badge.textContent = count;
                badge.style.display = count > 0 ? "flex" : "none";
            }
        })
        .catch(err => console.error(`Erreur ${service}:`, err));
}

/* =========================
   Service Worker
   ========================= */
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('assets/sw.js')
    .then(() => console.log('SW registered'))
    .catch(err => console.log('SW failed', err));
}

/* =========================
   Page Fade-In
   ========================= */
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('loaded'); // fade-in
  loadContent(); // load content & trigger animations after DOM insertion
});
