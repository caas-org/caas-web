/**
 * CAARC Chatbot Widget
 * An AI Assistant mock / Support channel integration
 */

(function () {
  'use strict';

  // ============================================================
  // Chat Configuration
  // ============================================================
  const botIdentity = {
    en: {
      name: 'CAARC Assistant',
      greeting: 'Hello! I am the CAARC Resource Navigator. How can I help you support your family today?',
      placeholder: 'Type your message...',
      fallback: 'Thank you for your message. Currently, I am a simulated assistant. For personalized human support, please contact us.',
      volLink: 'Leave a message for our team',
    },
    zh: {
      name: 'CAARC 助手',
      greeting: '你好！我是CAARC资源导航员。今天我能如何帮助您的家庭？',
      placeholder: '输入您的消息...',
      fallback: '感谢您的留言。目前我是一个模拟助手。如需个性化的人工支持，请联系我们。',
      volLink: '给我们的团队留言',
    }
  };

  // Pre-programmed responses for the demo
  const mockResponses = [
    {
      keywords: ['screening', 'test', 'm-chat', 'diagnosis', '筛查', '测试', '诊断'],
      en: 'You can find information about early signs and our M-CHAT screening tool on our <a href="screening.html">Screening Tool</a> page.',
      zh: '您可以在我们的<a href="screening.html">筛查工具</a>页面找到有关早期迹象和M-CHAT筛查工具的信息。'
    },
    {
      keywords: ['support', 'group', 'community', 'parent', '互助', '小组', '社区', '家长'],
      en: 'Connecting with other parents is crucial. We have a list of local and online support groups on our <a href="community.html">Community</a> page.',
      zh: '与其他家长建立联系至关重要。我们在<a href="community.html">社区</a>页面提供了本地和在线互助小组的列表。'
    },
    {
      keywords: ['school', 'iep', 'education', 'system', '学校', '教育', '系统', '体系'],
      en: 'Navigating the education system takes time. Please check our <a href="navigate-system.html">Navigate the System</a> guide for tips on IEPs and school resources.',
      zh: '了解教育体系需要时间。请参阅我们的<a href="navigate-system.html">体系导航</a>指南，获取有关IEP和学校资源的提示。'
    }
  ];

  // ============================================================
  // Build Widget HTML
  // ============================================================
  function buildWidget() {
    const defaultLang = 'en'; // It doesn't matter, we update dynamically
    
    const widgetHTML = `
      <div id="chat-widget">
        <div id="chat-window">
          <div class="chat-header">
            <div class="chat-title">
              <span class="en-text">CAARC Assistant</span>
              <span class="zh-text">CAARC 助手</span>
            </div>
            <button class="chat-close-btn" id="chat-close-btn" aria-label="Close Chat">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="chat-messages" id="chat-messages">
            <!-- Messages added here dynamically -->
          </div>
          <div class="chat-input-area">
            <input type="text" id="chat-input-field" placeholder="Type your message..." />
            <button id="chat-send-btn" aria-label="Send Message">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
        
        <button id="chat-toggle-btn" aria-label="Open Chat">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', widgetHTML);
  }

  // ============================================================
  // Logic
  // ============================================================
  let isChatOpen = false;
  
  function getLang() {
    return document.documentElement.classList.contains('lang-zh') ? 'zh' : 'en';
  }

  function appendMessage(sender, textEn, textZh) {
    const messagesContainer = document.getElementById('chat-messages');
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-message ${sender}`;
    
    // We only display the required language explicitly based on current site lang, 
    // or we display both. Let's make it auto-update based on CSS classes, similar to other site elements!
    msgDiv.innerHTML = `
      <span class="en">${textEn}</span>
      <span class="zh">${textZh || textEn}</span>
    `;
    messagesContainer.appendChild(msgDiv);
    
    // Auto-scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function toggleChat() {
    const chatWindow = document.getElementById('chat-window');
    isChatOpen = !isChatOpen;
    if (isChatOpen) {
      chatWindow.classList.add('open');
      document.getElementById('chat-input-field').focus();
    } else {
      chatWindow.classList.remove('open');
    }
  }

  function getBotResponse(userMsg) {
    const msgLower = userMsg.toLowerCase();
    
    // Check for pre-programmed responses
    for (let r of mockResponses) {
      for (let kw of r.keywords) {
        if (msgLower.includes(kw)) {
          return { en: r.en, zh: r.zh };
        }
      }
    }
    
    // Fallback response with link to contact page
    const curLang = getLang();
    const fallbackEn = botIdentity.en.fallback + ` <br><br><a href="contact.html"><strong>${botIdentity.en.volLink} →</strong></a>`;
    const fallbackZh = botIdentity.zh.fallback + ` <br><br><a href="contact.html"><strong>${botIdentity.zh.volLink} →</strong></a>`;
    
    return { en: fallbackEn, zh: fallbackZh };
  }

  function handleSend() {
    const inputField = document.getElementById('chat-input-field');
    const text = inputField.value.trim();
    if (!text) return;

    // The user input is the same in EN and ZH spans for simplicity
    appendMessage('user', text, text);
    inputField.value = '';

    // Simulate thinking delay
    setTimeout(() => {
      const response = getBotResponse(text);
      appendMessage('bot', response.en, response.zh);
    }, 1000);
  }

  function updateWidgetLanguage() {
    const lang = getLang();
    const inputField = document.getElementById('chat-input-field');
    const titleEn = document.querySelector('.chat-title .en-text');
    const titleZh = document.querySelector('.chat-title .zh-text');
    
    if (inputField) {
      inputField.placeholder = botIdentity[lang].placeholder;
    }
    
    if (lang === 'en') {
      titleEn.style.display = 'block';
      titleZh.style.display = 'none';
    } else {
      titleEn.style.display = 'none';
      titleZh.style.display = 'block';
    }
  }

  // Monitor DOM for lang class changes to dynamically update widget text
  function setupLangObserver() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          updateWidgetLanguage();
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });
  }

  // ============================================================
  // Initialize
  // ============================================================
  function init() {
    buildWidget();
    
    // Send initial greeting
    appendMessage('bot', botIdentity.en.greeting, botIdentity.zh.greeting);

    // Event Listeners
    document.getElementById('chat-toggle-btn').addEventListener('click', toggleChat);
    document.getElementById('chat-close-btn').addEventListener('click', toggleChat);
    
    document.getElementById('chat-send-btn').addEventListener('click', handleSend);
    document.getElementById('chat-input-field').addEventListener('keypress', function (e) {
      if (e.key === 'Enter') handleSend();
    });

    updateWidgetLanguage();
    setupLangObserver();
  }

  // Run when DOM is ready (or immediately if injected after load)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
