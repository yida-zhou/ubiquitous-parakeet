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
            if (i < text.length) {
                setTimeout(type, 60 + Math.random() * 40);
            }
        }
    }

    setTimeout(type, 800);
}

// === Canvas 背景：流光滑面 ===
class BgSilk {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) return;

        this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.mx = -2000;
        this.my = -2000;
        this.time = 0;

        // 色彩：靛蓝到紫的渐变
        this.colors = [
            [99, 102, 241],
            [120, 100, 245],
            [140, 95, 248],
            [168, 85, 247],
        ];

        // 波形层参数
        this.layers = [];
        this.initLayers();

        this.resize();
        this.bind();
        this.draw();
        if (!this.reduced) this.animate();
    }

    get bg() { return document.documentElement.getAttribute('data-theme') === 'light' ? '248,250,252' : '10,10,26'; }

    initLayers() {
        const layerDefs = [
            { count: 5, amp: 50, freq: 0.003, speed: 0.12, color: 0, dir: 1 },
            { count: 4, amp: 70, freq: 0.005, speed: 0.08, color: 1, dir: -1 },
            { count: 6, amp: 30, freq: 0.004, speed: 0.18, color: 2, dir: 1 },
            { count: 4, amp: 45, freq: 0.002, speed: 0.06, color: 3, dir: -1 },
            { count: 3, amp: 60, freq: 0.006, speed: 0.10, color: 1, dir: 1 },
        ];
        for (const def of layerDefs) {
            for (let i = 0; i < def.count; i++) {
                this.layers.push({
                    offset: i / def.count,
                    amp: def.amp + Math.random() * 20,
                    freq: def.freq * (0.7 + Math.random() * 0.6),
                    speed: def.speed * (0.6 + Math.random() * 0.8),
                    phase: Math.random() * Math.PI * 2,
                    color: def.color,
                    dir: def.dir,
                    blend: Math.random() * 0.3 + 0.4,
                });
            }
        }
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
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

    drawSilk(ctx, w, h) {
        const c = this.colors;
        const ripple = this.mx > 0 ? { x: this.mx, y: this.my, r: 200 } : null;

        for (const layer of this.layers) {
            const baseA = layer.blend * 0.055;
            const [cr, cg, cb] = c[layer.color];

            ctx.beginPath();
            const step = 6;

            for (let x = -20; x <= w + 20; x += step) {
                const t = x / w;
                const slow = this.time * 0.01;
                const wave = Math.sin(x * layer.freq + slow * layer.speed + layer.phase) * layer.amp;
                const wave2 = Math.sin(x * layer.freq * 2.3 + slow * layer.speed * 0.6 + layer.phase * 1.5) * layer.amp * 0.35;
                const horiz = Math.sin(x * 0.008 + slow * 0.05) * 20;
                let y = h * 0.5 + wave + wave2 + horiz;
                y += Math.sin(slow * 2 + t * 4) * 8;

                if (ripple) {
                    const dx = x - ripple.x;
                    const dy = y - ripple.y;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d < ripple.r && d > 1) {
                        const infl = (1 - d / ripple.r) * (1 - d / ripple.r);
                        y += Math.sin(d * 0.06 - slow * 4) * infl * 30;
                    }
                }

                if (x === -20) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }

            ctx.lineTo(w + 20, h + 20);
            ctx.lineTo(-20, h + 20);
            ctx.closePath();
            ctx.fillStyle = `rgba(${cr},${cg},${cb},${baseA})`;
            ctx.fill();
        }
    }

    draw() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        ctx.clearRect(0, 0, w, h);
        this.drawSilk(ctx, w, h);
    }

    animate() {
        this.time++;
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        ctx.fillStyle = `rgba(${this.bg}, 0.06)`;
        ctx.fillRect(0, 0, w, h);

        this.drawSilk(ctx, w, h);

        requestAnimationFrame(() => this.animate());
    }
}

// === 技能进度条动画 ===
function animateSkillBars() {
    const bars = document.querySelectorAll('.skill-progress');
    bars.forEach(bar => {
        const target = parseInt(bar.dataset.target);
        bar.style.width = target + '%';
    });
}

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
    if (!btn) return;
    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 400);
    });
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// === 暗色/亮色模式切换 ===
function setupThemeToggle() {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;
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
}

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

// === 汉堡菜单 ===
function setupHamburger() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => navLinks.classList.remove('active'));
    });
}

// === 导航栏滚动效果 ===
function setupNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
}

// === 滚动进度条 ===
function setupScrollProgress() {
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        bar.style.width = progress + '%';
    });
}

// === 初始化 ===
document.addEventListener('DOMContentLoaded', () => {
    setGreeting();
    typeWriter();
    new BgSilk('particleCanvas');
    setupThemeToggle();
    setupGreetButton();
    setupBackToTop();
    setupScrollAnimations();
    setupSkillAnimation();
    setupHamburger();
    setupNavbarScroll();
    setupScrollProgress();
});