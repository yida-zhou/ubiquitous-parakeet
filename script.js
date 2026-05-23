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
