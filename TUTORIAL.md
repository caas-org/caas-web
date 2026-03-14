# TUTORIAL: How to Update Content & Deploy to GitHub Pages
# 教程：如何更新内容并部署到GitHub Pages

---

## Table of Contents
1. [Understanding the Project Structure](#1-project-structure)
2. [How to Edit Content](#2-editing-content)
3. [How to Add a New Page](#3-adding-a-new-page)
4. [Setting Up GitHub Pages](#4-github-pages-setup)
5. [Deploying Updates](#5-deploying-updates)
6. [Troubleshooting](#6-troubleshooting)

---

## 1. Project Structure

```
chinese_autism/
├── index.html              ← Home page
├── what-is-autism.html     ← What is Autism
├── resources.html          ← Resources
├── navigate-system.html    ← Navigate the System
├── community.html          ← Community
├── faq.html                ← FAQ
├── contact.html            ← Contact
├── css/
│   └── index.css           ← All styles (colors, fonts, layout)
├── js/
│   └── nav.js              ← Navigation bar + footer + language toggle
├── images/                 ← Image files
├── TUTORIAL.md             ← This file
└── README.md               ← Project overview
```

---

## 2. Editing Content

### Finding Editable Sections

All content that should be edited is marked with comment blocks:

```html
<!-- ========== EDITABLE: Section Name ========== -->
  ... your content here ...
<!-- ========== END EDITABLE ========== -->
```

⚡ **Quick search tip:** Open any `.html` file in a text editor and search for `EDITABLE` to jump to all editable sections.

### Content Structure (Bilingual)

Every text block has both English and Chinese versions:

```html
<p class="en">English text goes here.</p>
<p class="zh">中文内容写在这里。</p>
```

The language toggle in the upper-right corner of the website switches which version is visible. **You must update both `en` and `zh` blocks** to keep the content consistent.

### Bilingual Titles

Section titles show both languages regardless of the selected language:

```html
<h2 class="bilingual-title">
  <span class="en">English Title</span>
  <span class="zh">中文标题</span>
</h2>
```

### Example: Editing a Paragraph

**Before:**
```html
<p class="en">Old English text.</p>
<p class="zh">旧的中文文本。</p>
```

**After:**
```html
<p class="en">New English text with updated information.</p>
<p class="zh">包含更新信息的新中文文本。</p>
```

### Example: Adding a New FAQ Item

In `faq.html`, copy an existing accordion item and modify:

```html
<div class="accordion-item">
  <div class="accordion-header" onclick="toggleAccordion(this)">
    <h3>
      <span class="en">Your new question here?</span>
      <span class="zh">您的新问题在这里？</span>
    </h3>
    <svg class="accordion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
  </div>
  <div class="accordion-content">
    <div class="accordion-content-inner">
      <p class="en">Your answer in English.</p>
      <p class="zh">您的中文回答。</p>
    </div>
  </div>
</div>
```

### Example: Adding a New Resource Card

In `resources.html`, within a `card-grid`, add:

```html
<div class="content-block">
  <h3 class="bilingual-title">
    <span class="en">Organization Name</span>
    <span class="zh">机构名称</span>
  </h3>
  <div class="en">
    <p>Description of the organization.</p>
    <p><a href="https://example.com" target="_blank">www.example.com</a></p>
  </div>
  <div class="zh">
    <p>机构描述。</p>
    <p><a href="https://example.com" target="_blank">www.example.com</a></p>
  </div>
</div>
```

---

## 3. Adding a New Page

### Step 1: Create the HTML file

Copy any existing page (e.g., `resources.html`) and rename it (e.g., `new-page.html`). Update the content inside.

### Step 2: Add navigation link

Open `js/nav.js` and find the `navLinks` array at the top:

```javascript
const navLinks = [
  { href: 'index.html', en: 'Home', zh: '首页' },
  // ... existing links ...
  { href: 'new-page.html', en: 'New Page', zh: '新页面' },  // ← Add this line
];
```

That's it! The navigation bar and footer will automatically include the new page.

---

## 4. GitHub Pages Setup

### First-Time Setup

1. **Create a GitHub account** at [github.com](https://github.com) if you don't have one.

2. **Install Git** on your computer:
   - Download from [git-scm.com](https://git-scm.com/downloads)
   - During installation, accept the default options

3. **Create a new repository** on GitHub:
   - Go to [github.com/new](https://github.com/new)
   - Name it (e.g., `chinese-autism-resources` or `caarc`)
   - Make it **Public**
   - Do NOT initialize with README (we already have files)
   - Click "Create repository"

4. **Connect your local project to GitHub** (run these in your terminal/command prompt):

```bash
cd c:\Users\mingl\Dropbox\Xin\projects\chinese_autism

git init
git add .
git commit -m "Initial website launch"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

5. **Enable GitHub Pages**:
   - Go to your repo on GitHub → **Settings** → **Pages**
   - Under "Source", select **Deploy from a branch**
   - Select **main** branch and **/ (root)** folder
   - Click **Save**
   - Your site will be live at: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

---

## 5. Deploying Updates

After editing any files, run these commands to push updates:

```bash
cd c:\Users\mingl\Dropbox\Xin\projects\chinese_autism

git add .
git commit -m "Describe what you changed"
git push
```

GitHub Pages will automatically deploy the changes within 1-2 minutes.

### Tips:
- Use descriptive commit messages like: `"Updated FAQ with new insurance question"`
- Check your live site after pushing to make sure changes look correct
- If something looks wrong, you can always undo: `git revert HEAD` then `git push`

---

## 6. Troubleshooting

### Changes not appearing?
- Clear your browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- GitHub Pages may take 1-5 minutes to update
- Check that you pushed to the correct branch (`main`)

### Page not found (404)?
- Make sure the filename matches the link in `nav.js`
- Filenames are case-sensitive on GitHub Pages

### Styles look broken?
- Make sure the CSS link in your HTML points to the correct path: `href="css/index.css"`
- Check that `css/index.css` was pushed to GitHub

### Navigation missing?
- Make sure your HTML file includes `<script src="js/nav.js"></script>` before `</body>`

### Need to preview locally?
- Simply double-click any `.html` file to open it in your browser
- For a better experience, use a local server:
  ```bash
  # If you have Python installed:
  python -m http.server 8000
  # Then open http://localhost:8000
  ```
