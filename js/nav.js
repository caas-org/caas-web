/**
 * Chinese American Autism Resource Center
 * Shared Navigation & Footer Component
 * 
 * This file dynamically injects the navigation bar and footer into every page.
 * To add or remove a navigation link, edit the `navLinks` array below.
 */

(function () {
  'use strict';

  // ============================================================
  // EDITABLE: Navigation Links
  // To add a new page, add an entry here with href, en, and zh.
  // ============================================================
  const navLinks = [
    { href: 'index.html', en: 'Home', zh: '首页' },
    { href: 'what-is-autism.html', en: 'What is Autism', zh: '什么是自闭症' },
    { href: 'resources.html', en: 'Resources', zh: '资源' },
    { href: 'navigate-system.html', en: 'Navigate the System', zh: '体系导航' },
    { href: 'community.html', en: 'Community', zh: '社区' },
    { href: 'screening.html', en: 'Screening Tool', zh: '筛查工具' },
    { href: 'faq.html', en: 'FAQ', zh: '常见问题' },
    { href: 'contact.html', en: 'Contact', zh: '联系我们' },
  ];

  // ============================================================
  // Language Detection & Toggle
  // ============================================================
  function getDefaultLang() {
    const stored = localStorage.getItem('preferred-lang');
    if (stored) return stored;
    const sysLang = navigator.language || navigator.userLanguage || 'en';
    return sysLang.startsWith('zh') ? 'zh' : 'en';
  }

  function setLang(lang) {
    document.documentElement.classList.remove('lang-en', 'lang-zh');
    document.documentElement.classList.add('lang-' + lang);
    localStorage.setItem('preferred-lang', lang);
    updateLangToggle(lang);
  }

  function toggleLang() {
    const current = document.documentElement.classList.contains('lang-zh') ? 'zh' : 'en';
    setLang(current === 'en' ? 'zh' : 'en');
  }

  function updateLangToggle(lang) {
    const btn = document.getElementById('lang-toggle-btn');
    if (btn) {
      const label = btn.querySelector('.lang-label');
      if (label) {
        label.textContent = lang === 'en' ? '中文' : 'English';
      }
    }
  }

  // ============================================================
  // Build Navigation HTML
  // ============================================================
  function getCurrentPage() {
    const path = window.location.pathname;
    const filename = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
    return filename;
  }

  function buildNav() {
    const currentPage = getCurrentPage();

    const linksHTML = navLinks.map(link => {
      const isActive = link.href === currentPage ? ' active' : '';
      return `<li><a href="${link.href}" class="${isActive}">
        <span class="en">${link.en}</span>
        <span class="zh">${link.zh}</span>
      </a></li>`;
    }).join('');

    return `
    <nav class="navbar" role="navigation" aria-label="Main navigation">
      <div class="nav-container">
        <a href="index.html" class="nav-logo" aria-label="Home">
          <img src="images/logo.png" alt="CAAS Logo" class="nav-logo-icon">
          <div class="nav-logo-text">
            <span class="en">CAARC</span>
            <span class="zh">华裔自闭症资源中心</span>
          </div>
        </a>
        <ul class="nav-links" id="nav-links">
          ${linksHTML}
        </ul>
        <div class="nav-actions" style="display:flex;align-items:center;gap:8px;">
          <button class="lang-toggle" id="lang-toggle-btn" aria-label="Switch language" title="Switch language">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
            <span class="lang-label">中文</span>
          </button>
          <button class="nav-hamburger" id="nav-hamburger" aria-label="Toggle menu" aria-expanded="false">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </nav>`;
  }

  // ============================================================
  // Build Footer HTML
  // ============================================================
  function buildFooter() {
    const quickLinksHTML = navLinks.slice(0, 4).map(link =>
      `<li><a href="${link.href}">
        <span class="en">${link.en}</span>
        <span class="zh">${link.zh}</span>
      </a></li>`
    ).join('');

    const moreLinksHTML = navLinks.slice(4).map(link =>
      `<li><a href="${link.href}">
        <span class="en">${link.en}</span>
        <span class="zh">${link.zh}</span>
      </a></li>`
    ).join('');

    return `
    <footer class="footer">
      <div class="footer-grid">
        <div class="footer-about">
          <img src="images/logo_text.png" alt="CAAS Text Logo" class="footer-logo">
          <p style="margin-top: 1rem;">
            <span class="en">Providing culturally sensitive autism resources and support for Chinese American families.</span>
            <span class="zh">为华裔美国家庭提供具有文化敏感性的自闭症资源和支持。</span>
          </p>
        </div>
        <div class="footer-links">
          <h4>
            <span class="en">Quick Links</span>
            <span class="zh">快速链接</span>
          </h4>
          <ul>${quickLinksHTML}</ul>
        </div>
        <div class="footer-links">
          <h4>
            <span class="en">More</span>
            <span class="zh">更多</span>
          </h4>
          <ul>${moreLinksHTML}</ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>
          <span class="en">&copy; ${new Date().getFullYear()} Chinese American Autism Resource Center. All rights reserved.</span>
          <span class="zh">&copy; ${new Date().getFullYear()} 华裔自闭症资源中心。版权所有。</span>
        </p>
      </div>
    </footer>`;
  }

  // ============================================================
  // Initialize
  // ============================================================
  function init() {
    // Set language
    setLang(getDefaultLang());

    // Inject nav at top of body
    document.body.insertAdjacentHTML('afterbegin', buildNav());

    // Inject footer at end of body
    document.body.insertAdjacentHTML('beforeend', buildFooter());

    // Language toggle
    document.getElementById('lang-toggle-btn').addEventListener('click', toggleLang);

    // Hamburger menu
    const hamburger = document.getElementById('nav-hamburger');
    const navLinksEl = document.getElementById('nav-links');
    hamburger.addEventListener('click', function () {
      navLinksEl.classList.toggle('active');
      hamburger.classList.toggle('active');
      hamburger.setAttribute('aria-expanded',
        hamburger.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
    });

    // Close menu on link click (mobile)
    navLinksEl.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinksEl.classList.remove('active');
        hamburger.classList.remove('active');
      });
    });
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
