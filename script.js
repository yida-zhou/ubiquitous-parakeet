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

    // 尊重用户减少动画偏好
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

// === Canvas 粒子系统：星云流转 ===
class ParticleSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');

        // 调色板：靛蓝 → 紫 → 青 → 粉
        this.palette = [
            { r: 99, g: 102, b: 241 },   // primary
            { r: 129, g: 140, b: 248 },  // light indigo
            { r: 168, g: 85, b: 247 },   // purple
            { r: 6, g: 182, b: 212 },    // cyan
            { r: 236, g: 72, b: 153 },   // pink
        ];

        this.particles = [];
        this.streaks = [];
        this.mouseX = -2000;
        this.mouseY = -2000;
        this.prevMouseX = -2000;
        this.prevMouseY = -2000;
        this.mouseSpeed = 0;
        this.mouseAngle = 0;
        this.time = 0;
        this.lastMeteor = 0;
        this.ripple = null;

        this.resize();
        this.init();
        this.bindEvents();
        if (!this.reducedMotion) {
            this.animate();
        } else {
            this.drawStatic();
        }
    }

    get bgRGB() {
        const theme = document.documentElement.getAttribute('data-theme');
        return theme === 'light' ? '248, 250, 252' : '10, 10, 26';
    }

    // ---- 工具函数 ----
    lerp(a, b, t) { return a + (b - a) * t; }
    dist(x1, y1, x2, y2) { return Math.hypot(x2 - x1, y2 - y1); }
    rand(min, max) { return Math.random() * (max - min) + min; }

    pickColor(x, y) {
        const t = (Math.sin(x * 0.005 + y * 0.003 + this.time * 0.002) * 0.5 + 0.5);
        const idx = t * (this.palette.length - 1);
        const i = Math.min(Math.floor(idx), this.palette.length - 2);
        const f = idx - i;
        const c1 = this.palette[i];
        const c2 = this.palette[i + 1];
        return {
            r: Math.round(this.lerp(c1.r, c2.r, f)),
            g: Math.round(this.lerp(c1.g, c2.g, f)),
            b: Math.round(this.lerp(c1.b, c2.b, f)),
        };
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        const count = this.reducedMotion ? 40 : Math.min(160, Math.floor(window.innerWidth * 0.08));
        for (let i = 0; i < count; i++) {
            const layer = Math.floor(Math.random() * 3); // 0,1,2 三层深度
            const speedMul = 0.3 + layer * 0.4;
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.3 * speedMul,
                vy: (Math.random() - 0.5) * 0.3 * speedMul,
                size: this.rand(1.5, 5 - layer * 1.2),
                baseAlpha: this.rand(0.3, 0.9 - layer * 0.2),
                alpha: 0,
                layer: layer,
                phase: Math.random() * Math.PI * 2,
                driftX: (Math.random() - 0.5) * 0.2,
                driftY: (Math.random() - 0.5) * 0.2,
                color: null,
            });
        }
        this.particles.sort((a, b) => a.layer - b.layer);
    }

    bindEvents() {
        window.addEventListener('resize', () => this.resize());
        this.canvas.addEventListener('mousemove', (e) => {
            this.prevMouseX = this.mouseX;
            this.prevMouseY = this.mouseY;
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            this.mouseSpeed = this.dist(this.mouseX, this.mouseY, this.prevMouseX, this.prevMouseY);
            this.mouseAngle = Math.atan2(this.mouseY - this.prevMouseY, this.mouseX - this.prevMouseX);
            // 鼠标快速移动时产生涟漪
            if (this.mouseSpeed > 5) {
                this.ripple = { x: this.mouseX, y: this.mouseY, radius: 0, maxRadius: 120, alpha: 1 };
            }
        });
        this.canvas.addEventListener('mouseleave', () => {
            this.mouseX = -2000;
            this.mouseY = -2000;
        });
        this.canvas.addEventListener('click', (e) => this.burst(e.clientX, e.clientY));
        this.canvas.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            this.burst(touch.clientX, touch.clientY);
        }, { passive: true });
    }

    burst(x, y) {
        const count = 30;
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 / count) * i + this.rand(-0.3, 0.3);
            const speed = this.rand(2, 8);
            const color = this.pickColor(x + i * 10, y + i * 10);
            this.streaks.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1,
                decay: this.rand(0.012, 0.025),
                size: this.rand(2, 5),
                r: color.r, g: color.g, b: color.b,
            });
        }
    }

    spawnMeteor() {
        const angle = this.rand(-0.4, 0.1);  // 从左上向右下
        const speed = this.rand(12, 22);
        const startX = this.rand(0, this.canvas.width * 0.3);
        const startY = this.rand(0, this.canvas.height * 0.2);
        const color = this.palette[Math.floor(Math.random() * this.palette.length)];
        this.streaks.push({
            x: startX, y: startY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 1,
            decay: this.rand(0.008, 0.015),
            size: this.rand(3, 6),
            r: color.r, g: color.g, b: color.b,
            isMeteor: true,
            trail: [],
        });
    }

    updateParticles() {
        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2;
        for (const p of this.particles) {
            // 时间驱动的漂移（流动感）
            p.vx += Math.sin(this.time * 0.003 + p.phase) * 0.008;
            p.vy += Math.cos(this.time * 0.002 + p.phase * 1.3) * 0.008;

            // 银河旋涡力
            const dxc = p.x - cx;
            const dyc = p.y - cy;
            const dCenter = Math.sqrt(dxc * dxc + dyc * dyc);
            if (dCenter > 50) {
                const swirlStrength = 0.004 * (1 + p.layer * 0.5);
                p.vx += (-dyc / dCenter) * swirlStrength;
                p.vy += (dxc / dCenter) * swirlStrength;
            }

            // 鼠标推斥
            const d = this.dist(this.mouseX, this.mouseY, p.x, p.y);
            if (d < 200) {
                const force = (1 - d / 200) * 1.2 * (1 + p.layer * 0.3);
                const angle = Math.atan2(p.y - this.mouseY, p.x - this.mouseX);
                p.vx += Math.cos(angle) * force * 0.15;
                p.vy += Math.sin(angle) * force * 0.15;
            }

            // 限速（按层级）
            const maxSpeed = 1.2 + p.layer * 0.5;
            const speed = Math.hypot(p.vx, p.vy);
            if (speed > maxSpeed) {
                p.vx = (p.vx / speed) * maxSpeed;
                p.vy = (p.vy / speed) * maxSpeed;
            }

            // 阻尼
            p.vx *= 0.98;
            p.vy *= 0.98;

            p.x += p.vx;
            p.y += p.vy;

            // 边界环绕（无缝过渡）
            const margin = 100;
            if (p.x < -margin) p.x = this.canvas.width + margin;
            if (p.x > this.canvas.width + margin) p.x = -margin;
            if (p.y < -margin) p.y = this.canvas.height + margin;
            if (p.y > this.canvas.height + margin) p.y = -margin;

            // 呼吸透明度
            p.alpha = p.baseAlpha * (0.6 + 0.4 * Math.sin(this.time * 0.005 + p.phase));

            // 更新颜色
            p.color = this.pickColor(p.x, p.y);
        }
    }

    updateStreaks() {
        for (let i = this.streaks.length - 1; i >= 0; i--) {
            const s = this.streaks[i];
            s.x += s.vx;
            s.y += s.vy;
            s.vx *= 0.97;
            s.vy *= 0.97;
            s.life -= s.decay;

            if (s.isMeteor) {
                s.trail.push({ x: s.x, y: s.y });
                if (s.trail.length > 12) s.trail.shift();
            }

            if (s.life <= 0) {
                this.streaks.splice(i, 1);
            }
        }
    }

    drawParticles(ctx) {
        for (const p of this.particles) {
            const a = p.alpha;
            if (a < 0.01) continue;
            const c = p.color;

            // 外层辉光（layer 0 跳过节省性能）
            if (p.layer > 0) {
                const glowSize = p.size * 3;
                const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowSize);
                glow.addColorStop(0, `rgba(${c.r},${c.g},${c.b},${a * 0.3})`);
                glow.addColorStop(1, `rgba(${c.r},${c.g},${c.b},0)`);
                ctx.fillStyle = glow;
                ctx.beginPath();
                ctx.arc(p.x, p.y, glowSize, 0, Math.PI * 2);
                ctx.fill();
            }

            // 核心亮点
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${a})`;
            ctx.fill();

            // 前方粒子加一个小高光
            if (p.layer >= 1) {
                ctx.beginPath();
                ctx.arc(p.x - p.size * 0.2, p.y - p.size * 0.2, p.size * 0.35, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,255,255,${a * 0.4})`;
                ctx.fill();
            }
        }
    }

    drawConnections(ctx) {
        const particles = this.particles;
        const maxDist = 130;
        const maxDistSq = maxDist * maxDist;
        const pulse = 0.7 + 0.3 * Math.sin(this.time * 0.01);

        for (let i = 0; i < particles.length; i++) {
            const a = particles[i];
            for (let j = i + 1; j < particles.length; j++) {
                const b = particles[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const distSq = dx * dx + dy * dy;
                if (distSq > maxDistSq || distSq < 1) continue;

                const d = Math.sqrt(distSq);
                const t = 1 - d / maxDist;
                const alpha = t * 0.25 * pulse;
                const ca = a.color, cb = b.color;

                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.strokeStyle = `rgba(${(ca.r + cb.r) >> 1},${(ca.g + cb.g) >> 1},${(ca.b + cb.b) >> 1},${alpha})`;
                ctx.lineWidth = 0.5 + t * 0.8;
                ctx.stroke();
            }
        }
    }

    drawStreaks(ctx) {
        for (const s of this.streaks) {
            const alpha = Math.max(0, s.life);
            const glowSize = s.size * 4;

            if (s.isMeteor) {
                // 流星拖尾
                for (let t = 0; t < s.trail.length; t++) {
                    const trailAlpha = (t / s.trail.length) * alpha * 0.5;
                    const trailSize = s.size * (0.3 + 0.7 * (t / s.trail.length));
                    const pt = s.trail[t];
                    ctx.beginPath();
                    ctx.arc(pt.x, pt.y, trailSize, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${s.r},${s.g},${s.b},${trailAlpha})`;
                    ctx.fill();
                }
            }

            // 流光辉光
            const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, glowSize);
            glow.addColorStop(0, `rgba(${s.r},${s.g},${s.b},${alpha * 0.5})`);
            glow.addColorStop(1, `rgba(${s.r},${s.g},${s.b},0)`);
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(s.x, s.y, glowSize, 0, Math.PI * 2);
            ctx.fill();

            // 流核心
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size * alpha, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${Math.min(255, s.r + 60)},${Math.min(255, s.g + 60)},${Math.min(255, s.b + 60)},${alpha})`;
            ctx.fill();
        }
    }

    animate() {
        const ctx = this.ctx;
        this.time++;

        // 半透明叠加制造拖尾效果（适配深色/亮色模式）
        ctx.fillStyle = `rgba(${this.bgRGB}, 0.18)`;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.updateParticles();
        this.updateStreaks();

        this.drawConnections(ctx);
        this.drawParticles(ctx);
        this.drawStreaks(ctx);

        // 鼠标涟漪
        if (this.ripple) {
            this.ripple.radius += 2;
            this.ripple.alpha -= 0.015;
            ctx.beginPath();
            ctx.arc(this.ripple.x, this.ripple.y, this.ripple.radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(99, 102, 241, ${this.ripple.alpha * 0.4})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
            if (this.ripple.alpha <= 0 || this.ripple.radius >= this.ripple.maxRadius) {
                this.ripple = null;
            }
        }

        // 周期性生成流星
        if (this.time - this.lastMeteor > this.rand(200, 500) && this.streaks.length < 8) {
            this.spawnMeteor();
            this.lastMeteor = this.time;
        }

        requestAnimationFrame(() => this.animate());
    }

    drawStatic() {
        const ctx = this.ctx;
        for (const p of this.particles) {
            p.color = this.pickColor(p.x, p.y);
            p.alpha = p.baseAlpha * 0.8;
            const c = p.color;
            const a = p.alpha;
            if (p.layer > 0) {
                const glowSize = p.size * 3;
                const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowSize);
                glow.addColorStop(0, `rgba(${c.r},${c.g},${c.b},${a * 0.3})`);
                glow.addColorStop(1, `rgba(${c.r},${c.g},${c.b},0)`);
                ctx.fillStyle = glow;
                ctx.beginPath();
                ctx.arc(p.x, p.y, glowSize, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${a})`;
            ctx.fill();
        }
        this.drawConnections(ctx);
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

    // 点击导航链接后关闭菜单
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
