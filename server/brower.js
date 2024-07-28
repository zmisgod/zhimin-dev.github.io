import puppeteer from 'puppeteer'
(async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();

  await page.goto('https://www.maoyan.com/');

  //等待异步请求完成
  await page.waitForSelector('.movie-brief-container .name');
  await sleep(20000);

  //获取动态加载的数据
  const asyncData = await page.$eval('.movie-brief-container .name', el => el.innerText);

  console.log(asyncData);
  await sleep(20000); // 

  // await browser.close();
})();

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}