const { chromium } = require("playwright");

async function sortHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false });
  let articles = [];

  try {
    const context = await browser.newContext();
    const page = await context.newPage();

    // go to Hacker News
    await page.goto("https://news.ycombinator.com/newest");

    while (articles.length < 100) {
      const rows = await page.locator("tr.athing");

      // Get article attributes and push to articles array
      const pageArticles = await rows.evaluateAll((attributes) => {
        return attributes.map((row) => {
          const id = row.getAttribute("id");
          const age = row.nextElementSibling?.querySelector("span.age");
          const timestamp = age?.getAttribute("title"); // ISO timestamp
          const title = row.querySelector("span.titleline")?.textContent?.trim();
          return { id, title, timestamp };
        })
      });

      // Iterate through pageArticles and add to articles array until we have 100 articles
      for (const article of pageArticles) {
        if (articles.length === 100) break;
        if (article.timestamp) articles.push(article);
      }

      // If we have 100 articles, break the while loop
      if (articles.length >= 100) break;

      // Click "More" to load more articles
      await page.locator("a.morelink").click();
      await page.waitForLoadState("networkidle");
    }

  } finally {
    console.log(articles);
    await browser.close();
  }
}

(async () => {
  await sortHackerNewsArticles();
})();
