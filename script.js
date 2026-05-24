// === 动态问候 ===
function setGreeting() {
    const el = document.getElementById('greeting');
    if (!el) return;
    const h = new Date().getHours();
    el.textContent = h < 6 ? '夜深了，还不睡吗？🌙' : h < 12 ? '早上好！☀️' : h < 14 ? '中午好，吃了吗？🌤️' : h < 18 ? '下午好！⛅' : '晚上好！🌆';
}

// === 打字机效果 ===
function typeWriter() {
    const el = document.getElementById('typewriter');
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = '欢迎来到我的个人空间，一名前端学习者的练习之旅。'; return; }
    const text = '欢迎来到我的个人空间，一名前端学习者的练习之旅。';
    let i = 0;
    (function t() { if (i < text.length) { el.textContent = text.substring(0, ++i); if (i < text.length) setTimeout(t, 60 + Math.random() * 40); } })();
}

// === 3D 粒子流 ===
class FlowField {
    constructor(id) {
        this.c = document.getElementById(id);
        if (!this.c) return;
        this.ctx = this.c.getContext('2d');
        if (!this.ctx) return;
        this.r = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.mx = -2000;
        this.my = -2000;
        this.t = 0;
        this.pts = [];
        this.resize();
        this.init();
        this.bind();
        this.ctx.fillStyle = '#06060e';
        this.ctx.fillRect(0, 0, this.c.width, this.c.height);
        if (!this.r) this.anim();
    }

    resize() { this.c.width = window.innerWidth; this.c.height = window.innerHeight; }

    init() {
        const n = this.r ? 40 : Math.max(60, Math.min(200, Math.floor(this.c.width * 0.08)));
        for (let i = 0; i < n; i++) {
            this.pts.push(this.make(this.rand(0, this.c.width)));
        }
    }

    make(x) {
        return {
            x: x !== undefined ? x : this.c.width + 20,
            y: this.rand(0, this.c.height),
            z: this.rand(-300, 300),
            size: this.rand(1.5, 5),
            alpha: this.rand(0.2, 0.6),
            phase: this.rand(0, Math.PI * 2),
            hue: this.rand(0, 1),
        };
    }

    rand(min, max) { return Math.random() * (max - min) + min; }
    lerp(t) {
        const pal = [[0,200,255],[40,100,255],[160,60,255],[200,40,240]];
        const i = Math.min(Math.floor(t * (pal.length-1)), pal.length-2);
        const f = t * (pal.length-1) - i;
        return pal[i].map((v, j) => Math.round(v + (pal[i+1][j] - v) * f));
    }

    bind() {
        window.addEventListener('resize', () => this.resize());
        this.c.addEventListener('mousemove', (e) => { this.mx = e.clientX; this.my = e.clientY; });
        this.c.addEventListener('mouseleave', () => { this.mx = -2000; });
        this.c.addEventListener('touchmove', (e) => { const t = e.touches[0]; this.mx = t.clientX; this.my = t.clientY; }, { passive: true });
    }

    project(x, y, z) {
        const sc = 500 / (500 + z);
        return {
            px: this.c.width / 2 + (x - this.c.width / 2) * sc,
            py: this.c.height / 2 + (y - this.c.height / 2) * sc,
            sc: sc,
        };
    }

    anim() {
        this.t++;
        const ctx = this.ctx;
        const w = this.c.width;
        const h = this.c.height;

        ctx.fillStyle = 'rgba(6,6,14,0.08)';
        ctx.fillRect(0, 0, w, h);

        // 更新 & 绘制
        for (const p of this.pts) {
            // Z 深度决定速度 (近快远慢)
            const speedFactor = 1 + p.z / 400;
            const speed = 0.5 + speedFactor * 1.2;

            // 垂直微漂移
            const drift = Math.sin(this.t * 0.005 + p.phase) * 0.15;

            p.x -= speed;
            p.y += drift;

            // 鼠标扰动
            if (this.mx > -1000) {
                const dx = p.x - this.mx;
                const dy = p.y - this.my;
                const d = Math.hypot(dx, dy);
                if (d < 200 && d > 1) {
                    const f = (1 - d / 200) * 0.8;
                    p.x += (dx / d) * f * 0.3;
                    p.y += (dy / d) * f;
                    p.z += Math.sin(d * 0.05) * f * 2;
                }
            }

            // 循环
            if (p.x < -40) {
                Object.assign(p, this.make(w + 20));
                p.y = this.rand(0, h);
                p.z = this.rand(-300, 300);
            }

            // 投影
            const pp = this.project(p.x, p.y, p.z);
            const zFade = (p.z + 300) / 600;
            const a = p.alpha * (0.5 + 0.5 * Math.sin(this.t * 0.008 + p.phase)) * (0.2 + 0.8 * zFade);
            const [r, g, b] = this.lerp(p.hue);
            const sz = p.size * (0.4 + 0.6 * zFade);

            // 仅柔光光晕（无核心高亮）
            const gr = ctx.createRadialGradient(pp.px, pp.py, 0, pp.px, pp.py, sz * 4);
            gr.addColorStop(0, `rgba(${r},${g},${b},${a * 0.35})`);
            gr.addColorStop(1, `rgba(${r},${g},${b},0)`);
            ctx.fillStyle = gr;
            ctx.beginPath();
            ctx.arc(pp.px, pp.py, sz * 4, 0, Math.PI * 2);
            ctx.fill();
        }

        requestAnimationFrame(() => this.anim());
    }
}

// === 工具函数 ===
function animateSkillBars() { document.querySelectorAll('.skill-progress').forEach(b => { b.style.width = b.dataset.target + '%'; }); }
function setupGreetButton() { const btn = document.getElementById('greetBtn'); if (btn) btn.addEventListener('click', () => { document.getElementById('message').textContent = '🎉 你好！感谢来访！'; document.getElementById('message').style.color = 'var(--primary-light)'; }); }
function setupBackToTop() { const b = document.getElementById('backToTop'); if (!b) return; window.addEventListener('scroll', () => b.classList.toggle('visible', window.scrollY > 400)); b.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' })); }
function setupThemeToggle() {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;
    const s = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', s);
    btn.textContent = s === 'dark' ? '🌙' : '☀️';
    btn.addEventListener('click', () => { const n = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'; document.documentElement.setAttribute('data-theme', n); localStorage.setItem('theme', n); btn.textContent = n === 'dark' ? '🌙' : '☀️'; });
}
function setupScrollAnimations() { const o = new IntersectionObserver(es => { es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); o.unobserve(e.target); } }); }, { threshold: 0.15 }); document.querySelectorAll('.fade-in, .fade-in-left').forEach(el => o.observe(el)); }
function setupSkillAnimation() { const o = new IntersectionObserver(es => { es.forEach(e => { if (e.isIntersecting) { animateSkillBars(); o.unobserve(e.target); } }); }, { threshold: 0.3 }); o.observe(document.querySelector('#skills')); }
function setupHamburger() { const h = document.getElementById('hamburger'); const n = document.getElementById('navLinks'); h.addEventListener('click', () => n.classList.toggle('active')); n.querySelectorAll('a').forEach(l => l.addEventListener('click', () => n.classList.remove('active'))); }
function setupNavbarScroll() { const n = document.getElementById('navbar'); if (!n) return; window.addEventListener('scroll', () => n.classList.toggle('scrolled', window.scrollY > 50)); }
function setupScrollProgress() { const b = document.getElementById('scrollProgress'); if (!b) return; window.addEventListener('scroll', () => { const p = document.documentElement.scrollHeight - window.innerHeight; b.style.width = (p > 0 ? (window.scrollY / p) * 100 : 0) + '%'; }); }

document.addEventListener('DOMContentLoaded', () => {
    setGreeting();
    typeWriter();
    new FlowField('particleCanvas');
    setupThemeToggle();
    setupGreetButton();
    setupBackToTop();
    setupScrollAnimations();
    setupSkillAnimation();
    setupHamburger();
    setupNavbarScroll();
    setupScrollProgress();
});
