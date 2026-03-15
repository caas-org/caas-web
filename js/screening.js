/**
 * AI-Powered Autism Screening Checklist
 * Uses Gemini API (free tier) for personalized bilingual guidance.
 *
 * ============================================================
 * API KEY CONFIGURATION:
 * The API key is now stored in js/config.js which is gitignored.
 * To use locally, copy js/config.template.js to js/config.js 
 * and add your key.
 * ============================================================
 */
const GEMINI_API_KEY = typeof window.LOCAL_KEYS !== 'undefined' ? window.LOCAL_KEYS.GEMINI_API_KEY : '';
const FIREBASE_CONFIG = typeof CONFIG !== 'undefined' ? CONFIG.FIREBASE_CONFIG : null;
const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
let firebaseModel = null;

// ============================================================
// Checklist Questions by Age Group
// Based on M-CHAT-R/F developmental milestones
// ============================================================
const checklistData = {
  '0-12': {
    labelEn: '0–12 Months',
    labelZh: '0–12 个月',
    questions: [
      { id: 'a1', en: 'Does your baby make eye contact with you during feeding or play?', zh: '您的宝宝在喂食或玩耍时会和您进行目光接触吗？' },
      { id: 'a2', en: 'Does your baby smile back when you smile at them?', zh: '当您对宝宝微笑时，宝宝会回应微笑吗？' },
      { id: 'a3', en: 'Does your baby babble or make sounds (e.g., "ba-ba", "ma-ma")?', zh: '您的宝宝会咿呀学语或发出声音（如"ba-ba"、"ma-ma"）吗？' },
      { id: 'a4', en: 'Does your baby respond to their name when called?', zh: '叫宝宝名字时，宝宝会有反应吗？' },
      { id: 'a5', en: 'Does your baby use gestures like waving bye-bye or reaching to be picked up?', zh: '您的宝宝会做手势，比如挥手再见或伸手要抱吗？' },
      { id: 'a6', en: 'Does your baby look at objects you point to?', zh: '当您指向某个物体时，宝宝会看向它吗？' },
      { id: 'a7', en: 'Does your baby seem interested in other babies or children?', zh: '您的宝宝对其他婴儿或小朋友表现出兴趣吗？' },
      { id: 'a8', en: 'Does your baby show emotions like happiness, sadness, or frustration?', zh: '您的宝宝会表现出快乐、悲伤或沮丧等情绪吗？' },
    ]
  },
  '12-24': {
    labelEn: '12–24 Months',
    labelZh: '12–24 个月',
    questions: [
      { id: 'b1', en: 'Does your child point to things to show you something interesting?', zh: '您的孩子会指向某些东西来给您看有趣的事物吗？' },
      { id: 'b2', en: 'Does your child make eye contact with you during interactions?', zh: '您的孩子在互动时会和您进行眼神交流吗？' },
      { id: 'b3', en: 'Does your child engage in pretend play (e.g., feeding a doll, talking on a toy phone)?', zh: '您的孩子会进行假装游戏吗（如喂洋娃娃、用玩具电话打电话）？' },
      { id: 'b4', en: 'Does your child respond when you call their name?', zh: '当您叫孩子的名字时，孩子会有回应吗？' },
      { id: 'b5', en: 'Does your child use words or try to communicate their needs?', zh: '您的孩子会用语言或尝试表达自己的需求吗？' },
      { id: 'b6', en: 'Does your child seem interested in other children?', zh: '您的孩子对其他小朋友表现出兴趣吗？' },
      { id: 'b7', en: 'Does your child bring objects to show you?', zh: '您的孩子会拿东西来给您看吗？' },
      { id: 'b8', en: 'Does your child imitate what you do (e.g., clapping, making faces)?', zh: '您的孩子会模仿您的行为吗（如拍手、做鬼脸）？' },
      { id: 'b9', en: 'Does your child look where you look when you point at something?', zh: '当您指向某处时，您的孩子会看向同一方向吗？' },
      { id: 'b10', en: 'Does your child walk on their own?', zh: '您的孩子能独立行走吗？' },
    ]
  },
  '24-48': {
    labelEn: '24–48 Months',
    labelZh: '24–48 个月',
    questions: [
      { id: 'c1', en: 'Does your child use two-word phrases (e.g., "want milk", "go park")?', zh: '您的孩子会使用两个词的短语吗（如"要牛奶"、"去公园"）？' },
      { id: 'c2', en: 'Does your child play with other children (not just alongside them)?', zh: '您的孩子会和其他小朋友一起玩耍吗（不仅仅是在旁边玩）？' },
      { id: 'c3', en: 'Does your child engage in imaginative play with toys?', zh: '您的孩子会用玩具进行想象游戏吗？' },
      { id: 'c4', en: 'Does your child follow simple instructions (e.g., "put on your shoes")?', zh: '您的孩子能听从简单的指令吗（如"穿上鞋子"）？' },
      { id: 'c5', en: 'Does your child show a range of emotions and express them appropriately?', zh: '您的孩子能表现出各种情绪并恰当地表达吗？' },
      { id: 'c6', en: 'Does your child maintain eye contact during conversations?', zh: '您的孩子在交谈时能保持眼神接触吗？' },
      { id: 'c7', en: 'Does your child have any unusually intense interests or repetitive behaviors?', zh: '您的孩子有异常强烈的兴趣或重复性行为吗？' },
      { id: 'c8', en: 'Does your child get upset by minor changes in routine?', zh: '日常变化会让您的孩子感到不安吗？' },
      { id: 'c9', en: 'Does your child respond to their name consistently?', zh: '您的孩子能持续地回应叫名吗？' },
      { id: 'c10', en: 'Is your child overly sensitive to sounds, textures, or lights?', zh: '您的孩子对声音、质地或光线是否过于敏感？' },
    ]
  },
  '4+': {
    labelEn: '4+ Years',
    labelZh: '4 岁以上',
    questions: [
      { id: 'd1', en: 'Does your child have difficulty making or keeping friends?', zh: '您的孩子在交友或维持友谊方面有困难吗？' },
      { id: 'd2', en: 'Does your child have difficulty understanding other people\'s feelings?', zh: '您的孩子在理解他人感受方面有困难吗？' },
      { id: 'd3', en: 'Does your child have difficulty with back-and-forth conversation?', zh: '您的孩子在进行来回对话方面有困难吗？' },
      { id: 'd4', en: 'Does your child have an unusually intense interest in specific topics?', zh: '您的孩子对特定话题有异常强烈的兴趣吗？' },
      { id: 'd5', en: 'Does your child struggle with changes in routine or transitions?', zh: '您的孩子在应对日常变化或过渡时有困难吗？' },
      { id: 'd6', en: 'Does your child take things very literally or miss sarcasm/jokes?', zh: '您的孩子是否倾向于字面理解事物，或不理解讽刺/玩笑？' },
      { id: 'd7', en: 'Does your child have repetitive movements (e.g., hand flapping, rocking)?', zh: '您的孩子是否有重复性动作（如拍手、摇晃身体）？' },
      { id: 'd8', en: 'Does your child have unusual reactions to sensory input (sounds, textures, smells)?', zh: '您的孩子对感官刺激（声音、质地、气味）是否有异常反应？' },
      { id: 'd9', en: 'Does your child have difficulty with nonverbal communication (gestures, facial expressions)?', zh: '您的孩子在非语言沟通（手势、面部表情）方面有困难吗？' },
      { id: 'd10', en: 'Does your child prefer to play alone rather than with others?', zh: '您的孩子是否更喜欢独自玩耍而不是和别人一起？' },
    ]
  }
};

// ============================================================
// UI Logic
// ============================================================
let currentAgeGroup = null;

function selectAgeGroup(group) {
  currentAgeGroup = group;

  // Update button states
  document.querySelectorAll('.age-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.age === group);
  });

  // Build checklist
  const data = checklistData[group];
  const container = document.getElementById('checklist-items');
  const lang = document.documentElement.classList.contains('lang-zh') ? 'zh' : 'en';

  container.innerHTML = data.questions.map(q => `
    <label class="checklist-item" for="check-${q.id}">
      <input type="checkbox" id="check-${q.id}" value="${q.id}">
      <span class="checkmark"></span>
      <span class="question-text">
        <span class="en">${q.en}</span>
        <span class="zh">${q.zh}</span>
        <textarea id="detail-${q.id}" class="detail-input" placeholder="${lang === 'en' ? 'Optional: Provide more details or examples...' : '选填：提供更多细节或例子...'}"></textarea>
      </span>
    </label>
  `).join('');

  // Show checklist section
  document.getElementById('checklist-section').style.display = 'block';

  // Hide previous AI response
  document.getElementById('ai-response-section').style.display = 'none';

  // Update the section title
  const titleEn = document.getElementById('checklist-title-en');
  const titleZh = document.getElementById('checklist-title-zh');
  if (titleEn) titleEn.textContent = `Screening Questions: ${data.labelEn}`;
  if (titleZh) titleZh.textContent = `筛查问题：${data.labelZh}`;
}

function getCheckedItems() {
  const checked = [];
  const data = checklistData[currentAgeGroup];
  data.questions.forEach(q => {
    const el = document.getElementById(`check-${q.id}`);
    if (el && el.checked) {
      const detailEl = document.getElementById(`detail-${q.id}`);
      const details = detailEl && detailEl.value.trim() ? detailEl.value.trim() : null;
      checked.push({ ...q, userDetails: details });
    }
  });
  return checked;
}

function getUncheckedItems() {
  const unchecked = [];
  const data = checklistData[currentAgeGroup];
  data.questions.forEach(q => {
    const el = document.getElementById(`check-${q.id}`);
    if (el && !el.checked) {
      unchecked.push(q);
    }
  });
  return unchecked;
}

// ============================================================
// Gemini API Call
// ============================================================
async function getAIGuidance() {
  if (!currentAgeGroup) return;

  const checked = getCheckedItems();
  const unchecked = getUncheckedItems();
  const totalQuestions = checklistData[currentAgeGroup].questions.length;
  const ageLabel = checklistData[currentAgeGroup].labelEn;

  // Show loading
  const responseSection = document.getElementById('ai-response-section');
  const responseContent = document.getElementById('ai-response-content');
  const loadingEl = document.getElementById('ai-loading');
  const submitBtn = document.getElementById('submit-btn');
  const aiActions = document.getElementById('ai-actions');

  responseSection.style.display = 'block';
  responseContent.style.display = 'none';
  aiActions.style.display = 'none';
  loadingEl.style.display = 'flex';
  submitBtn.disabled = true;

  // Scroll to response
  responseSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Build the prompt
  // Include user details if provided
  const concernBehaviors = checked.map(q => {
    let text = `- ${q.en}`;
    if (q.userDetails) {
      text += `\n  Parent's specific details/examples: "${q.userDetails}"`;
    }
    return text;
  }).join('\n');
  const typicalBehaviors = unchecked.map(q => `- ${q.en}`).join('\n');

  // Determine current language
  const currentLang = document.documentElement.classList.contains('lang-zh') ? 'Chinese (Simplified)' : 'English';

  const systemPrompt = `You are a developmental pediatrics information resource for Chinese American families. 
You are NOT a doctor and cannot diagnose. You provide educational guidance only.

CRITICAL RULES:
1. NEVER diagnose or say a child "has autism" or "does not have autism"
2. ALWAYS prominently include a disclaimer that this is NOT a diagnosis and recommend professional evaluation
3. You MUST respond ONLY in ${currentLang}. Do not include translations.
4. Be culturally sensitive - acknowledge that in Chinese culture, developmental concerns may carry stigma, and normalize seeking help
5. Address the specific details and examples the parent provided for their concerns. Incorporate these into your assessment and recommendations to make the guidance highly personalized
6. Provide specific, actionable next steps
7. Mention relevant resources (pediatrician, Early Intervention for ages 0-3, school district evaluation for 3+)
8. Be warm, supportive, and encouraging
9. Format with clear sections using markdown headings (##) and bullet points`;

  let userPrompt = `A parent has completed a developmental screening checklist for their child in the ${ageLabel} age group.\n\n`;

  userPrompt += `Out of ${totalQuestions} questions:\n`;
  userPrompt += `- ${checked.length} areas of concern were identified\n`;
  userPrompt += `- ${unchecked.length} areas showed typical development\n\n`;

  if (checked.length > 0) {
    userPrompt += `Here are the SPECIFIC AREAS OF CONCERN (behaviors NOT observed or present), along with the parent's detailed input:\n`;
    userPrompt += concernBehaviors + `\n\n`;
  } else {
    userPrompt += `The parent did not note any specific concerns.\n\n`;
  }

  if (unchecked.length > 0) {
    userPrompt += `Here are the areas showing TYPICAL DEVELOPMENT (behaviors observed):\n`;
    userPrompt += typicalBehaviors + `\n\n`;
  }

  userPrompt += `Please provide (in ${currentLang} ONLY):\n`;
  userPrompt += `1. A brief assessment of the overall screening results (low concern / some concern / elevated concern)\n`;
  userPrompt += `2. Explanation of what these results might mean\n`;
  userPrompt += `3. Specific recommended next steps\n`;
  userPrompt += `4. Culturally sensitive encouragement for the family\n`;
  userPrompt += `5. Relevant resources and who to contact`;

  try {
    if (GEMINI_API_KEY === 'YOUR_API_KEY_HERE') {
      throw new Error('API_KEY_NOT_SET');
    }
    let resultText = '';

    if (GEMINI_API_KEY && GEMINI_API_KEY !== 'YOUR_API_KEY_HERE') {
      // MODE 1: Local Development (Direct REST API)
      const data = {
        contents: [{ parts: [{ text: userPrompt }] }],
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        },
        generationConfig: {
          temperature: 0.3, 
          topK: 40,
          topP: 0.95,
        }
      };

      const res = await fetch(GEMINI_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || 'API Error');
      }
      resultText = json.candidates[0].content.parts[0].text;

    } else if (FIREBASE_CONFIG) {
      // MODE 2: Production (Firebase AI Logic SDK)
      if (!firebaseModel) {
        // Dynamically import Firebase SDKs
        const { initializeApp } = await import('https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js');
        const { getVertexAI, getGenerativeModel } = await import('https://www.gstatic.com/firebasejs/11.1.0/firebase-vertexai.js');
        
        const app = initializeApp(FIREBASE_CONFIG);
        const vertexAI = getVertexAI(app);
        
        firebaseModel = getGenerativeModel(vertexAI, { 
          model: GEMINI_MODEL,
          systemInstruction: systemPrompt,
          generationConfig: {
            temperature: 0.3,
            topK: 40,
            topP: 0.95
          }
        });
      }
      
      const result = await firebaseModel.generateContent(userPrompt);
      resultText = result.response.text();

    } else {
      // Configuration Error
      throw new Error('API Key or Firebase Config not found in config.js');
    }

    loadingEl.style.display = 'none';
    // Assuming formatGeminiResponse is a new function or renderMarkdown is renamed/updated
    // For now, we'll use renderMarkdown as it exists.
    const cleanHtml = renderMarkdown(resultText); 
    responseContent.innerHTML = cleanHtml;
    responseContent.style.display = 'block';
    aiActions.style.display = 'block';

  } catch (error) {
    loadingEl.style.display = 'none';
    responseContent.style.display = 'block';

    if (error.message === 'API_KEY_NOT_SET') {
      responseContent.innerHTML = `
        <div class="ai-error">
          <h3>⚙️ <span class="en">API Key Required</span><span class="zh">需要 API 密钥</span></h3>
          <p class="en">To use the AI-powered guidance feature locally, a Gemini API key needs to be configured. 
          <br>Get a free key at <a href="https://aistudio.google.com/apikey" target="_blank">aistudio.google.com/apikey</a>
          <br>Then copy <code>js/config.template.js</code> to <code>js/config.js</code> and add your key.</p>
          <p class="zh">要在本地使用AI指导功能，需要配置 Gemini API 密钥。
          <br>在 <a href="https://aistudio.google.com/apikey" target="_blank">aistudio.google.com/apikey</a> 获取免费密钥
          <br>然后将 <code>js/config.template.js</code> 复制为 <code>js/config.js</code> 并添加您的密钥。</p>
        </div>`;
    } else {
      responseContent.innerHTML = `
        <div class="ai-error">
          <h3>❌ <span class="en">Error</span><span class="zh">错误</span></h3>
          <p class="en">Unable to get AI guidance: ${error.message}. Please try again later.</p>
          <p class="zh">无法获取AI指导：${error.message}。请稍后重试。</p>
        </div>`;
    }
  } finally {
    submitBtn.disabled = false;
  }
}

// ============================================================
// Print Report Logic
// ============================================================
function generatePrintReport() {
  const currentLang = document.documentElement.classList.contains('lang-zh') ? 'zh' : 'en';
  
  const checked = getCheckedItems();
  const unchecked = getUncheckedItems();
  const data = checklistData[currentAgeGroup];
  const ageLabel = currentLang === 'en' ? data.labelEn : data.labelZh;
  const dateStr = new Date().toLocaleDateString(currentLang === 'en' ? 'en-US' : 'zh-CN', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const t = {
    title: currentLang === 'en' ? 'Developmental Screening Report' : '发育筛查报告',
    subtitle: currentLang === 'en' ? 'Generated via CAARC (Chinese American Autism Resource Center)' : '由此生成 CAARC (华裔自闭症资源中心)',
    age: currentLang === 'en' ? 'Child Age Group:' : '儿童年龄段:',
    date: currentLang === 'en' ? 'Date:' : '日期:',
    concerns: currentLang === 'en' ? 'Areas of Concern (Behaviors NOT observed)' : '关注区域 (未观察到的行为)',
    typical: currentLang === 'en' ? 'Typical Development (Behaviors observed)' : '典型发育 (观察到的行为)',
    noConcerns: currentLang === 'en' ? 'No specific concerns were noted.' : '没有记录到具体的担忧。',
    notes: currentLang === 'en' ? 'Parent Notes:' : '家长备注:',
    disclaimer: currentLang === 'en' ? 'DISCLAIMER: This report is a summary of parent observations based on developmental milestones. It is NOT a diagnostic instrument. Please share this with a qualified healthcare professional or pediatrician for a proper evaluation.' : '免责声明：本报告是基于发育里程碑的家长观察总结。它不是诊断工具。请与合格的医疗专业人员或儿科医生分享此报告以进行适当的评估。'
  };

  let concernsHtml = '';
  if (checked.length > 0) {
    concernsHtml = checked.map(q => `
      <div class="print-item">
        <div class="print-item-title">❌ ${q[currentLang]}</div>
        ${q.userDetails ? `<div class="print-item-detail"><strong>${t.notes}</strong> ${q.userDetails}</div>` : ''}
      </div>
    `).join('');
  } else {
    concernsHtml = `<p>${t.noConcerns}</p>`;
  }

  let typicalHtml = '';
  if (unchecked.length > 0) {
    typicalHtml = unchecked.map(q => `
      <div class="print-item" style="padding: 10px; margin-bottom: 8px;">
        <div class="print-item-title" style="margin-bottom: 0;">✅ ${q[currentLang]}</div>
      </div>
    `).join('');
  }

  const reportHtml = `
    <div class="print-header">
      <h1>${t.title}</h1>
      <p>${t.subtitle}</p>
      <p><strong>${t.age}</strong> ${ageLabel} &nbsp;&nbsp;|&nbsp;&nbsp; <strong>${t.date}</strong> ${dateStr}</p>
    </div>
    
    <div class="print-section">
      <h2>${t.concerns}</h2>
      ${concernsHtml}
    </div>

    <div class="print-section">
      <h2>${t.typical}</h2>
      ${typicalHtml}
    </div>

    <div class="print-disclaimer">
      <strong>${t.disclaimer}</strong>
    </div>
  `;

  document.getElementById('print-area').innerHTML = reportHtml;
  window.print();
}

// ============================================================
// Simple Markdown Renderer
// ============================================================
function renderMarkdown(text) {
  let html = text
    // Escape HTML
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Headings
    .replace(/^### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^## (.+)$/gm, '<h3>$1</h3>')
    .replace(/^# (.+)$/gm, '<h3>$1</h3>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Bullet points
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    // Horizontal rule (separates EN/ZH)
    .replace(/^---$/gm, '<hr class="lang-separator">')
    // Line breaks
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');

  // Wrap consecutive <li> elements in <ul>
  html = html.replace(/(<li>.*?<\/li>)(?:\s*<br>)*\s*(?=<li>)/g, '$1');
  html = html.replace(/(<li>[\s\S]*?<\/li>)/g, (match) => {
    if (!match.startsWith('<ul>')) return '<ul>' + match + '</ul>';
    return match;
  });
  // Fix nested ul
  html = html.replace(/<\/ul>\s*<ul>/g, '');

  return '<div class="ai-markdown"><p>' + html + '</p></div>';
}

// ============================================================
// Initialize on DOM ready
// ============================================================
document.addEventListener('DOMContentLoaded', function () {
  // Age group buttons
  document.querySelectorAll('.age-btn').forEach(btn => {
    btn.addEventListener('click', () => selectAgeGroup(btn.dataset.age));
  });

  // Submit button
  const submitBtn = document.getElementById('submit-btn');
  if (submitBtn) {
    submitBtn.addEventListener('click', getAIGuidance);
  }

  // Print button
  const printBtn = document.getElementById('print-btn');
  if (printBtn) {
    printBtn.addEventListener('click', generatePrintReport);
  }

  // Note on checklist: questions where the parent checks = area of CONCERN
  // (behavior NOT observed). This matches M-CHAT-R convention where
  // "No" answers indicate concern.
});
