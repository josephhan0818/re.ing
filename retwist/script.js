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
  const savedLang = localStorage.getItem('language') || 'en';
  setLanguage(savedLang); // Use the setLanguage function from translations.js

  // Update Awards section title
  const awardsTitle = document.querySelector('#awards h2 span');
  if (awardsTitle) {
    awardsTitle.setAttribute('data-i18n', 'awards.title');
  }
});

