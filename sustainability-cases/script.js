document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS (Animate on Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init();
    }

    // Set language based on saved preference or default
    const savedLang = localStorage.getItem('language') || 'zh';
    if (typeof setLanguage === 'function') {
        setLanguage(savedLang);
    }
});
