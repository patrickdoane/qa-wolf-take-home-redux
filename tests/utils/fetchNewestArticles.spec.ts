import { test, expect } from "@playwright/test";
import { fetchNewestArticles } from "../../index.js";

type MockArticle = {
    id: string;
    title: string;
    timestamp?: string; // ISO 8601 format
};

// Here we mock the HTML structure of the Hacker News "newest" page
// to test our fetchNewestArticles function.
function mockNewestPage(
    articles: MockArticle[],
    { includeMoreLink = false }: { includeMoreLink?: boolean } = {}
) {
    const rows = articles.map(({ id, title, timestamp }) => `
        <tr class="athing" id="${id}">
            <td class="title"><span class="titleline">${title}</span></td>
        </tr>
        <tr>
            <td></td>
            <td class="subtext">
                ${timestamp ? `<span class="age" title="${timestamp}"></span>` : ""}
            </td>
        </tr>
    `).join("");

    const moreLink = includeMoreLink
        ? `<a class="morelink" href="?next">More</a>`
        : "";

    return `
        <html>
            <body>
                <table class="itemlist">
                    <tbody>
                        ${rows}
                    </tbody>
                </table>
                ${moreLink}
            </body>
        </html>
    `;
}