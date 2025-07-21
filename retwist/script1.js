// Individual Figure Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        once: true,
        offset: 100
    });

    // Language switching functionality
    function updateCurrentLang(lang) {
        const currentLangSpan = document.querySelector('.current-lang');
        if (currentLangSpan) {
            const langCodes = {
                'en': 'EN',
                'zh': '中',
                'ja': '日',
                'nl': 'NL'
            };
            currentLangSpan.textContent = langCodes[lang] || 'EN';
        }
    }

    // Global language switch function
    window.switchLanguage = function(lang) {
        console.log('Switching to language:', lang);
        
        if (typeof translations === 'undefined') {
            console.error('Translations not loaded');
            return;
        }
        
        if (!translations[lang]) {
            console.error('Language not found:', lang);
            return;
        }
        
        document.documentElement.setAttribute('data-lang', lang);
        document.documentElement.lang = lang;

        // Update all translation elements
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                element.innerHTML = translations[lang][key];
            }
        });

        // Update placeholder attributes
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            if (translations[lang] && translations[lang][key]) {
                element.setAttribute('placeholder', translations[lang][key]);
            }
        });

        localStorage.setItem('language', lang);
        updateCurrentLang(lang);
    };

    // Initialize language
    const savedLang = localStorage.getItem('language') || 'en';
    if (typeof translations !== 'undefined') {
        switchLanguage(savedLang);
    } else {
        // Retry after a short delay if translations not loaded
        setTimeout(() => {
            if (typeof translations !== 'undefined') {
                switchLanguage(savedLang);
            }
        }, 100);
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Image lazy loading enhancement
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // Add loading animation to buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            if (this.getAttribute('href') && this.getAttribute('href').startsWith('http')) {
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            }
        });
    });

    // Enhanced navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Remove parallax effect for hero image to prevent overflow
    // 移除原有的視差效果代碼
    // const heroImage = document.querySelector('.figure-main-image');
    // if (heroImage) {
    //     window.addEventListener('scroll', function() {
    //         const scrolled = window.pageYOffset;
    //         const parallax = scrolled * 0.5;
    //         heroImage.style.transform = `translateY(${parallax}px)`;
    //     });
    // }

    // Add hover effects to timeline items
    document.querySelectorAll('.timeline-item').forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(10px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });

    // Add click to copy functionality for contact info
    document.querySelectorAll('[data-copy]').forEach(element => {
        element.addEventListener('click', function() {
            const text = this.getAttribute('data-copy');
            navigator.clipboard.writeText(text).then(() => {
                // Show temporary success message
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i> Copied!';
                setTimeout(() => {
                    this.innerHTML = originalText;
                }, 2000);
            });
        });
    });

    // Form validation and enhancement
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const inputs = this.querySelectorAll('input[required], textarea[required]');
            let isValid = true;

            inputs.forEach(input => {
                if (!input.value.trim()) {
                    input.classList.add('is-invalid');
                    isValid = false;
                } else {
                    input.classList.remove('is-invalid');
                }
            });

            if (!isValid) {
                e.preventDefault();
            }
        });
    });

    // Image Modal Functionality
    createImageModal();
    setupImageClickHandlers();

    console.log('Figure page scripts loaded successfully');
});

// Create Image Modal
function createImageModal() {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.id = 'imageModal';
    modal.innerHTML = `
        <button class="modal-close" onclick="closeImageModal()">&times;</button>
        <button class="modal-nav modal-prev" onclick="previousImage()">&#8249;</button>
        <div class="modal-content">
            <img class="modal-image" id="modalImage" src="" alt="">
            <div class="modal-caption" id="modalCaption"></div>
        </div>
        <button class="modal-nav modal-next" onclick="nextImage()">&#8250;</button>
    `;
    document.body.appendChild(modal);
}

// Setup Image Click Handlers
function setupImageClickHandlers() {
    // Handle main figure image
    const mainImage = document.querySelector('.figure-main-image');
    if (mainImage) {
        mainImage.addEventListener('click', function() {
            openImageModal(this.src, this.alt || 'Figure Image');
        });
    }

    // Handle gallery images
    const galleryImages = document.querySelectorAll('.gallery-image');
    galleryImages.forEach((img, index) => {
        img.addEventListener('click', function() {
            window.currentImageIndex = index;
            window.galleryImages = Array.from(galleryImages);
            openImageModal(this.src, this.alt || `Gallery Image ${index + 1}`);
        });
    });
}

// Open Image Modal
window.openImageModal = function(src, caption) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    
    modalImage.src = src;
    modalCaption.textContent = caption;
    modal.classList.add('active');
    
    // 防止背景滾動
    document.body.style.overflow = 'hidden';
    
    // 點擊背景關閉
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeImageModal();
        }
    });
    
    // ESC 鍵關閉
    document.addEventListener('keydown', handleModalKeydown);
    
    // 確保圖片適應螢幕尺寸
    modalImage.onload = function() {
        const imgRatio = this.naturalWidth / this.naturalHeight;
        const screenRatio = (window.innerWidth - 80) / (window.innerHeight - 80);
        
        if (imgRatio > screenRatio) {
            // 圖片較寬，以寬度為準
            this.style.maxWidth = `${window.innerWidth - 80}px`;
            this.style.maxHeight = 'auto';
        } else {
            // 圖片較高，以高度為準
            this.style.maxHeight = `${window.innerHeight - 80}px`;
            this.style.maxWidth = 'auto';
        }
    };
};

// Close Image Modal
window.closeImageModal = function() {
    const modal = document.getElementById('imageModal');
    modal.classList.remove('active');
    
    // 恢復背景滾動
    document.body.style.overflow = 'auto';
    
    // 移除事件監聽器
    document.removeEventListener('keydown', handleModalKeydown);
};

// Handle Modal Keyboard Navigation
function handleModalKeydown(e) {
    switch(e.key) {
        case 'Escape':
            closeImageModal();
            break;
        case 'ArrowLeft':
            previousImage();
            break;
        case 'ArrowRight':
            nextImage();
            break;
    }
}

// Previous Image
window.previousImage = function() {
    if (window.galleryImages && window.currentImageIndex !== undefined) {
        window.currentImageIndex = (window.currentImageIndex - 1 + window.galleryImages.length) % window.galleryImages.length;
        const img = window.galleryImages[window.currentImageIndex];
        const modalImage = document.getElementById('modalImage');
        const modalCaption = document.getElementById('modalCaption');
        
        modalImage.src = img.src;
        modalCaption.textContent = img.alt || `Gallery Image ${window.currentImageIndex + 1}`;
        
        // 重新調整圖片大小
        modalImage.onload = function() {
            const imgRatio = this.naturalWidth / this.naturalHeight;
            const screenRatio = (window.innerWidth - 80) / (window.innerHeight - 80);
            
            if (imgRatio > screenRatio) {
                this.style.maxWidth = `${window.innerWidth - 80}px`;
                this.style.maxHeight = 'auto';
            } else {
                this.style.maxHeight = `${window.innerHeight - 80}px`;
                this.style.maxWidth = 'auto';
            }
        };
    }
};

// Next Image
window.nextImage = function() {
    if (window.galleryImages && window.currentImageIndex !== undefined) {
        window.currentImageIndex = (window.currentImageIndex + 1) % window.galleryImages.length;
        const img = window.galleryImages[window.currentImageIndex];
        const modalImage = document.getElementById('modalImage');
        const modalCaption = document.getElementById('modalCaption');
        
        modalImage.src = img.src;
        modalCaption.textContent = img.alt || `Gallery Image ${window.currentImageIndex + 1}`;
        
        // 重新調整圖片大小
        modalImage.onload = function() {
            const imgRatio = this.naturalWidth / this.naturalHeight;
            const screenRatio = (window.innerWidth - 80) / (window.innerHeight - 80);
            
            if (imgRatio > screenRatio) {
                this.style.maxWidth = `${window.innerWidth - 80}px`;
                this.style.maxHeight = 'auto';
            } else {
                this.style.maxHeight = `${window.innerHeight - 80}px`;
                this.style.maxWidth = 'auto';
            }
        };
    }
};

// Enhanced image loading with loading states
function enhanceImageLoading() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        // Add loading placeholder
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        img.addEventListener('error', function() {
            this.style.opacity = '0.5';
            console.warn('Failed to load image:', this.src);
        });
        
        // Set initial opacity for smooth loading
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
        
        // If image is already loaded (cached)
        if (img.complete) {
            img.style.opacity = '1';
        }
    });
}

// Initialize enhanced image loading
document.addEventListener('DOMContentLoaded', enhanceImageLoading);

// Global utility functions
window.showToast = function(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-${type === 'success' ? 'check' : 'info'}-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
};

// Add CSS for toast notifications
const toastStyles = `
    .toast {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        padding: 1rem 1.5rem;
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    }
    
    .toast.show {
        transform: translateX(0);
    }
    
    .toast-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .toast-success {
        border-left: 4px solid #10b981;
    }
    
    .toast-info {
        border-left: 4px solid #3b82f6;
    }
    
    .toast-success i {
        color: #10b981;
    }
    
    .toast-info i {
        color: #3b82f6;
    }
`;

// Inject toast styles
const styleSheet = document.createElement('style');
styleSheet.textContent = toastStyles;
document.head.appendChild(styleSheet);

// 窗口大小改變時重新調整模態框圖片
window.addEventListener('resize', function() {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    
    if (modal && modal.classList.contains('active') && modalImage) {
        const imgRatio = modalImage.naturalWidth / modalImage.naturalHeight;
        const screenRatio = (window.innerWidth - 80) / (window.innerHeight - 80);
        
        if (imgRatio > screenRatio) {
            modalImage.style.maxWidth = `${window.innerWidth - 80}px`;
            modalImage.style.maxHeight = 'auto';
        } else {
            modalImage.style.maxHeight = `${window.innerHeight - 80}px`;
            modalImage.style.maxWidth = 'auto';
        }
    }
});
