const { chromium } = require("playwright");

async function sortHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false });
  let totalArticles = 0;

  try {
    const context = await browser.newContext();
    const page = await context.newPage();

    // go to Hacker News
    await page.goto("https://news.ycombinator.com/newest");

    // Each article is represented by a <tr> element with the class "athing"
    const rows = await page.locator("tr.athing");
    const count = await rows.count();

    // Now we want to go to the next page and count the articles there as well
    // The "More" link at the bottom of the page has the class "morelink"
    const nextButton = page.locator('a.morelink');
    await nextButton.click();

    console.log(`Number of articles: ${count}`);
    
    // Wait for the new page to load and count articles again
    await page.waitForLoadState('networkidle');
    const newRows = await page.locator("tr.athing");
    const newCount = await newRows.count();
    console.log(`Number of articles on the 2nd page: ${newCount}`);

    // This is a brute force way of getting all articles from all pages, but
    // we need to continue until we have 100 articles.
    await nextButton.click();
    await page.waitForLoadState('networkidle');
    const thirdRows = await page.locator("tr.athing");
    const thirdCount = await thirdRows.count();
    console.log(`Number of articles on the 3rd page: ${thirdCount}`); 

    // Now finally the fourth page in order to get at least 100 articles
    await nextButton.click();
    await page.waitForLoadState('networkidle');
    const fourthRows = await page.locator("tr.athing");
    const fourthCount = await fourthRows.count();
    console.log(`Number of articles on the 4th page: ${fourthCount}`);

    totalArticles = count + newCount + thirdCount + fourthCount;
    console.log(`Total articles across 4 pages: ${totalArticles}`);

  } finally {
    await browser.close();
  }
}

(async () => {
  await sortHackerNewsArticles();
})();
