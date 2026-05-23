# 个人主页优化实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将现有简单个人主页升级为深色太空主题的现代静态网站，含毛玻璃导航、粒子背景、打字机效果、技能进度条、暗色/亮色切换等交互。

**Architecture:** 纯原生 HTML + CSS + JS，零外部依赖。单页结构，CSS 自定义属性管理主题，Intersection Observer 驱动滚动动画，Canvas 绘制粒子背景。

**Tech Stack:** HTML5, CSS3 (Custom Properties, backdrop-filter, Grid), Vanilla JS (Canvas, Intersection Observer, localStorage)

**文件范围：**
- 修改：`index.html` — 语义化重构，新增项目展示板块
- 修改：`style.css` — 完全重写，现代 CSS 方案
- 修改：`script.js` — 完全重写，所有交互逻辑
- （无新文件）

---

### Task 1: HTML 结构重写

**文件：**
- 修改：`index.html` — 全部内容

- [ ] **Step 1: 编写完整 HTML 结构**

重写 `index.html`，包含以下语义化结构：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>个人主页</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <!-- 导航栏 -->
    <nav class="navbar" id="navbar">
        <div class="container nav-container">
            <a href="#home" class="logo">Zy.</a>
            <ul class="nav-links" id="navLinks">
                <li><a href="#home">首页</a></li>
                <li><a href="#about">关于</a></li>
                <li><a href="#skills">技能</a></li>
                <li><a href="#projects">项目</a></li>
                <li><a href="#contact">联系</a></li>
            </ul>
            <button class="theme-toggle" id="themeToggle" aria-label="切换主题">🌙</button>
            <button class="hamburger" id="hamburger" aria-label="菜单">
                <span></span><span></span><span></span>
            </button>
        </div>
    </nav>

    <!-- Hero -->
    <section id="home" class="hero">
        <canvas id="particleCanvas" aria-hidden="true"></canvas>
        <div class="container hero-content">
            <h1 id="greeting"></h1>
            <p class="typewriter" id="typewriter"></p>
            <a href="#about" class="btn btn-primary">探索更多 ↓</a>
        </div>
    </section>

    <!-- 关于 -->
    <section id="about" class="section">
        <div class="container">
            <h2 class="section-title">关于我</h2>
            <div class="about-content">
                <div class="about-avatar">
                    <div class="avatar-placeholder">Zy</div>
                </div>
                <div class="about-text">
                    <p>热爱前端开发，正在系统学习 HTML、CSS、JavaScript。</p>
                    <p>这个网站是我的练习项目，用来展示学习成果和探索现代 Web 技术。</p>
                    <div class="social-links">
                        <a href="#" class="social-link" aria-label="GitHub">
                            <svg viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                        </a>
                        <a href="#" class="social-link" aria-label="邮箱">
                            <svg viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- 技能 -->
    <section id="skills" class="section">
        <div class="container">
            <h2 class="section-title">技能</h2>
            <div class="skills-container">
                <div class="skill-item">
                    <div class="skill-info">
                        <span class="skill-name">HTML</span>
                        <span class="skill-percent">90%</span>
                    </div>
                    <div class="skill-bar">
                        <div class="skill-progress" data-target="90"></div>
                    </div>
                </div>
                <div class="skill-item">
                    <div class="skill-info">
                        <span class="skill-name">CSS</span>
                        <span class="skill-percent">75%</span>
                    </div>
                    <div class="skill-bar">
                        <div class="skill-progress" data-target="75"></div>
                    </div>
                </div>
                <div class="skill-item">
                    <div class="skill-info">
                        <span class="skill-name">JavaScript</span>
                        <span class="skill-percent">60%</span>
                    </div>
                    <div class="skill-bar">
                        <div class="skill-progress" data-target="60"></div>
                    </div>
                </div>
                <div class="skill-item">
                    <div class="skill-info">
                        <span class="skill-name">前端工具</span>
                        <span class="skill-percent">50%</span>
                    </div>
                    <div class="skill-bar">
                        <div class="skill-progress" data-target="50"></div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- 项目 -->
    <section id="projects" class="section">
        <div class="container">
            <h2 class="section-title">项目</h2>
            <div class="projects-grid">
                <div class="project-card">
                    <div class="project-img">项目截图</div>
                    <div class="project-info">
                        <h3>个人主页</h3>
                        <p>深色主题、毛玻璃效果、粒子动画的静态网站</p>
                        <div class="project-tags">
                            <span>HTML</span><span>CSS</span><span>JS</span>
                        </div>
                    </div>
                </div>
                <div class="project-card">
                    <div class="project-img">项目截图</div>
                    <div class="project-info">
                        <h3>下一个项目</h3>
                        <p>即将到来...</p>
                        <div class="project-tags">
                            <span>TBD</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- 联系 -->
    <section id="contact" class="section">
        <div class="container">
            <h2 class="section-title">联系我</h2>
            <p class="contact-text">可以通过下方按钮跟我打个招呼 👋</p>
            <button class="btn btn-primary" id="greetBtn">打个招呼</button>
            <p id="message" class="message"></p>
        </div>
    </section>

    <!-- Footer -->
    <footer>
        <p>&copy; 2026 Zy. 用 ❤️ 制作</p>
        <button class="back-to-top" id="backToTop" aria-label="回到顶部">↑</button>
    </footer>

    <script src="script.js"></script>
</body>
</html>
```

- [ ] **Step 2: 验证 HTML 结构完整性**

在浏览器中打开 `index.html`，确认页面骨架渲染无报错。检查点：
- 导航栏可见，链接存在
- 各 section 区域存在
- canvas 元素存在但不阻挡内容
- 控制台无错误

---

### Task 2: CSS 全局变量与基础样式

**文件：**
- 修改：`style.css` — 写入全部 CSS（本任务是基础部分）

- [ ] **Step 1: 编写 CSS 自定义属性和全局重置**

```css
/* ===== CSS 自定义属性 ===== */
:root {
    --primary: #6366f1;
    --primary-light: #818cf8;
    --secondary: #06b6d4;
    --accent: #a855f7;
    --gradient: linear-gradient(135deg, #6366f1, #a855f7);
    --gradient-hero: linear-gradient(135deg, #0a0a1a, #1a1a2e);

    --bg-primary: #0a0a1a;
    --bg-secondary: #12122a;
    --bg-card: rgba(255, 255, 255, 0.05);
    --text-primary: #f1f5f9;
    --text-secondary: #94a3b8;
    --border-color: rgba(255, 255, 255, 0.1);

    --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    --font-mono: 'SF Mono', 'Fira Code', monospace;
    --radius: 12px;
    --radius-lg: 20px;
    --shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    --transition: 0.3s ease;
}

/* 亮色主题 */
[data-theme="light"] {
    --bg-primary: #f8fafc;
    --bg-secondary: #f1f5f9;
    --bg-card: rgba(255, 255, 255, 0.8);
    --text-primary: #0f172a;
    --text-secondary: #475569;
    --border-color: rgba(0, 0, 0, 0.1);
    --gradient-hero: linear-gradient(135deg, #6366f1, #a855f7);
    --shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

/* ===== 全局重置 ===== */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html {
    scroll-behavior: smooth;
}

body {
    font-family: var(--font-sans);
    background: var(--bg-primary);
    color: var(--text-primary);
    line-height: 1.7;
    transition: background var(--transition), color var(--transition);
}

.container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 24px;
}

a {
    color: inherit;
    text-decoration: none;
}

img {
    max-width: 100%;
    display: block;
}

/* ===== 通用按钮 ===== */
.btn {
    display: inline-block;
    padding: 14px 36px;
    border: none;
    border-radius: var(--radius);
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition);
}

.btn-primary {
    background: var(--gradient);
    color: white;
    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
}

.btn-primary:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
}

/* ===== 通用 section ===== */
.section {
    padding: 100px 0;
    position: relative;
}

.section-title {
    font-size: 2.2rem;
    text-align: center;
    margin-bottom: 60px;
    background: var(--gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}
```

- [ ] **Step 2: 验证 CSS 基础样式**

在浏览器中刷新，确认：
- 页面背景为深色，文字为浅色
- `.btn-primary` 按钮有渐变背景和圆角
- `.section-title` 标题显示渐变文字效果

---

### Task 3: 导航栏样式

**文件：**
- 修改：`style.css` — 追加导航栏样式

- [ ] **Step 1: 编写导航栏 CSS**

```css
/* ===== 导航栏 ===== */
.navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    padding: 16px 0;
    transition: all var(--transition);
    background: transparent;
}

.navbar.scrolled {
    background: rgba(10, 10, 26, 0.8);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border-color);
    padding: 10px 0;
}

[data-theme="light"] .navbar.scrolled {
    background: rgba(248, 250, 252, 0.8);
}

.nav-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo {
    font-size: 1.6rem;
    font-weight: 800;
    background: var(--gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.nav-links {
    display: flex;
    list-style: none;
    gap: 32px;
}

.nav-links a {
    font-size: 0.95rem;
    color: var(--text-secondary);
    transition: color var(--transition);
    position: relative;
}

.nav-links a::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 2px;
    background: var(--gradient);
    transition: width var(--transition);
}

.nav-links a:hover {
    color: var(--text-primary);
}

.nav-links a:hover::after {
    width: 100%;
}

.theme-toggle {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    cursor: pointer;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all var(--transition);
}

.theme-toggle:hover {
    background: var(--bg-secondary);
    transform: scale(1.1);
}

/* 汉堡菜单按钮 */
.hamburger {
    display: none;
    flex-direction: column;
    gap: 5px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
}

.hamburger span {
    display: block;
    width: 24px;
    height: 2px;
    background: var(--text-primary);
    border-radius: 2px;
    transition: all var(--transition);
}
```

- [ ] **Step 2: 验证导航栏**

刷新浏览器确认：
- 导航栏固定在顶部，滚动时出现毛玻璃效果
- 导航链接悬停有下划线动画
- `.scrolled` 类在滚动时正确添加到 navbar

---

### Task 4: Hero 区域样式 + 动态问候

**文件：**
- 修改：`style.css` — 追加 Hero 样式
- 修改：`script.js` — 写入动态问候和打字机效果

- [ ] **Step 1: 编写 Hero CSS**

```css
/* ===== Hero 区域 ===== */
.hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    background: var(--gradient-hero);
}

#particleCanvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
}

.hero-content {
    text-align: center;
    position: relative;
    z-index: 2;
}

#greeting {
    font-size: 3.5rem;
    font-weight: 800;
    margin-bottom: 16px;
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInUp 0.8s ease forwards;
}

.hero .typewriter {
    font-size: 1.3rem;
    color: var(--text-secondary);
    margin-bottom: 40px;
    min-height: 2em;
}

.typewriter::after {
    content: '|';
    animation: blink 0.8s infinite;
}

@keyframes blink {
    50% { opacity: 0; }
}

@keyframes fadeInUp {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (max-width: 600px) {
    #greeting { font-size: 2.2rem; }
    .hero .typewriter { font-size: 1rem; }
}
```

- [ ] **Step 2: 编写动态问候和打字机效果 JS**

在 `script.js` 中写入：

```javascript
// === 动态问候 ===
function setGreeting() {
    const hour = new Date().getHours();
    let text;
    if (hour < 6) text = '夜深了，还不睡吗？🌙';
    else if (hour < 12) text = '早上好！☀️';
    else if (hour < 14) text = '中午好，吃了吗？🌤️';
    else if (hour < 18) text = '下午好！⛅';
    else text = '晚上好！🌆';

    const el = document.getElementById('greeting');
    el.textContent = text;
}

// === 打字机效果 ===
function typeWriter() {
    const el = document.getElementById('typewriter');
    const text = '欢迎来到我的个人空间，一名前端学习者的练习之旅。';
    let i = 0;

    function type() {
        if (i < text.length) {
            el.textContent = text.substring(0, i + 1);
            i++;
            setTimeout(type, 60 + Math.random() * 40);
        }
    }

    setTimeout(type, 800);
}
```

- [ ] **Step 3: 验证 Hero 区域**

刷新浏览器确认：
- Hero 占满全屏，渐变背景渲染正确
- 问候语根据时间显示不同内容
- 副标题逐字打出（打字机效果）
- Canvas 粒子背景可见（先跳过，Task 6 实现）

---

### Task 5: Canvas 粒子背景

**文件：**
- 修改：`script.js` — 追加粒子系统

- [ ] **Step 1: 编写粒子系统 JS**

```javascript
// === Canvas 粒子背景 ===
class ParticleSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;

        this.resize();
        this.init();
        this.bindEvents();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        const count = Math.min(80, Math.floor(window.innerWidth / 15));
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.8,
                vy: (Math.random() - 0.5) * 0.8,
                size: Math.random() * 2.5 + 1,
                alpha: Math.random() * 0.5 + 0.2
            });
        }
    }

    bindEvents() {
        window.addEventListener('resize', () => this.resize());
        this.canvas.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
    }

    animate() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (const p of this.particles) {
            // 鼠标吸引效果
            const dx = this.mouseX - p.x;
            const dy = this.mouseY - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 200) {
                p.vx += dx * 0.0001;
                p.vy += dy * 0.0001;
            }

            // 限制速度
            const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
            if (speed > 1) {
                p.vx = (p.vx / speed) * 1;
                p.vy = (p.vy / speed) * 1;
            }

            p.x += p.vx;
            p.y += p.vy;

            // 边界回弹
            if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
            ctx.fill();
        }

        // 连线
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    ctx.beginPath();
                    ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.08 * (1 - dist / 150)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(() => this.animate());
    }
}
```

- [ ] **Step 2: 初始化粒子系统（在页面加载时）**

在 `script.js` 末尾追加：

```javascript
// === 初始化 ===
document.addEventListener('DOMContentLoaded', () => {
    setGreeting();
    typeWriter();
    new ParticleSystem('particleCanvas');
});
```

- [ ] **Step 3: 验证粒子效果**

刷新浏览器确认：
- 粒子在 Hero 背景中浮动
- 粒子之间有连线效果
- 鼠标移动时粒子的运动受影响
- 调整窗口大小时粒子系统自适应

---

### Task 6: 关于我 + 社交链接样式

**文件：**
- 修改：`style.css` — 追加关于区域样式

- [ ] **Step 1: 编写 About 区域 CSS**

```css
/* ===== 关于我 ===== */
.about-content {
    display: flex;
    align-items: center;
    gap: 60px;
    max-width: 800px;
    margin: 0 auto;
}

.about-avatar {
    flex-shrink: 0;
}

.avatar-placeholder {
    width: 160px;
    height: 160px;
    border-radius: 50%;
    background: var(--gradient);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5rem;
    font-weight: 800;
    color: white;
    box-shadow: 0 8px 30px rgba(99, 102, 241, 0.3);
}

.about-text p {
    color: var(--text-secondary);
    margin-bottom: 16px;
    font-size: 1.1rem;
}

.social-links {
    display: flex;
    gap: 16px;
    margin-top: 24px;
}

.social-link {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-secondary);
    transition: all var(--transition);
}

.social-link:hover {
    background: var(--gradient);
    color: white;
    border-color: transparent;
    transform: translateY(-3px);
}

@media (max-width: 700px) {
    .about-content {
        flex-direction: column;
        text-align: center;
        gap: 32px;
    }

    .social-links {
        justify-content: center;
    }

    .avatar-placeholder {
        width: 120px;
        height: 120px;
        font-size: 2rem;
    }
}
```

- [ ] **Step 2: 验证关于区域**

刷新浏览器确认：
- 头像占位符居中显示，带渐变背景
- 个人简介文字颜色正确
- 社交图标在悬停时变色 + 上移

---

### Task 7: 技能进度条 (HTML + CSS + JS)

**文件：**
- 修改：`style.css` — 追加技能条样式
- 修改：`script.js` — 追加进度条动画

- [ ] **Step 1: 编写技能条 CSS**

```css
/* ===== 技能进度条 ===== */
.skills-container {
    max-width: 600px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 28px;
}

.skill-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
}

.skill-name {
    font-weight: 600;
    font-size: 1rem;
}

.skill-percent {
    color: var(--text-secondary);
    font-size: 0.9rem;
    font-family: var(--font-mono);
}

.skill-bar {
    width: 100%;
    height: 8px;
    background: var(--bg-card);
    border-radius: 4px;
    overflow: hidden;
    border: 1px solid var(--border-color);
}

.skill-progress {
    height: 100%;
    width: 0;
    border-radius: 4px;
    background: var(--gradient);
    transition: width 1.2s cubic-bezier(0.4, 0, 0.2, 1);
}
```

- [ ] **Step 2: 编写进度条动画 JS**

在 `script.js` 中追加：

```javascript
// === 技能进度条动画 ===
function animateSkillBars() {
    const bars = document.querySelectorAll('.skill-progress');
    bars.forEach(bar => {
        const target = parseInt(bar.dataset.target);
        bar.style.width = target + '%';
    });
}
```

- [ ] **Step 3: 验证技能条**

刷新浏览器确认：
- 4 个技能项排列显示
- 进度条初始宽度为 0（滚动触发前）
- 触发后填充到对应百分比

---

### Task 8: 项目卡片网格样式

**文件：**
- 修改：`style.css` — 追加项目卡片样式

- [ ] **Step 1: 编写项目卡片 CSS**

```css
/* ===== 项目展示 ===== */
.projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 32px;
}

.project-card {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    overflow: hidden;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    transition: all var(--transition);
}

.project-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    border-color: var(--primary);
}

.project-img {
    height: 180px;
    background: var(--bg-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-secondary);
    font-size: 0.9rem;
}

.project-info {
    padding: 24px;
}

.project-info h3 {
    font-size: 1.2rem;
    margin-bottom: 8px;
}

.project-info p {
    color: var(--text-secondary);
    font-size: 0.95rem;
    margin-bottom: 16px;
}

.project-tags {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.project-tags span {
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.8rem;
    background: rgba(99, 102, 241, 0.15);
    color: var(--primary-light);
    border: 1px solid rgba(99, 102, 241, 0.2);
}
```

- [ ] **Step 2: 验证项目卡片**

刷新浏览器确认：
- 2 张卡片网格排列
- 卡片带毛玻璃效果
- 悬停时卡片上移 + 边框变色
- 标签显示为药丸形状

---

### Task 9: 联系区域 + Footer + 回到顶部

**文件：**
- 修改：`style.css` — 追加联系和 Footer 样式
- 修改：`script.js` — 追加回到顶部逻辑

- [ ] **Step 1: 编写联系和 Footer CSS**

```css
/* ===== 联系区域 ===== */
.contact-text {
    text-align: center;
    color: var(--text-secondary);
    font-size: 1.15rem;
    margin-bottom: 32px;
}

#contact .container {
    text-align: center;
}

.message {
    margin-top: 20px;
    font-size: 1.1rem;
    min-height: 2em;
    color: var(--primary-light);
}

/* ===== Footer ===== */
footer {
    text-align: center;
    padding: 40px 24px;
    border-top: 1px solid var(--border-color);
    color: var(--text-secondary);
    font-size: 0.9rem;
    position: relative;
}

/* 回到顶部按钮 */
.back-to-top {
    position: fixed;
    bottom: 32px;
    right: 32px;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: var(--gradient);
    color: white;
    border: none;
    font-size: 1.4rem;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
    opacity: 0;
    visibility: hidden;
    transform: translateY(10px);
    transition: all var(--transition);
    z-index: 999;
}

.back-to-top.visible {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
}

.back-to-top:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
}
```

- [ ] **Step 2: 编写交互按钮 + 回到顶部 JS**

```javascript
// === 打招呼交互 ===
function setupGreetButton() {
    const btn = document.getElementById('greetBtn');
    if (btn) {
        btn.addEventListener('click', () => {
            const msg = document.getElementById('message');
            msg.textContent = '🎉 你好！感谢来访！';
            msg.style.color = 'var(--primary-light)';
        });
    }
}

// === 回到顶部 ===
function setupBackToTop() {
    const btn = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 400);
    });
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
```

在 `DOMContentLoaded` 中添加 `setupBackToTop()`。

- [ ] **Step 3: 验证联系和 Footer**

刷新浏览器确认：
- 联系区域居中显示
- 点击按钮出现反馈消息
- 滚动超过一屏后右下角出现回到顶部按钮
- 点击回到顶部，页面平滑滚动到顶部

---

### Task 10: 暗色/亮色主题切换

**文件：**
- 修改：`script.js` — 追加主题切换逻辑

- [ ] **Step 1: 编写主题切换 JS**

```javascript
// === 暗色/亮色模式切换 ===
function setupThemeToggle() {
    const btn = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    btn.textContent = savedTheme === 'dark' ? '🌙' : '☀️';

    btn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        btn.textContent = next === 'dark' ? '🌙' : '☀️';
    });
}
```

在 `DOMContentLoaded` 中添加 `setupThemeToggle()`。

- [ ] **Step 2: 验证主题切换**

刷新浏览器确认：
- 初始状态为暗色
- 点击导航栏的 🌙 按钮切换为亮色（背景变白，文字变深）
- 亮色下导航栏毛玻璃效果适配浅色
- 刷新页面后主题保持不变

---

### Task 11: 滚动渐入动画 (Intersection Observer)

**文件：**
- 修改：`style.css` — 追加动画类
- 修改：`script.js` — 追加 Observer 逻辑

- [ ] **Step 1: 编写 CSS 动画类**

```css
/* ===== 滚动动画 ===== */
.fade-in {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.7s ease, transform 0.7s ease;
}

.fade-in.visible {
    opacity: 1;
    transform: translateY(0);
}

.fade-in-left {
    opacity: 0;
    transform: translateX(-30px);
    transition: opacity 0.7s ease, transform 0.7s ease;
}

.fade-in-left.visible {
    opacity: 1;
    transform: translateX(0);
}
```

- [ ] **Step 2: 在 HTML 中添加动画类**

给以下元素添加类：
- `.about-content` → `fade-in-left`
- `.skills-container` → `fade-in`
- `.projects-grid` → `fade-in`

- [ ] **Step 3: 编写 Intersection Observer JS**

```javascript
// === 滚动渐入动画 ===
function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.fade-in, .fade-in-left').forEach(el => observer.observe(el));
    return observer;
}
```

在 `DOMContentLoaded` 中使用 `setupScrollAnimations()` 的返回值以便在技能条动画中复用。

- [ ] **Step 4: 将技能进度条与滚动结合**

修改技能进度条的触发方式：使用 Intersection Observer 触发进度条动画。

```javascript
// === 技能进度条动画（由 Intersection Observer 触发） ===
function setupSkillAnimation() {
    const skillsSection = document.querySelector('#skills');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkillBars();
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    skillObserver.observe(skillsSection);
}
```

- [ ] **Step 5: 更新 DOMContentLoaded**

```javascript
document.addEventListener('DOMContentLoaded', () => {
    setGreeting();
    typeWriter();
    new ParticleSystem('particleCanvas');
    setupThemeToggle();
    setupBackToTop();
    setupGreetButton();
    setupScrollAnimations();
    setupSkillAnimation();
});
```

- [ ] **Step 6: 验证滚动动画**

刷新浏览器确认：
- 刚加载时 about、skills、projects 区域不可见（透明）
- 滚动到对应区域时，元素渐入出现
- 技能进度条在滚动到技能区时开始动画填充

---

### Task 12: 响应式完善

**文件：**
- 修改：`style.css` — 追加响应式样式

- [ ] **Step 1: 编写导航栏响应式 + 其他断点**

```css
/* ===== 响应式设计 ===== */
@media (max-width: 768px) {
    .nav-links {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: rgba(10, 10, 26, 0.95);
        backdrop-filter: blur(12px);
        flex-direction: column;
        padding: 24px;
        gap: 20px;
        text-align: center;
        border-bottom: 1px solid var(--border-color);
    }

    .nav-links.active {
        display: flex;
    }

    .hamburger {
        display: flex;
    }

    .section {
        padding: 60px 0;
    }

    .section-title {
        font-size: 1.8rem;
        margin-bottom: 40px;
    }

    .projects-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 480px) {
    #greeting { font-size: 1.8rem; }

    .about-content {
        gap: 24px;
    }

    .avatar-placeholder {
        width: 100px;
        height: 100px;
        font-size: 1.6rem;
    }

    .container {
        padding: 0 16px;
    }
}
```

- [ ] **Step 2: 编写汉堡菜单 JS**

```javascript
// === 汉堡菜单 ===
function setupHamburger() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // 点击导航链接后关闭菜单
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => navLinks.classList.remove('active'));
    });
}
```

在 `DOMContentLoaded` 中添加 `setupHamburger()`。

- [ ] **Step 3: 验证响应式**

在浏览器中使用 DevTools 模拟移动设备：
- 窗口宽度 < 768px 时，导航链接隐藏，汉堡菜单出现
- 点击汉堡菜单展开导航链接
- 页面在所有断点下布局正常，无溢出

---

### Task 13: 导航栏滚动效果 + 最终完善

**文件：**
- 修改：`script.js` — 追加导航栏滚动监听

- [ ] **Step 1: 编写导航栏滚动效果 JS**

```javascript
// === 导航栏滚动效果 ===
function setupNavbarScroll() {
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
}
```

在 `DOMContentLoaded` 中添加 `setupNavbarScroll()`。

- [ ] **Step 2: 最终验证清单**

在浏览器中逐一确认：
1. 导航栏：固定顶部，滚动后毛玻璃效果，链接有悬停动画
2. Hero：全屏，渐变背景，问候语正确，打字机效果
3. 粒子背景：浮动粒子，鼠标交互，连线效果
4. 关于我：头像 + 简介 + 社交图标，悬停动画
5. 技能：进度条滚动触发动画
6. 项目：卡片毛玻璃 + 悬停动效 + 标签
7. 联系：按钮交互，反馈消息
8. 回到顶部：滚动后出现，点击回到顶部
9. 主题切换：暗色 ↔ 亮色，刷新保持
10. 响应式：手机端汉堡菜单，布局自适应
11. 滚动动画：各区域渐入
12. 控制台无报错
