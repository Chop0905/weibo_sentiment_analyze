const puppeteer = require("puppeteer");
const readline = require('readline');

async function get_item(page) {
    let name, url, content, comments;//热搜名，正文，评论
    //定义睡眠函数，单位ms
    async function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    url = await page.url();
    //点击正文
    await page.waitForSelector(".weibo-main");
    await page.evaluate(() => {
        const elem = document.querySelector(".weibo-text").click();
    })
    await sleep(1500);
    //获取正文
    await page.waitForSelector(".nav-main");
    content = await page.evaluate(() => {
        return document.querySelector(".weibo-text").textContent;
    });
    content = content.replace(/#.*?#/g, "").replace(/[^a-zA-Z\u4e00-\u9fa5\d\n.,?!：；！？、，。（）《》]+/g, "")
    //获取评论
    comments = await page.evaluate(() => {
        const Comments = document.querySelectorAll("div > h3")
        let comts = [];
        Comments.forEach(comment => {
            comts.push(comment.innerText.replace(/#.*?#/g, "").replace(/[^a-zA-Z\u4e00-\u9fa5\d.,?!：；！？、，。（）《》]+/g, ""));

            console.log(comts);
        })
        return comts;
    })
    const css_topic = "#app > div.lite-page-wrap > div > div.lite-topbar.lite-page-top > div.nav-left";
    await page.waitForSelector(css_topic)
    await page.click(css_topic);//返回话题
    await sleep(100);
    await page.reload();

    const css_top50 = "#app > div:nth-child(1) > div:nth-child(1) > div.ntop-nav > div > div > div.nt-left > i"
    await page.waitForSelector(css_top50);
    await page.click(css_top50);//返回热搜榜
    await sleep(100);
    return {content, comments, url};
}

module.exports = {
    get_item: get_item
};