const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // 在页面中执行某些异步操作
    await page.goto('https://example.com');
    // 更多的异步操作...

    // 等待异步操作完成后关闭浏览器
    await browser.close();
    // 执行完成后退出程序
})();