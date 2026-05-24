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

// === 3D 霓虹星云球体 ===
class NeonSphere {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) return;

        this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.mx = 0;
        this.my = 0;
        this.time = 0;

        // 配色
        this.colors = {
            cyan: [0, 200, 255],
            blue: [50, 120, 255],
            purple: [160, 70, 255],
            pink: [220, 50, 240],
        };

        this.vertices = [];    // 球体顶点
        this.edges = [];       // 边
        this.rays = [];        // 光线
        this.stars = [];       // 背景星
        this.rotX = 0.3;
        this.rotY = 0;
        this.targetRotY = 0;
        this.radius = 0;

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
        this.radius = Math.min(this.canvas.width, this.canvas.height) * 0.32;
    }

    init() {
        // 生成球体顶点（经纬网格）
        const lats = 14;
        const lons = 20;
        for (let i = 0; i <= lats; i++) {
            const theta = (i / lats) * Math.PI;
            for (let j = 0; j < lons; j++) {
                const phi = (j / lons) * Math.PI * 2;
                const x = Math.sin(theta) * Math.cos(phi);
                const y = Math.cos(theta);
                const z = Math.sin(theta) * Math.sin(phi);
                this.vertices.push({
                    x, y, z,
                    idx: this.vertices.length,
                    lat: i, lon: j,
                    glow: this.rand(0.3, 1),
                    phase: this.rand(0, Math.PI * 2),
                });
            }
        }

        // 生成边（经纬线）
        for (let i = 0; i <= lats; i++) {
            for (let j = 0; j < lons; j++) {
                const a = i * lons + j;
                const b = i * lons + ((j + 1) % lons);
                this.edges.push([a, b]);
                if (i < lats) {
                    const c = (i + 1) * lons + j;
                    this.edges.push([a, c]);
                }
            }
        }

        // 生成光线
        for (let i = 0; i < 24; i++) {
            const theta = this.rand(0, Math.PI);
            const phi = this.rand(0, Math.PI * 2);
            this.rays.push({
                theta, phi,
                len: this.rand(0.5, 1.5),
                speed: this.rand(0.005, 0.02),
                phase: this.rand(0, Math.PI * 2),
                width: this.rand(0.5, 2),
                hue: this.rand(0, 1),
            });
        }

        // 背景星
        for (let i = 0; i < 120; i++) {
            this.stars.push({
                x: this.rand(0, this.canvas.width),
                y: this.rand(0, this.canvas.height),
                size: this.rand(0.5, 2),
                alpha: this.rand(0.1, 0.5),
                phase: this.rand(0, Math.PI * 2),
            });
        }
    }

    bind() {
        window.addEventListener('resize', () => this.resize());
        this.canvas.addEventListener('mousemove', (e) => {
            this.mx = e.clientX;
            this.my = e.clientY;
            this.targetRotY = (this.mx / this.canvas.width - 0.5) * 0.5;
        });
        this.canvas.addEventListener('mouseleave', () => { this.targetRotY = 0; });
        this.canvas.addEventListener('touchmove', (e) => {
            const t = e.touches[0];
            this.mx = t.clientX;
            this.my = t.clientY;
            this.targetRotY = (this.mx / this.canvas.width - 0.5) * 0.5;
        }, { passive: true });
    }

    project(v, rotX, rotY) {
        const cx = Math.cos(rotY), sx = Math.sin(rotY);
        const cy = Math.cos(rotX), sy = Math.sin(rotX);
        let x = v.x * cx + v.z * sx;
        let z = -v.x * sx + v.z * cx;
        let y = v.y * cy + z * sy;
        z = -v.y * sy + z * cy;

        const r = this.radius;
        const scale = 800 / (800 + z * r * 0.5);
        const px = this.canvas.width / 2 + x * r * scale;
        const py = this.canvas.height / 2 - y * r * scale;
        return { px, py, z: z * r, scale };
    }

    lerpColor(t) {
        const c = this.colors;
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
            [r1, g1, b1] = c.purple; [r2, g2, b2] = c.pink;
            return [r1+(r2-r1)*f, g1+(g2-g1)*f, b1+(b2-b1)*f];
        }
    }

    firstDraw() {
        const ctx = this.ctx;
        ctx.fillStyle = '#06060e';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawStars(ctx);
    }

    drawStars(ctx) {
        for (const s of this.stars) {
            const a = s.alpha * (0.5 + 0.5 * Math.sin(this.time * 0.005 + s.phase));
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(180,200,255,${a})`;
            ctx.fill();
        }
    }

    drawSphere(ctx) {
        const rotY = this.rotY;
        const rotX = this.rotX;
        const proj = this.vertices.map(v => ({ ...this.project(v, rotX, rotY), vertex: v }));

        // 绘制边（按z深度排序，远的先画）
        const edgeData = this.edges.map(e => {
            const a = proj[e[0]], b = proj[e[1]];
            const avgZ = (a.z + b.z) / 2;
            return { a, b, avgZ };
        }).sort((a, b) => a.avgZ - b.avgZ);

        for (const e of edgeData) {
            const a = e.a, b = e.b;
            const zFade = Math.max(0, Math.min(1, (e.avgZ / this.radius + 1) / 1.5));
            const alpha = zFade * zFade * 0.2;

            // 根据z位置决定颜色倾向（正面偏蓝紫，背面偏暗蓝）
            const hue = 0.3 + zFade * 0.5;
            const [r, g, bl] = this.lerpColor(hue);

            ctx.beginPath();
            ctx.moveTo(a.px, a.py);
            ctx.lineTo(b.px, b.py);
            ctx.strokeStyle = `rgba(${r|0},${g|0},${bl|0},${alpha})`;
            ctx.lineWidth = 0.5 + zFade * 0.8;
            ctx.stroke();
        }

        // 顶点光晕
        for (const p of proj) {
            const zFade = Math.max(0, (p.z / this.radius + 1) / 2);
            if (zFade < 0.1) continue;
            const v = p.vertex;
            const pulse = 0.5 + 0.5 * Math.sin(this.time * 0.015 + v.phase);
            const glow = v.glow * pulse * zFade;
            const [r, g, bl] = this.lerpColor(0.2 + zFade * 0.6);
            const size = 1.5 + glow * 2;

            // 光晕
            const grad = ctx.createRadialGradient(p.px, p.py, 0, p.px, p.py, size * 4);
            grad.addColorStop(0, `rgba(${r|0},${g|0},${bl|0},${glow * 0.3})`);
            grad.addColorStop(1, `rgba(${r|0},${g|0},${bl|0},0)`);
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(p.px, p.py, size * 4, 0, Math.PI * 2);
            ctx.fill();

            // 核心
            ctx.beginPath();
            ctx.arc(p.px, p.py, size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${Math.min(255,r+80)|0},${Math.min(255,g+80)|0},${Math.min(255,bl+80)|0},${glow * 0.8})`;
            ctx.fill();
        }
    }

    drawRays(ctx) {
        for (const ray of this.rays) {
            const t = this.time * ray.speed + ray.phase;
            const lenAnim = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(t));
            const len = this.radius * ray.len * lenAnim;

            const theta = ray.theta + Math.sin(t * 0.5) * 0.1;
            const phi = ray.phi + t * 0.1;

            const dx = Math.sin(theta) * Math.cos(phi);
            const dy = Math.cos(theta);
            const dz = Math.sin(theta) * Math.sin(phi);

            // 3D 旋转
            const rotY = this.rotY;
            const rotX = this.rotX;
            const cx = Math.cos(rotY), sx = Math.sin(rotY);
            const cy = Math.cos(rotX), sy = Math.sin(rotX);
            let x = dx * cx + dz * sx;
            let z = -dx * sx + dz * cx;
            let y = dy * cy + z * sy;

            const scale = 800 / (800 + z * this.radius * 0.5);
            const px = this.canvas.width / 2 + x * this.radius * scale;
            const py = this.canvas.height / 2 - y * this.radius * scale;

            // 光线末端
            const ex = px + (px - this.canvas.width / 2) * len * 0.5 / this.radius;
            const ey = py + (py - this.canvas.height / 2) * len * 0.5 / this.radius;

            const [r, g, bl] = this.lerpColor(ray.hue);
            const alpha = 0.15 * (0.3 + 0.7 * lenAnim);

            // 光线渐变
            const grad = ctx.createLinearGradient(px, py, ex, ey);
            grad.addColorStop(0, `rgba(${r|0},${g|0},${bl|0},${alpha})`);
            grad.addColorStop(0.5, `rgba(${r|0},${g|0},${bl|0},${alpha * 0.3})`);
            grad.addColorStop(1, `rgba(${r|0},${g|0},${bl|0},0)`);
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(ex, ey);
            ctx.strokeStyle = grad;
            ctx.lineWidth = ray.width;
            ctx.stroke();
        }
    }

    drawVignette(ctx) {
        const w = this.canvas.width;
        const h = this.canvas.height;
        const grad = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.1, w / 2, h / 2, Math.min(w, h) * 0.7);
        grad.addColorStop(0, 'rgba(6,6,14,0)');
        grad.addColorStop(1, 'rgba(6,6,14,0.6)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
    }

    animate() {
        this.time++;
        const ctx = this.ctx;

        // 旋转
        this.rotY += 0.004 + (this.targetRotY - this.rotY) * 0.02;
        this.rotX = 0.3 + Math.sin(this.time * 0.003) * 0.05;

        // 拖尾
        ctx.fillStyle = 'rgba(6,6,14,0.08)';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawStars(ctx);
        this.drawSphere(ctx);
        this.drawRays(ctx);

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
    new NeonSphere('particleCanvas');
    setupThemeToggle();
    setupGreetButton();
    setupBackToTop();
    setupScrollAnimations();
    setupSkillAnimation();
    setupHamburger();
    setupNavbarScroll();
    setupScrollProgress();
});
