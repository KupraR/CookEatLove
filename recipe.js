async function loadRecipe() {
  const res = await fetch('recipes.json');
  const data = await res.json();
  const recipes = data.recipes || [];
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const r = recipes.find(x => x.id === id) || recipes[0];
  if (!r) return;

  document.title = `${r.title} — Cook Eat Love`;

  document.querySelector('#title').textContent = r.title;
  document.querySelector('#meta').textContent = r.date ? `Publicado: ${r.date}` : '';

  const badges = document.querySelector('#badges');
  (r.labels||[]).forEach(l => {
    const b = document.createElement('span');
    b.className = 'badge';
    b.textContent = l;
    badges.appendChild(b);
  });

  document.querySelector('#text').textContent = r.text || '';

  const media = document.querySelector('#media');

  (r.images||[]).forEach(u => {
    const img = document.createElement('img');
    img.loading = 'lazy';
    img.referrerPolicy = 'no-referrer';
    img.src = u;
    img.alt = r.title;
    media.appendChild(img);
  });

  (r.youtube||[]).forEach(u => {
    const iframe = document.createElement('iframe');
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    iframe.src = u;
    media.appendChild(iframe);
  });

  const src = document.querySelector('#source');
  if (r.source_url) {
    src.href = r.source_url;
    src.textContent = 'Ver post original';
  } else {
    src.style.display = 'none';
  }

  document.querySelector('#print').addEventListener('click', () => window.print());
}
loadRecipe();
