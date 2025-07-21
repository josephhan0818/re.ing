// Initialize AOS
AOS.init({
  duration: 800,
  once: true,
});

// Chart.js setup
const ctx = document.getElementById('impactChart').getContext('2d');
const impactChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['CO2 Reduced (Tons)', 'Plastic Recycled (Tons)', 'Products Sold'],
    datasets: [{
      label: 'Environmental Impact',
      data: [500, 300, 1000],
      backgroundColor: [
        'rgba(16, 185, 129, 0.6)',
        'rgba(34, 211, 238, 0.6)',
        'rgba(59, 130, 246, 0.6)',
      ],
      borderColor: [
        'rgba(16, 185, 129, 1)',
        'rgba(34, 211, 238, 1)',
        'rgba(59, 130, 246, 1)',
      ],
      borderWidth: 1,
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Amount',
          font: { size: 14 }
        },
        grid: { color: '#E5E7EB' }
      },
      x: {
        title: {
          display: true,
          text: 'Metrics',
          font: { size: 14 }
        },
        grid: { display: false }
      }
    },
    plugins: {
      legend: { display: false },
      datalabels: {
        anchor: 'end',
        align: 'top',
        color: '#1F2937',
        font: { weight: 'bold' }
      }
    }
  },
  plugins: [ChartDataLabels]
});

// Form submission handling
function showThankYou(event) {
  event.preventDefault();
  const form = event.target;
  fetch(form.action, {
    method: form.method,
    body: new FormData(form),
    headers: { 'Accept': 'application/json' }
  }).then(response => {
    if (response.ok) {
      form.reset();
      const thankYouMessage = document.getElementById('thank-you');
      thankYouMessage.classList.add('visible');
    }
  }).catch(error => console.error('Error:', error));
}

function showNewsletterThankYou(event) {
  event.preventDefault();
  const form = event.target;
  fetch(form.action, {
    method: form.method,
    body: new FormData(form),
    headers: { 'Accept': 'application/json' }
  }).then(response => {
    if (response.ok) {
      form.reset();
      const thankYouMessage = document.getElementById('newsletter-thank-you');
      thankYouMessage.classList.add('visible');
    }
  }).catch(error => console.error('Error:', error));
}

document.addEventListener('DOMContentLoaded', function() {
  // Header Scroll Effect
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile Menu Toggle
  const hamburger = document.querySelector('.hamburger');
  const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
  const closeBtn = document.querySelector('.mobile-nav-overlay .close-btn');

  hamburger.addEventListener('click', () => {
    mobileNavOverlay.classList.add('active');
  });

  closeBtn.addEventListener('click', () => {
    mobileNavOverlay.classList.remove('active');
  });

  // Designer Grid (Placeholder - Replace with actual data)
  const designerGrid = document.querySelector('.designer-grid');
  if (designerGrid) {
    const designers = [
      { name: 'Designer A', series: 'Series 1', image: 'https://via.placeholder.com/400x300' },
      { name: 'Designer B', series: 'Series 2', image: 'https://via.placeholder.com/400x300' },
      { name: 'Designer C', series: 'Series 3', image: 'https://via.placeholder.com/400x300' },
      { name: 'Designer D', series: 'Series 4', image: 'https://via.placeholder.com/400x300' },
      { name: 'Designer E', series: 'Series 5', image: 'https://via.placeholder.com/400x300' },
      { name: 'Designer F', series: 'Series 6', image: 'https://via.placeholder.com/400x300' },
      { name: 'Designer G', series: 'Series 7', image: 'https://via.placeholder.com/400x300' },
      { name: 'Designer H', series: 'Series 8', image: 'https://via.placeholder.com/400x300' },
      { name: 'Designer I', series: 'Series 9', image: 'https://via.placeholder.com/400x300' },
      { name: 'Designer J', series: 'Series 10', image: 'https://via.placeholder.com/400x300' }
    ];

    designers.forEach(designer => {
      const card = document.createElement('div');
      card.classList.add('designer-card');
      card.innerHTML = `
        <img src="${designer.image}" alt="${designer.name}">
        <div class="card-info">
          <h3 class="designer-name">${designer.name}</h3>
          <p class="series-name">${designer.series}</p>
        </div>
      `;
      designerGrid.appendChild(card);
    });
  }

  // RE:TWIST Designer Grid (Placeholder - Replace with actual data)
  const retwistDesignerGrid = document.querySelector('.retwist-section .designer-grid');
  if (retwistDesignerGrid) {
    const designers = [
      { name: 'Designer A', series: 'Series 1', image: 'https://via.placeholder.com/400x300' },
      { name: 'Designer B', series: 'Series 2', image: 'https://via.placeholder.com/400x300' },
      { name: 'Designer C', series: 'Series 3', image: 'https://via.placeholder.com/400x300' },
      { name: 'Designer D', series: 'Series 4', image: 'https://via.placeholder.com/400x300' },
      { name: 'Designer E', series: 'Series 5', image: 'https://via.placeholder.com/400x300' },
      { name: 'Designer F', series: 'Series 6', image: 'https://via.placeholder.com/400x300' },
      { name: 'Designer G', series: 'Series 7', image: 'https://via.placeholder.com/400x300' },
      { name: 'Designer H', series: 'Series 8', image: 'https://via.placeholder.com/400x300' },
      { name: 'Designer I', series: 'Series 9', image: 'https://via.placeholder.com/400x300' },
      { name: 'Designer J', series: 'Series 10', image: 'https://via.placeholder.com/400x300' }
    ];

    designers.forEach(designer => {
      const card = document.createElement('div');
      card.classList.add('designer-card');
      card.innerHTML = `
        <img src="${designer.image}" alt="${designer.name}">
        <div class="card-info">
          <h3 class="designer-name">${designer.name}</h3>
          <p class="series-name">${designer.series}</p>
        </div>
      `;
      retwistDesignerGrid.appendChild(card);
    });
  }

  // Language switch function
  function switchLanguage(lang) {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    document.documentElement.setAttribute('data-lang', lang);
  }

  // Initialize language on page load
  document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('language') || 'en';
    setLanguage(savedLang);
  });

  // Update Awards section title
  const awardsTitle = document.querySelector('#awards h2 span');
  if (awardsTitle) {
    awardsTitle.setAttribute('data-i18n', 'awards.title');
  }
});

