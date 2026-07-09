/**
 * Shared Navbar — re-ing
 * Usage: place <div id="navbar-placeholder"></div> where the <nav> should be,
 * then include this script right after: <script src="PATH/TO/navbar.js"></script>
 * The path to navbar.js automatically determines the root URL.
 */
(function () {
    'use strict';

    // Derive root path from this script's own src attribute.
    // e.g. src="../../navbar.js"  →  root = "../../"
    //      src="navbar.js"        →  root = ""
    var src = document.currentScript ? document.currentScript.getAttribute('src') : 'navbar.js';
    var root = src.replace(/navbar\.js$/, '');
    var r = root || './';   // use "./" for brand href when root is empty (index page)

    // Inject canonical navbar CSS — overrides any conflicting per-page CSS
    if (!document.getElementById('navbar-shared-css')) {
        var style = document.createElement('style');
        style.id = 'navbar-shared-css';
        style.textContent = [
            '#re-ing-navbar .nav-link {',
            '    color: #1F2937 !important;',
            '    font-weight: 500;',
            '    font-size: 0.9rem;',
            '    padding: 0.5rem 0.75rem;',
            '    position: relative;',
            '    transition: color 0.3s ease;',
            '    text-decoration: none !important;',
            '    letter-spacing: 0.01em;',
            '}',
            '#re-ing-navbar .nav-link:hover { color: #333333 !important; }',
            '#re-ing-navbar .lang-toggle {',
            '    background: transparent !important;',
            '    border: none !important;',
            '    box-shadow: none !important;',
            '    border-radius: 0 !important;',
            '    padding: 0.4rem 0.5rem !important;',
            '    display: flex !important;',
            '    align-items: center !important;',
            '    text-decoration: none !important;',
            '    color: #1F2937;',
            '}',
            '#re-ing-navbar .lang-toggle::after { display: none !important; }',
            '#re-ing-navbar .lang-toggle img { width: 20px; height: auto; margin-right: 0; }',
            '#re-ing-navbar .navbar-toggler { border: none !important; box-shadow: none !important; padding: 0.25rem 0.5rem; }',
            '#re-ing-navbar .navbar-toggler:focus { box-shadow: none !important; outline: none !important; }',
            '#re-ing-navbar .navbar-toggler i {',
            '    font-family: "Font Awesome 6 Free", "FontAwesome", sans-serif !important;',
            '    font-weight: 900 !important;',
            '    font-size: 1.1rem;',
            '    color: #333333;',
            '}',
            '#re-ing-navbar .dropdown-menu {',
            '    min-width: 120px;',
            '    border-radius: 8px;',
            '    box-shadow: 0 4px 12px rgba(0,0,0,0.1);',
            '    border: none;',
            '    padding: 0.5rem 0;',
            '}',
            '#re-ing-navbar .dropdown-item {',
            '    font-size: 0.9rem;',
            '    padding: 0.5rem 1rem;',
            '    color: #1F2937;',
            '}',
            '#re-ing-navbar .dropdown-item:hover { background: #f0f0f0; color: #111; }'
        ].join('\n');
        var head = document.head || document.getElementsByTagName('head')[0];
        if (head) head.appendChild(style);
    }

    var navHTML = '<nav id="re-ing-navbar" class="navbar navbar-expand-lg fixed-top">\n'
        + '    <div class="container">\n'
        + '        <a class="navbar-brand" href="' + r + '">\n'
        + '            <img src="' + root + 'assets/images/re-ing Logo.png" alt="re-ing Logo">\n'
        + '        </a>\n'
        + '        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"\n'
        + '            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">\n'
        + '            <i class="fas fa-bars"></i>\n'
        + '        </button>\n'
        + '        <div class="collapse navbar-collapse" id="navbarNav">\n'
        + '            <ul class="navbar-nav ms-auto">\n'
        + '                <li class="nav-item"><a class="nav-link" href="' + root + '#about-reing" data-i18n="nav.aboutReing">About re-ing</a></li>\n'
        + '                <li class="nav-item"><a class="nav-link" href="' + root + 'sustainability-cases" data-i18n="nav.sustainabilityCases">永續設計案例</a></li>\n'
        + '                <li class="nav-item"><a class="nav-link" href="' + root + 'retwist" data-i18n="nav.retwist">RE:TWIST Project</a></li>\n'
        + '                <li class="nav-item"><a class="nav-link" href="' + root + 'srmark/" data-i18n="nav.srmark">SR MARK Taiwan Sustainable Design Alliance</a></li>\n'
        + '                <li class="nav-item"><a class="nav-link" href="' + root + '#contact" data-i18n="nav.contact">Contact Us</a></li>\n'
        + '                <li class="nav-item dropdown lang-dropdown">\n'
        + '                    <a class="lang-toggle dropdown-toggle" href="#" id="langDropdown" role="button"\n'
        + '                        data-bs-toggle="dropdown" aria-expanded="false">\n'
        + '                        <img src="' + root + 'assets/images/language.png" alt="Language" style="width:20px;height:auto;">\n'
        + '                    </a>\n'
        + '                    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="langDropdown">\n'
        + '                        <li><a class="dropdown-item" href="#" onclick="switchLanguage(\'en\'); return false;">English</a></li>\n'
        + '                        <li><a class="dropdown-item" href="#" onclick="switchLanguage(\'zh\'); return false;">中文</a></li>\n'
        + '                        <li><a class="dropdown-item" href="#" onclick="switchLanguage(\'nl\'); return false;">Nederlands</a></li>\n'
        + '                        <li><a class="dropdown-item" href="#" onclick="switchLanguage(\'ja\'); return false;">日本語</a></li>\n'
        + '                    </ul>\n'
        + '                </li>\n'
        + '            </ul>\n'
        + '        </div>\n'
        + '    </div>\n'
        + '</nav>';

    var el = document.getElementById('navbar-placeholder');
    if (el) {
        el.outerHTML = navHTML;
    }
}());
