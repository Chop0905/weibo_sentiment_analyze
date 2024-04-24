const readline = require('readline');

//登录函数
const puppeteer = require("puppeteer");

async function login(page) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    try {
        //下面这一条语句尝试点击登录按钮。
        await page.click("#app > div.main-wrap > div.login-box > a");
        await page.waitForNavigation();

        let isValidPhoneNumber = false;
        let phoneNumber;

        while (!isValidPhoneNumber) {
            phoneNumber = await new Promise((resolve) => {
                rl.question('请输入电话号码(第一次输入或上一次输入有误)：', (answer) => {
                    resolve(answer);
                });
            });

            isValidPhoneNumber = /^(?:(?:\+|00)86)?1\d{10}$/.test(phoneNumber); // 简单的手机号码格式验证

            if (!isValidPhoneNumber) {
                console.log('电话号码格式错误，请重新输入。');
            }
        }

        try {
            await page.type("#app > div.wrapper > div > div > form > div > input", phoneNumber);
            console.log("电话号码已输入，请在1分钟内验证");
            await page.click("#app > div.wrapper > div > div > a");

        } catch (error) {
            console.error("输入电话号码出错:", error);
        } finally {
            rl.close();
        }
    } catch (error) {
        console.log("未找到登录按钮，可能是已经登陆。");
    }
}

module.exports = {
    login: login
};