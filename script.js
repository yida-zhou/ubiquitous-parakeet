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

// === Canvas 粒子系统：流光 ===
class ParticleSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');

        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // 单色系：靛蓝 → 紫（克制的高级感）
        this.palette = [
            { r: 99, g: 102, b: 241 },
            { r: 120, g: 100, b: 245 },
            { r: 140, g: 95, b: 248 },
            { r: 168, g: 85, b: 247 },
        ];

        this.embers = [];
        this.depthParticles = [];
        this.mouseX = -2000;
        this.mouseY = -2000;
        this.prevMX = -2000;
        this.prevMY = -2000;
        this.time = 0;

        this.resize();
        this.init();
        this.bindEvents();
        this.animateFirstFrame();
        if (!this.reducedMotion) this.animate();
    }

    get bgRGB() {
        const theme = document.documentElement.getAttribute('data-theme');
        return theme === 'light' ? '248, 250, 252' : '10, 10, 26';
    }

    rand(min, max) { return Math.random() * (max - min) + min; }

    pickColor(t, y) {
        // 随时间极缓慢漂移色调
        const hueShift = Math.sin(this.time * 0.002) * 0.08;
        let tt = Math.max(0, Math.min(1, t + hueShift));

        // 垂直位置影响：上部粒子偏紫，下部偏蓝
        const heightRatio = y !== undefined ? 1 - y / this.canvas.height : 0.5;
        tt = Math.max(0, Math.min(1, tt + (heightRatio - 0.5) * 0.15));

        const idx = tt * (this.palette.length - 1);
        const i = Math.min(Math.floor(idx), this.palette.length - 2);
        const f = idx - i;
        const c1 = this.palette[i];
        const c2 = this.palette[i + 1];
        const r = Math.round(c1.r + (c2.r - c1.r) * f);
        const g = Math.round(c1.g + (c2.g - c1.g) * f);
        const b = Math.round(c1.b + (c2.b - c1.b) * f);
        return { r, g, b };
    }

    formatRGBA(c, a) {
        return `rgba(${c.r},${c.g},${c.b},${a})`;
    }

    resize() {
        const oldW = this.canvas.width || window.innerWidth;
        const oldH = this.canvas.height || window.innerHeight;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        const sx = this.canvas.width / oldW;
        const sy = this.canvas.height / oldH;
        for (const p of this.embers) { p.x *= sx; p.y *= sy; }
        for (const p of this.depthParticles) { p.x *= sx; p.y *= sy; }
    }

    init() {
        const count = this.reducedMotion ? 15 : Math.min(55, Math.floor(window.innerWidth * 0.025));

        for (let i = 0; i < count; i++) {
            const isDepth = i < count * 0.3;
            this.embers.push({
                x: this.rand(0, this.canvas.width),
                y: this.rand(this.canvas.height * 0.1, this.canvas.height * 0.9),
                vy: -this.rand(0.15, 0.5),
                vx: this.rand(-0.15, 0.15),
                driftPhase: this.rand(0, Math.PI * 2),
                size: this.rand(2.5, 5.5),
                alpha: this.rand(0.3, 0.7),
                colorT: this.rand(0, 1),
                isDepth: isDepth,
                phase: this.rand(0, Math.PI * 2),
            });
        }

        for (let i = 0; i < Math.floor(count * 0.5); i++) {
            this.depthParticles.push({
                x: this.rand(0, this.canvas.width),
                y: this.rand(0, this.canvas.height),
                vx: this.rand(-0.05, 0.05),
                vy: -this.rand(0.05, 0.15),
                size: this.rand(1, 2),
                alpha: this.rand(0.1, 0.25),
                colorT: this.rand(0.3, 0.8),
                phase: this.rand(0, Math.PI * 2),
                driftPhase: this.rand(0, Math.PI * 2),
            });
        }
    }

    bindEvents() {
        window.addEventListener('resize', () => this.resize());
        this.canvas.addEventListener('mousemove', (e) => {
            this.prevMX = this.mouseX;
            this.prevMY = this.mouseY;
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
        this.canvas.addEventListener('mouseleave', () => {
            this.mouseX = -2000;
            this.mouseY = -2000;
        });
    }

    updateEmbers() {
        for (const p of this.embers) {
            p.phase += 0.02;
            p.driftPhase += 0.006;

            // 8字形水平漂移：两个不同频率的正弦波叠加
            p.vx += Math.sin(p.driftPhase) * 0.002;
            p.vx += Math.sin(p.driftPhase * 0.7 + 1.3) * 0.001;

            // 可变浮力：上升速度周期性变化，像水中气泡
            const buoyancy = -0.0012 + Math.sin(p.phase * 0.5) * 0.0006;
            p.vy += buoyancy;

            // 鼠标搅拌：随距离平滑衰减的旋涡力
            const dx = p.x - this.mouseX;
            const dy = p.y - this.mouseY;
            const dist = Math.hypot(dx, dy);
            if (dist < 250 && dist > 1) {
                const influence = 1 - dist / 250;
                const strength = influence * influence * 0.08;
                const angle = Math.atan2(dy, dx) + Math.PI / 2;
                p.vx += Math.cos(angle) * strength;
                p.vy += Math.sin(angle) * strength;
                // 微弱的径向吸引/排斥
                const radialAngle = Math.atan2(dy, dx);
                const radialStrength = influence * 0.01;
                p.vx += Math.cos(radialAngle) * radialStrength;
                p.vy += Math.sin(radialAngle) * radialStrength;
            }

            // 自适应限速（更大的粒子更慢，更优雅）
            const speed = Math.hypot(p.vx, p.vy);
            const maxSpeed = p.isDepth ? 0.4 : 0.7 - p.size * 0.03;
            if (speed > maxSpeed) {
                p.vx = (p.vx / speed) * maxSpeed;
                p.vy = (p.vy / speed) * maxSpeed;
            }

            // 高阻尼：运动更粘稠、更流畅
            p.vx *= 0.98;
            p.vy *= 0.98;

            p.x += p.vx;
            p.y += p.vy;

            // 呼吸透明度
            p.alpha = (p.isDepth ? 0.25 : 0.5) + 0.3 * Math.sin(p.phase);

            // 边界循环
            const margin = 200;
            if (p.y < -margin) {
                p.y = this.canvas.height + margin;
                p.x = this.rand(0, this.canvas.width);
                p.colorT = this.rand(0, 1);
            }
            if (p.y > this.canvas.height + margin) {
                p.y = -margin;
                p.x = this.rand(0, this.canvas.width);
            }
            if (p.x < -margin) p.x = this.canvas.width + margin;
            if (p.x > this.canvas.width + margin) p.x = -margin;
        }
    }

    updateDepth() {
        for (const p of this.depthParticles) {
            p.driftPhase += 0.004;
            p.vx += Math.sin(p.driftPhase) * 0.001;
            p.vx += Math.sin(p.driftPhase * 0.5 + 0.8) * 0.0008;
            p.vy += -0.0004 + Math.sin(p.driftPhase * 0.3) * 0.0002;

            p.x += p.vx;
            p.y += p.vy;

            p.alpha = 0.1 + 0.1 * Math.sin(p.driftPhase * 0.5);

            const margin = 100;
            if (p.y < -margin) { p.y = this.canvas.height + margin; p.x = this.rand(0, this.canvas.width); }
            if (p.y > this.canvas.height + margin) { p.y = -margin; p.x = this.rand(0, this.canvas.width); }
            if (p.x < -margin) p.x = this.canvas.width + margin;
            if (p.x > this.canvas.width + margin) p.x = -margin;
        }
    }

    drawEmbers(ctx) {
        for (const p of this.embers) {
            if (p.alpha < 0.01) continue;
            const c = this.pickColor(p.colorT, p.y);
            const a = Math.min(1, p.alpha);
            const size = p.size;
            const glowSize = size * (p.isDepth ? 4 : 6);

            // 外层柔光
            const outerGlow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowSize);
            outerGlow.addColorStop(0, this.formatRGBA(c, a * 0.15));
            outerGlow.addColorStop(0.5, this.formatRGBA(c, a * 0.05));
            outerGlow.addColorStop(1, this.formatRGBA(c, 0));
            ctx.fillStyle = outerGlow;
            ctx.beginPath();
            ctx.arc(p.x, p.y, glowSize, 0, Math.PI * 2);
            ctx.fill();

            // 内层辉光
            if (!p.isDepth) {
                const innerGlow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size * 2.5);
                innerGlow.addColorStop(0, `rgba(255, 255, 255, ${a * 0.12})`);
                innerGlow.addColorStop(0.4, this.formatRGBA(c, a * 0.2));
                innerGlow.addColorStop(1, this.formatRGBA(c, 0));
                ctx.fillStyle = innerGlow;
                ctx.beginPath();
                ctx.arc(p.x, p.y, size * 2.5, 0, Math.PI * 2);
                ctx.fill();
            }

            // 核心亮点
            ctx.beginPath();
            ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
            ctx.fillStyle = this.formatRGBA(c, a);
            ctx.fill();

            // 高光点（更亮）
            if (!p.isDepth) {
                ctx.beginPath();
                ctx.arc(p.x - size * 0.25, p.y - size * 0.3, size * 0.35, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${a * 0.35})`;
                ctx.fill();
            }
        }
    }

    drawDepth(ctx) {
        for (const p of this.depthParticles) {
            if (p.alpha < 0.01) continue;
            const c = this.pickColor(p.colorT, p.y);
            const a = Math.min(1, p.alpha);
            const glowSize = p.size * 4;
            const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowSize);
            glow.addColorStop(0, this.formatRGBA(c, a * 0.15));
            glow.addColorStop(1, this.formatRGBA(c, 0));
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(p.x, p.y, glowSize, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = this.formatRGBA(c, a);
            ctx.fill();
        }
    }

    animateFirstFrame() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (const p of this.embers) p.alpha = p.isDepth ? 0.3 : 0.5;
        for (const p of this.depthParticles) p.alpha = 0.2;
        this.drawDepth(ctx);
        this.drawEmbers(ctx);
    }

    animate() {
        const ctx = this.ctx;
        this.time++;

        ctx.fillStyle = `rgba(${this.bgRGB}, 0.08)`;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.updateDepth();
        this.updateEmbers();

        this.drawDepth(ctx);
        this.drawEmbers(ctx);

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
    new ParticleSystem('particleCanvas');
    setupThemeToggle();
    setupGreetButton();
    setupBackToTop();
    setupScrollAnimations();
    setupSkillAnimation();
    setupHamburger();
    setupNavbarScroll();
    setupScrollProgress();
});
