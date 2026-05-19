function getBrandBySlug(slug) {
  return window.SRMARK_COLLECTION.brands.find((brand) => brand.slug === slug);
}

function renderOverview() {
  const app = document.getElementById('app');
  const collection = window.SRMARK_COLLECTION;

  app.innerHTML = `
    <main class="sr-shell">
      <div class="sr-container">
        <div class="sr-topbar">
          <a class="sr-brand-link" href="../index.html">
            <span class="sr-badge">re-ing</span>
            <span>SR MARK Taiwan Sustainable Design Alliance</span>
          </a>
          <a class="sr-button-secondary" href="../index.html">Back to re-ing</a>
        </div>

        <section class="sr-hero">
          <div class="sr-hero-card">
            <div class="sr-hero-copy">
              <div>
                <span class="sr-kicker">Curated Brand Atlas</span>
                <h1>${collection.hero.title}<span>${collection.hero.subtitle}</span></h1>
                <p>${collection.hero.descriptionEn}</p>
                <p>${collection.hero.descriptionZh}</p>
              </div>
              <div class="sr-hero-actions">
                <a class="sr-button" href="#brand-grid">Explore Brands</a>
                <a class="sr-button-secondary" href="#story">Read the Curatorial Note</a>
              </div>
            </div>
            <div class="sr-hero-visual">
              <img src="../assets/srmark_image/HEMEL-1 - li Iris.jpg" alt="SR MARK sustainable design selection" loading="lazy">
            </div>
          </div>
        </section>

        <section id="story" class="sr-section">
          <div class="section-head">
            <div>
              <div class="eyebrow">Curatorial Note</div>
              <h2>品牌不只是列表，而是材料、故事與使用情境的集合。</h2>
            </div>
          </div>
          <p>本頁以主題分類整理台灣的循環設計品牌，讓國際觀眾能快速理解每個品牌所回應的材料議題、生活場景與文化價值。每張品牌卡片都可進入獨立子頁，查看專案摘要與作品影像。</p>
          <div class="tag-list" style="margin-top: 1rem;">
            ${collection.filters.slice(1).map((filter) => `<span class="tag-pill">${filter}</span>`).join('')}
          </div>
        </section>

        <section class="sr-section" id="brand-grid">
          <div class="section-head">
            <div>
              <div class="eyebrow">Brand Archive</div>
              <h2>品牌卡片</h2>
            </div>
            <p>點選品牌卡片，進入對應的專案子頁。</p>
          </div>
          <div class="filter-bar">
            ${collection.filters.map((filter) => `<button type="button" class="filter-chip${filter === 'All' ? ' is-active' : ''}" data-filter="${filter}">${filter}</button>`).join('')}
          </div>
          <div class="brand-grid">
            ${collection.brands.map((brand) => `
              <article class="brand-card" data-filter="${brand.filter}">
                <div class="brand-media">
                  <img src="${brand.heroImage}" alt="${brand.heroAlt}" loading="lazy">
                </div>
                <div class="brand-content">
                  <div class="brand-meta"><span>${brand.category}</span></div>
                  <h3 class="brand-title">${brand.name}</h3>
                  <p class="brand-tagline">${brand.tagline}</p>
                  <div class="tag-list">${brand.keywords.map((keyword) => `<span class="tag-pill">${keyword}</span>`).join('')}</div>
                  <a class="sr-button" href="brand.html?brand=${brand.slug}">View Brand</a>
                </div>
              </article>
            `).join('')}
          </div>
        </section>
      </div>
    </main>
  `;

  const filterBar = app.querySelector('.filter-bar');
  const brandCards = Array.from(app.querySelectorAll('.brand-card'));

  filterBar.addEventListener('click', (event) => {
    const target = event.target.closest('.filter-chip');
    if (!target) {
      return;
    }

    const filter = target.dataset.filter;
    filterBar.querySelectorAll('.filter-chip').forEach((chip) => chip.classList.toggle('is-active', chip.dataset.filter === filter));
    brandCards.forEach((card) => {
      const shouldHide = filter !== 'All' && card.dataset.filter !== filter;
      card.classList.toggle('is-hidden', shouldHide);
    });
  });
}

function renderProjectCard(project) {
  return `
    <article class="project-card">
      <div class="project-media">
        <img src="${project.image}" alt="${project.name}" loading="lazy">
      </div>
      <div class="project-copy">
        <h3>${project.name}</h3>
        <p>${project.description}</p>
      </div>
    </article>
  `;
}

function renderGalleryCard(image) {
  return `
    <figure class="gallery-card">
      <img src="${image}" alt="SR MARK gallery image" loading="lazy">
    </figure>
  `;
}

function renderBrandDetail() {
  const app = document.getElementById('app');
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('brand');
  const brand = getBrandBySlug(slug);

  if (!brand) {
    app.innerHTML = `
      <main class="sr-shell">
        <div class="sr-container brand-not-found">
          <div class="eyebrow">SR MARK</div>
          <h1>Brand not found</h1>
          <p>The brand you requested does not exist in this collection.</p>
          <p><a class="sr-button" href="index.html">Back to collection</a></p>
        </div>
      </main>
    `;
    return;
  }

  app.innerHTML = `
    <main class="sr-shell">
      <div class="sr-container">
        <div class="sr-topbar">
          <a class="back-link" href="index.html">← Back to SR MARK collection</a>
          <a class="sr-button-secondary" href="../index.html">Back to re-ing</a>
        </div>

        <section class="detail-grid">
          <div class="detail-panel detail-hero">
            <img src="${brand.heroImage}" alt="${brand.heroAlt}" loading="eager">
            <div class="overlay">
              <div class="eyebrow">${brand.category}</div>
              <h1>${brand.name}</h1>
              <p>${brand.tagline}</p>
            </div>
          </div>

          <div class="detail-panel">
            <div class="panel-copy">
              <div class="eyebrow">Brand Story</div>
              <h2 style="margin: 0.5rem 0 0.75rem; font-size: 1.9rem; letter-spacing: -0.03em;">${brand.summary}</h2>
              <p style="color: var(--sr-muted); line-height: 1.85; margin: 0 0 1rem;">${brand.summary}</p>
              <div class="tag-list">${brand.keywords.map((keyword) => `<span class="tag-pill">${keyword}</span>`).join('')}</div>
            </div>
          </div>
        </section>

        <section class="sr-section">
          <div class="section-head">
            <div>
              <div class="eyebrow">Representative Projects</div>
              <h2>代表專案</h2>
            </div>
          </div>
          <div class="project-grid">
            ${brand.projects.map(renderProjectCard).join('')}
          </div>
        </section>

        ${brand.gallery.length ? `
          <section class="sr-section">
            <div class="section-head">
              <div>
                <div class="eyebrow">Image Gallery</div>
                <h2>圖片展示</h2>
              </div>
            </div>
            <div class="gallery-grid">
              ${brand.gallery.map(renderGalleryCard).join('')}
            </div>
          </section>
        ` : ''}
      </div>
    </main>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  const mode = document.body.dataset.page;
  if (mode === 'brand') {
    renderBrandDetail();
    return;
  }

  renderOverview();
});