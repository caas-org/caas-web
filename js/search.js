/**
 * CAARC Local Search functionality
 * Static JSON index for instantaneous search without a backend
 */

(function () {
  'use strict';

  // ============================================================
  // Search Index (Static Database)
  // ============================================================
  const searchIndex = [
    {
      url: 'index.html',
      title: { en: 'Home', zh: '首页' },
      keywords: 'home, start, caarc, welcome, mission, 主页, 开始, 欢迎, 使命',
      desc: { en: 'CAARC homepage and general overview.', zh: 'CAARC 首页和总览。' }
    },
    {
      url: 'what-is-autism.html',
      title: { en: 'What is Autism', zh: '什么是自闭症' },
      keywords: 'what is autism, definition, spectrum disorder, signs, symptoms, 什么是自闭症, 谱系障碍, 迹象, 症状',
      desc: { en: 'Learn about autism spectrum disorder and early signs.', zh: '了解自闭症谱系障碍和早期迹象。' }
    },
    {
      url: 'resources.html',
      title: { en: 'Resources', zh: '资源' },
      keywords: 'resources, therapy, aba, speech therapy, occupational therapy, organizations, 资源, 治疗, 语言治疗, 机构, 职业治疗',
      desc: { en: 'Explore therapy options, support services, and organizations.', zh: '探索治疗选择、支持服务和机构。' }
    },
    {
      url: 'navigate-system.html',
      title: { en: 'Navigate the System', zh: '体系导航' },
      keywords: 'navigate, system, iep, school, regional center, education, rights, 导航, 体系, 学校, 区域中心, 教育, 权利',
      desc: { en: 'Guide to navigating IEPs, schools, and regional center systems.', zh: '了解IEP、学校和区域中心体系的指南。' }
    },
    {
      url: 'community.html',
      title: { en: 'Community', zh: '社区' },
      keywords: 'community, support group, parents, forum, wechat, stories, family, 社区, 互助小组, 家长, 论坛, 微信, 故事, 家庭',
      desc: { en: 'Connect with support groups and read family stories.', zh: '与互助小组建立联系并阅读家庭故事。' }
    },
    {
      url: 'screening.html',
      title: { en: 'Screening Tool', zh: '筛查工具' },
      keywords: 'screening, tool, m-chat, test, diagnosis, assessment, early, 筛查, 工具, 测试, 诊断, 评估, 早期',
      desc: { en: 'Information on the M-CHAT screening tool and early diagnosis.', zh: '有关M-CHAT筛查工具和早期诊断的信息。' }
    },
    {
      url: 'faq.html',
      title: { en: 'FAQ (Frequently Asked Questions)', zh: '常见问题' },
      keywords: 'faq, questions, answers, common, help, 常见问题, 问答, 帮助',
      desc: { en: 'Answers to frequently asked questions about autism and our center.', zh: '关于自闭症和我们中心的常见问题解答。' }
    },
    {
      url: 'contact.html',
      title: { en: 'Contact Us', zh: '联系我们' },
      keywords: 'contact, email, address, phone, support, volunteers, message, 联系, 邮箱, 地址, 电话, 支持, 志愿者, 留言',
      desc: { en: 'Get in touch with the CAARC team for personalized support.', zh: '与CAARC团队联系以获取个性化支持。' }
    }
  ];

  // ============================================================
  // Build Search HTML
  // ============================================================
  function buildSearchModal() {
    const modalHTML = `
      <div id="search-overlay">
        <div class="search-modal" role="dialog" aria-modal="true" aria-label="Site Search">
          <div class="search-header">
            <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text" id="search-input" placeholder="Search resources..." autocomplete="off">
            <button class="search-close-btn" id="search-close-btn" aria-label="Close Search">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="search-results-container" id="search-results">
            <!-- Results will be injected here -->
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }

  // ============================================================
  // Search Logic
  // ============================================================
  let isSearchOpen = false;

  function getLang() {
    return document.documentElement.classList.contains('lang-zh') ? 'zh' : 'en';
  }

  function toggleSearch() {
    const overlay = document.getElementById('search-overlay');
    const input = document.getElementById('search-input');
    
    isSearchOpen = !isSearchOpen;
    
    if (isSearchOpen) {
      overlay.classList.add('open');
      input.value = ''; // Clear previous
      renderResults([]); // Clear results
      setTimeout(() => input.focus(), 100);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  function handleInput(e) {
    const query = e.target.value.toLowerCase().trim();
    if (!query) {
      renderResults([]);
      return;
    }

    const lang = getLang();
    
    // Filter index
    const results = searchIndex.filter(item => {
      const titleMatch = item.title.en.toLowerCase().includes(query) || item.title.zh.toLowerCase().includes(query);
      const keywordMatch = item.keywords.toLowerCase().includes(query);
      const descMatch = item.desc.en.toLowerCase().includes(query) || item.desc.zh.toLowerCase().includes(query);
      return titleMatch || keywordMatch || descMatch;
    });

    renderResults(results);
  }

  function renderResults(results) {
    const container = document.getElementById('search-results');
    const lang = getLang();
    
    if (results.length === 0 && document.getElementById('search-input').value.trim() !== '') {
      const msg = lang === 'en' ? 'No results found.' : '未找到相关结果。';
      container.innerHTML = `<div class="no-results">${msg}</div>`;
      return;
    }
    
    if (results.length === 0) {
      container.innerHTML = '';
      return;
    }

    const html = results.map(r => {
      return `
        <a href="${r.url}" class="search-result-item">
          <div class="search-result-title">${r.title[lang] || r.title.en}</div>
          <div class="search-result-desc">${r.desc[lang] || r.desc.en}</div>
        </a>
      `;
    }).join('');

    container.innerHTML = html;
  }

  function updateSearchLanguage() {
    const lang = getLang();
    const input = document.getElementById('search-input');
    if (input) {
      input.placeholder = lang === 'en' ? 'Search resources...' : '搜索资源...';
    }
    // Re-render results to update language language context
    if (isSearchOpen) {
       handleInput({ target: input });
    }
  }

  // ============================================================
  // Initialize
  // ============================================================
  function init() {
    buildSearchModal();
    
    // Listen for search open clicks (Triggered by button added to nav.js)
    document.addEventListener('open-site-search', toggleSearch);
    
    const overlay = document.getElementById('search-overlay');
    const closeBtn = document.getElementById('search-close-btn');
    const input = document.getElementById('search-input');
    
    // Event listeners
    closeBtn.addEventListener('click', toggleSearch);
    
    // Close on clicking outside the modal
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) toggleSearch();
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isSearchOpen) toggleSearch();
    });

    input.addEventListener('input', handleInput);

    // Watch for language changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          updateSearchLanguage();
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });
    
    // Initialize correct language placeholder
    updateSearchLanguage();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
