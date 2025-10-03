import { chromium } from "playwright";

// helper functions
async function fetchNewestArticles(page, targetCount = 100) {
  let articles = [];

  while (articles.length < targetCount) {
    const rows = page.locator("tr.athing");
    const pageArticles = await rows.evaluateAll((attributes) => {
      return attributes.map((row) => {
        const id = row.getAttribute("id");
        const age = row.nextElementSibling?.querySelector("span.age");
        const timestamp = age?.getAttribute("title"); // ISO timestamp
        const title = row.querySelector("span.titleline")?.textContent?.trim();
        return { id, title, timestamp };
      });
    });

    // Iterate through pageArticles and add to articles array until we have targetCount articles
    for (const article of pageArticles) {
      if (articles.length === targetCount) break;
      if (article.timestamp) articles.push(article);
    }

    // If we have targetCount articles, break the while loop
    if (articles.length >= targetCount) break;

    // Locate the "More" link
    const moreLink = page.locator("a.morelink");

    // Ensure the "More" link exists
    if ((await moreLink.count()) === 0) {
      throw new Error("Could not find 'More' link to load additional articles.");
    }

    // Click "More" to load more articles
    await moreLink.first().click();
    await page.waitForLoadState("networkidle");
  }

  return articles.slice(0, targetCount);
}

function assertNewestOrder(rawArticles) {
  const orderedTimestamps = rawArticles.map((article, index) => {
    const rawTimestamp = article.timestamp?.trim();
    if (!rawTimestamp) {
      throw new Error(`Missing timestamp for article ${index + 1} (${article.id})`);
    }

    const [isoPart] = rawTimestamp.split(" ");  // Keep only YYYY-MM-DDTHH:MM:SS
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

  return orderedTimestamps;
}

async function sortHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false });

  try {
    const context = await browser.newContext();
    const page = await context.newPage();

    // go to Hacker News
    await page.goto("https://news.ycombinator.com/newest");

    // Fetch exactly 100 articles
    const articles = await fetchNewestArticles(page, 100);

    // Validate we have exactly 100 articles
    if (articles.length !== 100) {
      throw new Error(`Expected 100 articles, got ${articles.length} articles instead.`);
    }

    assertNewestOrder(articles);
    console.log("All articles are in correct order by timestamp.");

  } finally {
    await browser.close();
  }
}

(async () => {
  await sortHackerNewsArticles();
})();

export { fetchNewestArticles, assertNewestOrder } 