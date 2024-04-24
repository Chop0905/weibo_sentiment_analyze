const puppeteer = require("puppeteer");
const {get_item} = require("./Get_item");
const mysql = require("mysql");
const axios = require('axios');


//获取系统时间
function getCurrentDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const second = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${second}`;
}

//阻塞函数单位ms
async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function updateConsole(text) {
    process.stdout.write('\r' + text);
}

(
    async () => {
        //                                              headless设置为false可以显示浏览器
        const browser = await puppeteer.launch({headless: false, userDataDir: "./data",});// userDataDir用来指定缓存用户数据，这样以后就不用次次都登录了
        const page0 = await browser.newPage();

        try {
            await page0.goto("https://m.weibo.cn/");
        } catch (error) {
            console.log("网页未能加载成功。");
        }
        //检测登录状态，没登陆的话有90秒时间进行手动登录。直到检测登录成功才会退出循环。
        while (true) {
            try {
                await page0.click("#app > div.main-wrap > div.login-box > a");//点击登录按钮是否存在
                console.log("检测到未登录，请在60秒内登录。")
                await sleep(90000);
                await page0.goto("https://m.weibo.cn/");
            } catch (err) {
                console.log("网页加载完成，并且已登录。")
                break;
            }
        }
        await browser.close();
        const browser1 = await puppeteer.launch({headless: true, userDataDir: "./data",});// userDataDir用来指定缓存用户数据，这样以后就不用次次都登录了
        const page = await browser1.newPage();
        try {
            await page.goto("https://m.weibo.cn/");
        } catch (error) {
            console.log("网页未能加载成功。");
        }
        //打开完整榜单
        const css_top = "#app > div.main-wrap > div.lite-topbar.main-top > div.nav-top > a > aside > label > div";
        await page.waitForSelector(css_top);
        await page.click(css_top);
        //等待榜单加载完毕
        const css_list = "#app > div > div > div.card.m-panel.card16.m-col-2 > div > div > div:nth-child(10) > div"
        await page.waitForSelector(css_list);
        await page.click(css_list);
        await page.waitForSelector("#app > div > div:nth-child(2) > div:nth-child(3) > div > div");

        let counter = 1;
        while (true) {
            await page.reload();
            const connection = mysql.createConnection({
                    host: '127.0.0.1',
                    user: 'root',
                    password: '123456789',
                    database: 'spider'
                }
            )

            connection.connect();
            for (let i = 2; i < 53; i++) {
                let name = "", popularity = 0;
                let flag = false;
                //如果是没有热度的热搜，那就直接跳过
                try {
                    await page.waitForSelector(`#app > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(${i}) > div > div > div > div > span.main-link.m-box.m-box-center-a > span.sub-text`)
                } catch (err) {
                    continue;
                }
                while (true) {
                    try {
                        //点进热搜第i名
                        await page.waitForSelector(`#app > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(${i})`);
                        //获取到热搜的名字以及热度，缺少其中一个直接跳过
                        const css_name = `#app > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(${i}) > div > div > div > div > span.main-link.m-box.m-box-center-a > span.main-text.m-text-cut`;
                        const css_popularity = `#app > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(${i}) > div > div > div > div > span.main-link.m-box.m-box-center-a > span.sub-text`;
                        const exist = await page.$(`#app > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(${i}) > div > div > div > div > span.main-link.m-box.m-box-center-a > span.sub-text`);
                        if (exist) {
                            name = await page.evaluate((css_name) => {
                                let text = document.querySelector(css_name).textContent;
                                return text.replace(/\n/g, '');
                            }, css_name);
                            popularity = parseInt((await page.evaluate((css_popularity) => {
                                return document.querySelector(css_popularity).textContent;
                            }, css_popularity)).replace(/\D/g, ""), 10);
                            await page.click(`#app > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(${i})`);
                        } else {
                            flag = true;
                            break;
                        }
                        break;
                    } catch (err) {
                        await page.reload();
                    }
                }
                if (flag) continue;

                let text;
                while (true) {
                    try {
                        text = await get_item(page);
                        break;
                    } catch (err) {
                        await page.reload();
                    }
                }
                let comments = "";
                for (let j = 0; j < text.comments.length; j++) {
                    comments = comments + text.comments[j];
                }
                if (comments.length > 500) {
                    comments = comments.substring(0, 500);
                }

                Promise.all([
                    axios.post('http://127.0.0.1:5000/pred', comments, {
                        headers: {
                            'Content-Type': 'text/plain'
                        }
                    }),
                    axios.post('http://127.0.0.1:5000/cloud', text.comments),
                    counter++
            ])
                    .then(([predResponse, cloudResponse]) => {
                        const sentiment = predResponse.data["sentiment"];
                        const cloudImage = cloudResponse.data["image"];

                        const sql = `INSERT INTO posts (name, popularity, content, time, comments, url, sentiment, image_data)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                 ON DUPLICATE KEY UPDATE
                     popularity = VALUES(popularity),
                     name = VALUES(name),
                     content = VALUES(content),
                     time = VALUES(time),
                     comments = VALUES(comments),
                     url = VALUES(url),
                     sentiment = VALUES(sentiment),
                    image_data = VALUES(image_data)`;
                        connection.query(sql, [name, popularity, text.content, getCurrentDateTime(), JSON.stringify(text.comments), text.url, sentiment, cloudImage]);
                    });
                updateConsole(`正在获取第${counter}条热搜...`);
            }
            //十分钟爬一次
            await sleep(100000);
            connection.end();
            await sleep(500000);
        }
        await browser1.close();
    }
)();