// === 动态问候 ===
function setGreeting() {
    const el = document.getElementById('greeting');
    if (!el) return;
    const hour = new Date().getHours();
    let text;
    if (hour < 6) text = '夜深了，还不睡吗？🌙';
    else if (hour < 12) text = '早上好！☀️';
    else if (hour < 14) text = '中午好，吃了吗？🌤️';
    else if (hour < 18) text = '下午好！⛅';
    else text = '晚上好！🌆';
    el.textContent = text;
}

// === 打字机效果 ===
function typeWriter() {
    const el = document.getElementById('typewriter');
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        el.textContent = '欢迎来到我的个人空间，一名前端学习者的练习之旅。';
        return;
    }
    const text = '欢迎来到我的个人空间，一名前端学习者的练习之旅。';
    let i = 0;
    function type() {
        if (i < text.length) {
            el.textContent = text.substring(0, i + 1);
            i++;
            if (i < text.length) setTimeout(type, 60 + Math.random() * 40);
        }
    }
    setTimeout(type, 800);
}

// === 光粒子系统：引力 ===
class LightParticles {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) return;

        this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.mx = -2000;
        this.my = -2000;
        this.time = 0;

        // 单色系：靛蓝 → 紫
        this.palette = [
            [99, 102, 241],
            [120, 100, 245],
            [140, 95, 248],
            [168, 85, 247],
        ];

        this.particles = [];
        this.resize();
        this.init();
        this.bind();
        this.draw();
        if (!this.reduced) this.animate();
    }

    get bgRGB() {
        const t = document.documentElement.getAttribute('data-theme');
        return t === 'light' ? '248,250,252' : '10,10,26';
    }

    rand(min, max) { return Math.random() * (max - min) + min; }

    color(t) {
        const idx = Math.max(0, Math.min(1, t)) * (this.palette.length - 1);
        const i = Math.min(Math.floor(idx), this.palette.length - 2);
        const f = idx - i;
        return this.palette[i].map((v, j) =>
            Math.round(v + (this.palette[i + 1][j] - v) * f)
        );
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        const n = this.reduced ? 20 : Math.max(30, Math.min(90, Math.floor(window.innerWidth * 0.045)));
        for (let i = 0; i < n; i++) {
            this.particles.push({
                x: this.rand(0, this.canvas.width),
                y: this.rand(0, this.canvas.height),
                vx: this.rand(-0.3, 0.3),
                vy: this.rand(-1.5, -0.3),
                size: this.rand(1.5, 4.5),
                mass: this.rand(0.4, 1.2),
                phase: this.rand(0, Math.PI * 2),
                drift: this.rand(0.2, 0.6),
                ct: this.rand(0, 1),
                alpha: this.rand(0.3, 0.8),
            });
        }
    }

    bind() {
        window.addEventListener('resize', () => this.resize());
        this.canvas.addEventListener('mousemove', (e) => { this.mx = e.clientX; this.my = e.clientY; });
        this.canvas.addEventListener('mouseleave', () => { this.mx = -2000; this.my = -2000; });
        this.canvas.addEventListener('touchmove', (e) => {
            const t = e.touches[0];
            this.mx = t.clientX;
            this.my = t.clientY;
        }, { passive: true });
    }

    update() {
        const g = 0.035; // 引力常数
        const w = this.canvas.width;
        const h = this.canvas.height;

        for (const p of this.particles) {
            // 引力：质量越大下落越快
            p.vy += g * p.mass;

            // 鼠标扰动（类引力推斥）
            const dx = p.x - this.mx;
            const dy = p.y - this.my;
            const d = Math.hypot(dx, dy);
            if (d < 180 && d > 1) {
                const force = (1 - d / 180) * 0.5;
                p.vx += (dx / d) * force;
                p.vy += (dy / d) * force;
            }

            // 水平漂移
            p.vx += Math.sin(this.time * 0.008 + p.phase) * 0.002;
            p.vx += Math.sin(this.time * 0.015 + p.phase * 1.7) * 0.001;

            // 阻尼
            p.vx *= 0.995;
            p.vy *= 0.995;

            p.x += p.vx;
            p.y += p.vy;

            // 到底部时重置到顶部（带随机横向偏移）
            if (p.y > h + 20) {
                p.y = -10;
                p.x = this.rand(0, w);
                p.vy = this.rand(-1.8, -0.4);
                p.ct = this.rand(0, 1);
            }
            if (p.y < -30) { p.y = h + 10; }
            if (p.x < -30) p.x = w + 20;
            if (p.x > w + 30) p.x = -20;

            // 呼吸
            p.alpha = (0.4 + 0.4 * Math.sin(this.time * 0.01 + p.phase));
        }
    }

    draw() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        ctx.clearRect(0, 0, w, h);

        for (const p of this.particles) {
            const a = Math.min(1, p.alpha);
            if (a < 0.01) continue;
            const [cr, cg, cb] = this.color(p.ct);
            const glowR = p.size * 4;

            // 发光光晕
            const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR);
            g.addColorStop(0, `rgba(${cr},${cg},${cb},${a * 0.25})`);
            g.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
            ctx.fill();

            // 核心
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${cr},${cg},${cb},${a})`;
            ctx.fill();

            // 高光
            ctx.beginPath();
            ctx.arc(p.x - p.size * 0.2, p.y - p.size * 0.25, p.size * 0.3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${a * 0.25})`;
            ctx.fill();
        }
    }

    animate() {
        this.time++;
        const ctx = this.ctx;
        ctx.fillStyle = `rgba(${this.bgRGB}, 0.1)`;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// === 技能进度条动画 ===
function animateSkillBars() {
    const bars = document.querySelectorAll('.skill-progress');
    bars.forEach(bar => { bar.style.width = bar.dataset.target + '%'; });
}

// === 打招呼交互 ===
function setupGreetButton() {
    const btn = document.getElementById('greetBtn');
    if (btn) btn.addEventListener('click', () => {
        document.getElementById('message').textContent = '🎉 你好！感谢来访！';
        document.getElementById('message').style.color = 'var(--primary-light)';
    });
}

// === 回到顶部 ===
function setupBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 400));
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// === 暗色/亮色模式切换 ===
function setupThemeToggle() {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;
    const saved = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    btn.textContent = saved === 'dark' ? '🌙' : '☀️';
    btn.addEventListener('click', () => {
        const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        btn.textContent = next === 'dark' ? '🌙' : '☀️';
    });
}

// === 滚动渐入动画 ===
function setupScrollAnimations() {
    const o = new IntersectionObserver((es) => {
        es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); o.unobserve(e.target); } });
    }, { threshold: 0.15 });
    document.querySelectorAll('.fade-in, .fade-in-left').forEach(el => o.observe(el));
}

// === 技能进度条动画（由 Intersection Observer 触发） ===
function setupSkillAnimation() {
    const o = new IntersectionObserver((es) => {
        es.forEach(e => { if (e.isIntersecting) { animateSkillBars(); o.unobserve(e.target); } });
    }, { threshold: 0.3 });
    o.observe(document.querySelector('#skills'));
}

// === 汉堡菜单 ===
function setupHamburger() {
    const h = document.getElementById('hamburger');
    const n = document.getElementById('navLinks');
    h.addEventListener('click', () => n.classList.toggle('active'));
    n.querySelectorAll('a').forEach(l => l.addEventListener('click', () => n.classList.remove('active')));
}

// === 导航栏滚动效果 ===
function setupNavbarScroll() {
    const n = document.getElementById('navbar');
    if (!n) return;
    window.addEventListener('scroll', () => n.classList.toggle('scrolled', window.scrollY > 50));
}

// === 滚动进度条 ===
function setupScrollProgress() {
    const b = document.getElementById('scrollProgress');
    if (!b) return;
    window.addEventListener('scroll', () => {
        const p = document.documentElement.scrollHeight - window.innerHeight;
        b.style.width = (p > 0 ? (window.scrollY / p) * 100 : 0) + '%';
    });
}

// === 初始化 ===
document.addEventListener('DOMContentLoaded', () => {
    setGreeting();
    typeWriter();
    new LightParticles('particleCanvas');
    setupThemeToggle();
    setupGreetButton();
    setupBackToTop();
    setupScrollAnimations();
    setupSkillAnimation();
    setupHamburger();
    setupNavbarScroll();
    setupScrollProgress();
});
