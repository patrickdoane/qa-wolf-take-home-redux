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

      // Locate the "More" link
      const moreLink = page.locator("a.morelink");

      // Ensure the "More" link exists
      if ((await moreLink.count()) === 0) {
        throw new Error("Could not find 'More' link to load additional articles.");
      }

      // Click "More" to load more articles
      await morelink.first().click();
      await page.waitForLoadState("networkidle");
    }

    // Validate we have exactly 100 articles
    if (articles.length !== 100) {
      throw new Error(`Expected 100 articles, got ${articles.length} articles instead.`);
    }

    // Create new array with epoch timestamps
    const orderedTimestamps = articles.map((article, index) => {
      const raw = article.timestamp?.trim();

      if (!raw) {
        throw new Error(`Missing timestamp for article ${index + 1} (${article.id})`);
      }

      const [isoPart] = raw.split(" ");         // Keep only YYYY-MM-DDTHH:MM:SS
      const epoch = Date.parse(`${isoPart}Z`);  // Append 'Z' to indicate UTC

      if (Number.isNaN(epoch)) {
        throw new Error(`Unparseable timestamp "${article.timestamp}" for article ${article.id}.`);
      };
      return { ...article, epoch };
    });

    for (let i = 1; i < orderedTimestamps.length; i++) {
      const prev = orderedTimestamps[i - 1];
      const current = orderedTimestamps[i];

      if (current.epoch > prev.epoch) {
        throw new Error(`Articles out of order: ${prev.id} (${prev.timestamp}) comes before ${current.id} (${current.timestamp}).`);
      }
    }

    console.log("All articles are in correct order by timestamp.");

  } finally {
    await browser.close();
  }
}

(async () => {
  await sortHackerNewsArticles();
})();
