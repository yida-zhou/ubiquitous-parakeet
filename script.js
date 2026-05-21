// 根据时间显示不同的问候语
function setGreeting() {
    const hour = new Date().getHours();
    let text;

    if (hour < 6) text = "🌙 夜深了，还不睡吗？";
    else if (hour < 12) text = "☀️ 早上好！";
    else if (hour < 14) text = "🌤️ 中午好，吃了吗？";
    else if (hour < 18) text = "⛅ 下午好！";
    else text = "🌆 晚上好！";

    document.getElementById("greeting").textContent = text;
}

// 按钮交互
function showMessage() {
    const msg = document.getElementById("message");
    msg.textContent = "🎉 成功啦！你已经学会了 HTML + CSS + JS 的交互！";
    msg.style.color = "#3498db";
}

// 页面加载完成后执行
setGreeting();
