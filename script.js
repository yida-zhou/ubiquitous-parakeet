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

// === 全屏 3D 粒子网络 ===
class DeepField {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) return;

        this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.mx = 0;
        this.my = 0;
        this.time = 0;

        // 配色：霓虹蓝 → 紫
        this.palette = {
            cyan: [0, 200, 255],
            blue: [40, 100, 255],
            purple: [160, 60, 255],
            violet: [200, 40, 240],
        };

        this.nodes = [];       // 3D 节点
        this.flows = [];       // 流动粒子
        this.sway = 0;

        this.resize();
        this.init();
        this.bind();
        this.firstDraw();
        if (!this.reduced) this.animate();
    }

    get bg() { return '6,6,14'; }

    rand(min, max) { return Math.random() * (max - min) + min; }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        const w = this.canvas.width;
        const h = this.canvas.height;
        const cols = Math.max(10, Math.floor(w / 90));
        const rows = Math.max(7, Math.floor(h / 80));
        const gapX = w / (cols + 1);
        const gapY = h / (rows + 1);

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const x = gapX * (c + 1) + this.rand(-12, 12);
                const y = gapY * (r + 1) + this.rand(-12, 12);
                const z = this.rand(-200, 200);
                this.nodes.push({
                    x, y, z,
                    ox: x, oy: y,
                    vx: 0, vy: 0,
                    phase: this.rand(0, Math.PI * 2),
                    size: this.rand(1.5, 4),
                    hue: this.rand(0, 1),
                    glow: this.rand(0.4, 1),
                });
            }
        }

        // 流动粒子（沿节点间路径）
        const n = Math.min(35, Math.floor(this.nodes.length * 0.25));
        for (let i = 0; i < n; i++) {
            const from = Math.floor(this.rand(0, this.nodes.length));
            let to = Math.floor(this.rand(0, this.nodes.length));
            while (to === from) to = Math.floor(this.rand(0, this.nodes.length));
            this.flows.push({
                from, to,
                t: this.rand(0, 1),
                speed: this.rand(0.002, 0.008),
                size: this.rand(2, 5),
                hue: this.rand(0, 1),
                trail: [],
            });
        }
    }

    bind() {
        window.addEventListener('resize', () => {
            this.resize();
            this.ctx.fillStyle = '#06060e';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        });
        this.canvas.addEventListener('mousemove', (e) => { this.mx = e.clientX; this.my = e.clientY; });
        this.canvas.addEventListener('mouseleave', () => { this.mx = -2000; this.my = -2000; });
        this.canvas.addEventListener('touchmove', (e) => {
            const t = e.touches[0];
            this.mx = t.clientX;
            this.my = t.clientY;
        }, { passive: true });
    }

    lerpColor(t) {
        const c = this.palette;
        let r1, g1, b1, r2, g2, b2;
        if (t < 0.33) {
            const f = t / 0.33;
            [r1, g1, b1] = c.cyan; [r2, g2, b2] = c.blue;
            return [r1+(r2-r1)*f, g1+(g2-g1)*f, b1+(b2-b1)*f];
        } else if (t < 0.66) {
            const f = (t - 0.33) / 0.33;
            [r1, g1, b1] = c.blue; [r2, g2, b2] = c.purple;
            return [r1+(r2-r1)*f, g1+(g2-g1)*f, b1+(b2-b1)*f];
        } else {
            const f = (t - 0.66) / 0.34;
            [r1, g1, b1] = c.purple; [r2, g2, b2] = c.violet;
            return [r1+(r2-r1)*f, g1+(g2-g1)*f, b1+(b2-b1)*f];
        }
    }

    // 3D→2D 投影
    project(x, y, z) {
        const rot = this.sway;
        const cx = Math.cos(rot), sx = Math.sin(rot);
        // 绕 Y 轴旋转
        const rx = x * cx + z * sx;
        const rz = -x * sx + z * cx;
        const scale = 600 / (600 + rz);
        const px = this.canvas.width / 2 + (rx - this.canvas.width / 2) * scale;
        const py = this.canvas.height / 2 + (y - this.canvas.height / 2) * scale;
        return { px, py, z: rz, scale };
    }

    updateNodes() {
        this.sway += 0.001;
        const w = this.canvas.width;
        const h = this.canvas.height;

        for (const n of this.nodes) {
            n.phase += 0.015;

            // 柔和摆动
            const wave1 = Math.sin(this.time * 0.004 + n.phase) * 3;
            const wave2 = Math.cos(this.time * 0.006 + n.phase * 1.3) * 2;
            n.x = n.ox + wave1;
            n.y = n.oy + wave2;

            // Z 轴微漂移
            n.z += Math.sin(this.time * 0.003 + n.phase * 0.7) * 0.15;
            n.z = Math.max(-250, Math.min(250, n.z));

            // 鼠标扰动（3D 空间影响）
            if (this.mx > -1000) {
                const dx = n.x - this.mx;
                const dy = n.y - this.my;
                const d = Math.hypot(dx, dy);
                if (d < 160 && d > 1) {
                    const f = (1 - d / 160) * 2.5;
                    n.x += (dx / d) * f;
                    n.y += (dy / d) * f;
                    n.z += Math.sin(d * 0.1) * f * 0.5;
                }
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
            const a = this.nodes[f.from];
            const b = this.nodes[f.to];
            if (a && b) {
                const cx = a.x + (b.x - a.x) * f.t;
                const cy = a.y + (b.y - a.y) * f.t;
                const cz = a.z + (b.z - a.z) * f.t;
                f.trail.push({ x: cx, y: cy, z: cz });
                if (f.trail.length > 12) f.trail.shift();
            }
        }
    }

    drawConnections(ctx) {
        const nodes = this.nodes;
        const maxDist = 180;
        const maxDistSq = maxDist * maxDist;
        const projCache = nodes.map(n => this.project(n.x, n.y, n.z));

        for (let i = 0; i < nodes.length; i++) {
            const a = nodes[i];
            for (let j = i + 1; j < nodes.length; j++) {
                const b = nodes[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const dz = a.z - b.z;
                const dSq = dx * dx + dy * dy + dz * dz;
                if (dSq > maxDistSq) continue;

                const d = Math.sqrt(dSq);
                const t = 1 - d / maxDist;
                const alpha = t * t * 0.12;
                const [r1, g1, b1] = this.lerpColor(a.hue);
                const [r2, g2, b2] = this.lerpColor(b.hue);
                const pa = projCache[i], pb = projCache[j];

                ctx.beginPath();
                ctx.moveTo(pa.px, pa.py);
                ctx.lineTo(pb.px, pb.py);
                ctx.strokeStyle = `rgba(${(r1+r2)>>1},${(g1+g2)>>1},${(b1+b2)>>1},${alpha})`;
                ctx.lineWidth = t * 1.2;
                ctx.stroke();
            }
        }
    }

    drawNodes(ctx) {
        const projCache = this.nodes.map(n => this.project(n.x, n.y, n.z));

        for (let i = 0; i < this.nodes.length; i++) {
            const n = this.nodes[i];
            const p = projCache[i];
            const zFade = Math.max(0, Math.min(1, (p.z / 250 + 1) / 2));
            if (zFade < 0.05) continue;

            const pulse = 0.5 + 0.5 * Math.sin(this.time * 0.012 + n.phase);
            const alpha = n.glow * (0.2 + 0.8 * pulse) * zFade;
            const [r, g, b] = this.lerpColor(n.hue);
            const size = n.size * (0.6 + 0.4 * zFade);

            // 光晕
            const glowR = size * 5;
            const grad = ctx.createRadialGradient(p.px, p.py, 0, p.px, p.py, glowR);
            grad.addColorStop(0, `rgba(${r|0},${g|0},${b|0},${alpha * 0.25})`);
            grad.addColorStop(1, `rgba(${r|0},${g|0},${b|0},0)`);
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(p.px, p.py, glowR, 0, Math.PI * 2);
            ctx.fill();

            // 核心
            ctx.beginPath();
            ctx.arc(p.px, p.py, size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${Math.min(255,r+60)|0},${Math.min(255,g+60)|0},${Math.min(255,b+60)|0},${alpha * 0.9})`;
            ctx.fill();
        }
    }

    drawFlows(ctx) {
        for (const f of this.flows) {
            if (f.trail.length < 2) continue;
            const [r, g, b] = this.lerpColor(f.hue);

            for (let t = 0; t < f.trail.length; t++) {
                const pt = f.trail[t];
                const p = this.project(pt.x, pt.y, pt.z);
                const a = (t / f.trail.length) * 0.5;
                const sz = f.size * (0.3 + 0.7 * (t / f.trail.length));

                ctx.beginPath();
                ctx.arc(p.px, p.py, sz, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${r|0},${g|0},${b|0},${a})`;
                ctx.fill();
            }

            // 流动粒子头（亮白点）
            const last = f.trail[f.trail.length - 1];
            const lp = this.project(last.x, last.y, last.z);
            const glowR = f.size * 5;
            const grad = ctx.createRadialGradient(lp.px, lp.py, 0, lp.px, lp.py, glowR);
            grad.addColorStop(0, `rgba(${r|0},${g|0},${b|0},0.35)`);
            grad.addColorStop(1, `rgba(${r|0},${g|0},${b|0},0)`);
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(lp.px, lp.py, glowR, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(lp.px, lp.py, f.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,0.85)`;
            ctx.fill();
        }
    }

    drawVignette(ctx) {
        const w = this.canvas.width;
        const h = this.canvas.height;
        const grad = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.1, w / 2, h / 2, Math.min(w, h) * 0.7);
        grad.addColorStop(0, 'rgba(6,6,14,0)');
        grad.addColorStop(0.6, 'rgba(6,6,14,0.1)');
        grad.addColorStop(1, 'rgba(6,6,14,0.55)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
    }

    firstDraw() {
        const ctx = this.ctx;
        ctx.fillStyle = '#06060e';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    animate() {
        this.time++;
        const ctx = this.ctx;

        ctx.fillStyle = 'rgba(6,6,14,0.07)';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.updateNodes();
        this.updateFlows();

        this.drawConnections(ctx);
        this.drawFlows(ctx);
        this.drawNodes(ctx);

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

// === 技能进度条动画 ===
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
    new DeepField('particleCanvas');
    setupThemeToggle();
    setupGreetButton();
    setupBackToTop();
    setupScrollAnimations();
    setupSkillAnimation();
    setupHamburger();
    setupNavbarScroll();
    setupScrollProgress();
});
