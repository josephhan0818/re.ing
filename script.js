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

document.addEventListener('DOMContentLoaded', () => {
  // Initialize AOS
  AOS.init();

  // Get saved language or default to 'en'
  const savedLang = localStorage.getItem('language') || 'en';
  setLanguage(savedLang);
  
  // Add event listener for language toggle
  document.querySelectorAll('.dropdown-item').forEach(item => {
      item.addEventListener('click', (e) => {
          const lang = e.target.getAttribute('onclick').match(/'([^']+)'/)[1];
          switchLanguage(lang);
      });
  });

  // Update Awards section title
  const awardsTitle = document.querySelector('#awards h2 span');
  if (awardsTitle) {
    awardsTitle.setAttribute('data-i18n', 'awards.title');
  }
});

// Dynamically add designer cards
const designers = [
  {
    name: 'John Doe',
    role: 'Lead Designer',
    image: 'path/to/image1.jpg',
    bio: 'John is an experienced designer specializing in eco-friendly products.'
  },
  {
    name: 'Jane Smith',
    role: 'Graphic Designer',
    image: 'path/to/image2.jpg',
    bio: 'Jane creates stunning visuals that communicate our brand message.'
  },
  // Add more designers as needed
];

const designersContainer = document.getElementById('designers');
designers.forEach(designer => {
  const card = document.createElement('div');
  card.classList.add('designer-card');
  card.innerHTML = `
    <img src="${designer.image}" alt="${designer.name}" class="designer-image">
    <div class="designer-info">
      <h3 class="designer-name">${designer.name}</h3>
      <p class="designer-role">${designer.role}</p>
      <p class="designer-bio">${designer.bio}</p>
    </div>
  `;
  designersContainer.appendChild(card);
});

