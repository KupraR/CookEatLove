async function load() {
  const res = await fetch('recipes.json');
  const data = await res.json();
  const recipes = data.recipes || [];

  const q = document.querySelector('#q');
  const cat = document.querySelector('#cat');
  const grid = document.querySelector('#grid');

  // build categories from labels
  const cats = new Set();
  recipes.forEach(r => (r.labels || []).forEach(l => cats.add(l)));
  const sortedCats = Array.from(cats).sort((a,b)=>a.localeCompare(b,'pt'));
  sortedCats.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c; opt.textContent = c;
    cat.appendChild(opt);
  });

  function matches(r) {
    const term = (q.value || '').trim().toLowerCase();
    const c = cat.value || '';
    if (c && !(r.labels||[]).includes(c)) return false;
    if (!term) return true;
    const hay = (r.title + ' ' + (r.text||'')).toLowerCase();
    return hay.includes(term);
  }

  function card(r) {
    const a = document.createElement('a');
    a.href = `recipe.html?id=${encodeURIComponent(r.id)}`;
    a.className = 'card';

    const thumb = document.createElement('div');
    thumb.className = 'thumb';
    const img = document.createElement('img');
    img.alt = r.title;
    img.loading = 'lazy';
    img.referrerPolicy = 'no-referrer';
    img.src = (r.images && r.images[0]) ? r.images[0] : '';
    if (!img.src) {
      thumb.style.display = 'none';
    } else {
      thumb.appendChild(img);
    }

    const body = document.createElement('div');
    body.className = 'body';

    const h = document.createElement('div');
    h.style.fontSize = '16px';
    h.style.fontWeight = '650';
    h.textContent = r.title;

    const meta = document.createElement('div');
    meta.className = 'small';
    meta.textContent = r.date ? r.date : '';

    const badges = document.createElement('div');
    badges.className = 'badges';
    (r.labels||[]).slice(0,3).forEach(l => {
      const b = document.createElement('span');
      b.className = 'badge';
      b.textContent = l;
      badges.appendChild(b);
    });

    body.appendChild(h);
    body.appendChild(meta);
    if (badges.childNodes.length) body.appendChild(badges);

    if (thumb.childNodes.length) a.appendChild(thumb);
    a.appendChild(body);
    return a;
  }

  function render() {
    const filtered = recipes.filter(matches);
    grid.innerHTML = '';
    filtered.forEach(r => grid.appendChild(card(r)));
    document.querySelector('#count').textContent = `${filtered.length} receitas`;
  }

  q.addEventListener('input', render);
  cat.addEventListener('change', render);
  render();
}
load();
