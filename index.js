const { chromium } = require("playwright");

async function sortHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false });

  try {
    const context = await browser.newContext();
    const page = await context.newPage();

    // go to Hacker News
    await page.goto("https://news.ycombinator.com/newest");

    // Each article is represented by a <tr> element with the class "athing"
    const rows = await page.locator("tr.athing");
    const count = await rows.count();

    console.log(`Number of articles: ${count}`);

  } finally {
    await browser.close();
  }
}

(async () => {
  await sortHackerNewsArticles();
})();
