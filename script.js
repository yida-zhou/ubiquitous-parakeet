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

// === 霓虹网格：深空粒子流 ===
class NeonGrid {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) return;

        this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.mx = -2000;
        this.my = -2000;
        this.time = 0;

        // 霓虹配色：蓝 → 紫
        this.palette = {
            blue: [0, 180, 255],
            cyan: [0, 220, 240],
            purple: [160, 80, 255],
            pink: [220, 60, 240],
        };

        // 网格节点
        this.nodes = [];
        // 流动粒子
        this.flows = [];

        this.resize();
        this.init();
        this.bind();

        // 初始绘制
        const ctx = this.ctx;
        ctx.fillStyle = '#06060e';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.draw();

        if (!this.reduced) this.animate();
    }

    get bgRGB() { return '6,6,14'; }

    rand(min, max) { return Math.random() * (max - min) + min; }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        // 生成网格节点
        const cols = Math.max(6, Math.floor(this.canvas.width / 140));
        const rows = Math.max(4, Math.floor(this.canvas.height / 120));
        const gapX = this.canvas.width / (cols + 1);
        const gapY = this.canvas.height / (rows + 1);

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const x = gapX * (c + 1) + this.rand(-8, 8);
                const y = gapY * (r + 1) + this.rand(-8, 8);
                this.nodes.push({
                    x, y,
                    ox: x, oy: y,
                    vx: 0, vy: 0,
                    size: this.rand(1.5, 3.5),
                    phase: this.rand(0, Math.PI * 2),
                    // 随机偏向蓝或紫
                    hue: this.rand(0, 1),
                    pulse: this.rand(0.3, 1),
                });
            }
        }

        // 生成流动粒子（沿网格路径移动）
        const flowCount = Math.min(30, Math.floor(this.nodes.length * 0.4));
        for (let i = 0; i < flowCount; i++) {
            const from = Math.floor(this.rand(0, this.nodes.length));
            let to = Math.floor(this.rand(0, this.nodes.length));
            if (to === from) to = (from + 1) % this.nodes.length;
            this.flows.push({
                from, to,
                t: this.rand(0, 1),
                speed: this.rand(0.002, 0.006),
                size: this.rand(2, 5),
                hue: this.rand(0, 1),
                trail: [],
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

    lerpColor(t) {
        // 0=蓝, 1=紫
        const b = this.palette.blue, p = this.palette.purple;
        const r = Math.round(b[0] + (p[0] - b[0]) * t);
        const g = Math.round(b[1] + (p[1] - b[1]) * t);
        const bl = Math.round(b[2] + (p[2] - b[2]) * t);
        return [r, g, bl];
    }

    neonColor(t, a) {
        const [r, g, b] = this.lerpColor(t);
        return `rgba(${r},${g},${b},${a})`;
    }

    updateNodes() {
        for (const n of this.nodes) {
            n.phase += 0.02;

            // 柔和摆动（模拟流体）
            const wave = Math.sin(this.time * 0.005 + n.phase) * 0.15;
            const wave2 = Math.cos(this.time * 0.003 + n.phase * 1.3) * 0.1;
            n.x = n.ox + wave;
            n.y = n.oy + wave2;

            // 鼠标扰动
            const dx = n.x - this.mx;
            const dy = n.y - this.my;
            const d = Math.hypot(dx, dy);
            if (d < 150 && d > 1) {
                const f = (1 - d / 150) * 2;
                n.x += (dx / d) * f;
                n.y += (dy / d) * f;
            }
        }
    }

    updateFlows() {
        for (const f of this.flows) {
            f.t += f.speed;
            if (f.t >= 1) {
                f.t = 0;
                f.from = f.to;
                f.to = Math.floor(this.rand(0, this.nodes.length));
                if (f.to === f.from) f.to = (f.from + 1) % this.nodes.length;
            }

            // 记录轨迹
            const fromN = this.nodes[f.from];
            const toN = this.nodes[f.to];
            if (fromN && toN) {
                const cx = fromN.x + (toN.x - fromN.x) * f.t;
                const cy = fromN.y + (toN.y - fromN.y) * f.t;
                f.trail.push({ x: cx, y: cy });
                if (f.trail.length > 15) f.trail.shift();
            }
        }
    }

    drawConnections(ctx) {
        const nodes = this.nodes;
        const dist = 200;

        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const a = nodes[i], b = nodes[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const d = Math.hypot(dx, dy);
                if (d > dist) continue;

                const t = 1 - d / dist;
                const alpha = t * t * 0.15;
                const [r1, g1, b1] = this.lerpColor(a.hue);
                const [r2, g2, b2] = this.lerpColor(b.hue);

                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.strokeStyle = `rgba(${(r1+r2)>>1},${(g1+g2)>>1},${(b1+b2)>>1},${alpha})`;
                ctx.lineWidth = t * 1.2;
                ctx.stroke();
            }
        }
    }

    drawNodes(ctx) {
        for (const n of this.nodes) {
            const pulse = 0.5 + 0.5 * Math.sin(this.time * 0.01 + n.phase);
            const alpha = n.pulse * (0.3 + 0.7 * pulse);
            const [r, g, b] = this.lerpColor(n.hue);
            const glowR = n.size * 4;

            // 光晕
            const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glowR);
            glow.addColorStop(0, `rgba(${r},${g},${b},${alpha * 0.3})`);
            glow.addColorStop(1, `rgba(${r},${g},${b},0)`);
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(n.x, n.y, glowR, 0, Math.PI * 2);
            ctx.fill();

            // 核心
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${Math.min(255,r+60)},${Math.min(255,g+60)},${Math.min(255,b+60)},${alpha * 0.9})`;
            ctx.fill();
        }
    }

    drawFlows(ctx) {
        for (const f of this.flows) {
            const [r, g, b] = this.lerpColor(f.hue);
            // 轨迹
            for (let t = 0; t < f.trail.length; t++) {
                const pt = f.trail[t];
                const a = (t / f.trail.length) * 0.6;
                const sz = f.size * (0.3 + 0.7 * (t / f.trail.length));
                ctx.beginPath();
                ctx.arc(pt.x, pt.y, sz, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
                ctx.fill();
            }

            // 流动粒子本体
            if (f.trail.length > 0) {
                const last = f.trail[f.trail.length - 1];
                const glowR = f.size * 5;
                const g = ctx.createRadialGradient(last.x, last.y, 0, last.x, last.y, glowR);
                g.addColorStop(0, `rgba(${r},${g},${b},0.4)`);
                g.addColorStop(1, `rgba(${r},${g},${b},0)`);
                ctx.fillStyle = g;
                ctx.beginPath();
                ctx.arc(last.x, last.y, glowR, 0, Math.PI * 2);
                ctx.fill();

                ctx.beginPath();
                ctx.arc(last.x, last.y, f.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,255,255,0.85)`;
                ctx.fill();
            }
        }
    }

    drawVignette(ctx) {
        const w = this.canvas.width;
        const h = this.canvas.height;
        const grad = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.15, w / 2, h / 2, Math.min(w, h) * 0.75);
        grad.addColorStop(0, 'rgba(6,6,14,0)');
        grad.addColorStop(1, 'rgba(6,6,14,0.5)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
    }

    draw() {
        const ctx = this.ctx;
        this.updateNodes();
        this.updateFlows();
        this.drawConnections(ctx);
        this.drawNodes(ctx);
        this.drawFlows(ctx);
        this.drawVignette(ctx);
    }

    animate() {
        this.time++;
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        // 极淡拖尾
        ctx.fillStyle = 'rgba(6,6,14,0.12)';
        ctx.fillRect(0, 0, w, h);

        this.updateNodes();
        this.updateFlows();
        this.drawConnections(ctx);
        this.drawNodes(ctx);
        this.drawFlows(ctx);

        requestAnimationFrame(() => this.animate());
    }
}

// === 技能进度条动画 ===
function animateSkillBars() {
    document.querySelectorAll('.skill-progress').forEach(b => { b.style.width = b.dataset.target + '%'; });
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
    const b = document.getElementById('backToTop');
    if (!b) return;
    window.addEventListener('scroll', () => b.classList.toggle('visible', window.scrollY > 400));
    b.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// === 暗色/亮色模式切换 ===
function setupThemeToggle() {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;
    const saved = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    btn.textContent = saved === 'dark' ? '🌙' : '☀️';
    btn.addEventListener('click', () => {
        const n = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', n);
        localStorage.setItem('theme', n);
        btn.textContent = n === 'dark' ? '🌙' : '☀️';
    });
}

// === 滚动渐入动画 ===
function setupScrollAnimations() {
    const o = new IntersectionObserver(es => {
        es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); o.unobserve(e.target); } });
    }, { threshold: 0.15 });
    document.querySelectorAll('.fade-in, .fade-in-left').forEach(el => o.observe(el));
}

// === 技能进度条动画（由 Intersection Observer 触发） ===
function setupSkillAnimation() {
    const o = new IntersectionObserver(es => {
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
    new NeonGrid('particleCanvas');
    setupThemeToggle();
    setupGreetButton();
    setupBackToTop();
    setupScrollAnimations();
    setupSkillAnimation();
    setupHamburger();
    setupNavbarScroll();
    setupScrollProgress();
});
