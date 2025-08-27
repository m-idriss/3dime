/* =========================
   Load content from JSON
   ========================= */
async function loadContent() {
  const res = await fetch('content/content.json');
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

  // All content loaded - fetch different GitHub metrics
  // Repository metrics (stars are more meaningful for badges than repo ID)
  updateBadge('github', 'badge-github', 'repos', { type: 'user' });
  updateBadge('trakt', 'badge-trakt', 'movies');
  updateBadge('x', 'badge-twitter', 'followers');
  setupLogoReload();
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
function updateBadge(service, badgeId, field, params = {}) {
    let url = `proxy.php?service=${service}`;

    // Add additional parameters to URL
    Object.keys(params).forEach(key => {
        url += `&${key}=${encodeURIComponent(params[key])}`;
    });

    fetch(url)
        .then(res => {
            if (!res.ok) {
                throw new Error(`Network response was not ok (${res.status})`);
            }
            return res.json();
        })
        .then(data => {
            console.log(`Data ${service}:`, data);
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
