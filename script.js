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

// === Canvas 粒子背景 ===
class ParticleSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
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
});
