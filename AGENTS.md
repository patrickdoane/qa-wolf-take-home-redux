# Repository Guidelines

## Project Structure & Module Organization
- Root `index.js` hosts the Hacker News sorting script and demo entry point.
- `playwright.config.js` selects browsers, parallelism, and tracing; adjust here before extending coverage.
- Place Playwright specs under `tests/` (e.g., `tests/news/`, `tests/utils/` for helpers) to keep suites organized.
- Track dependencies in `package.json`; keep `node_modules/` out of version control.

## Build, Test, and Development Commands
- `npm install` installs Playwright plus TypeScript types needed for local tooling.
- `node index.js` runs the assignment script; add a `HEADLESS=1` toggle if you require CI-friendly runs.
- `npx playwright test` executes suites in `tests/` across configured browsers.
- `npx playwright show-report` opens the latest HTML report for triage.

## Coding Style & Naming Conventions
- Use modern JavaScript with `async/await`, `const`/`let`, and 2-space indentation.
- Prefer double quotes and trailing semicolons; keep helpers near their caller.
- Name test files `<feature>.spec.ts` or `<feature>.spec.js`; prefer TypeScript for shared fixtures.

## Testing Guidelines
- Rely on `@playwright/test` fixtures and expectations; avoid manual sleeps or brittle selectors.
- Stabilize Hacker News data by mocking network calls when validating sorting.
- Mark slow or experimental flows with targeted `test.describe.configure` blocks to keep CI predictable.
- Run `npx playwright test --headed` before handoff to observe visual regressions.

## Commit & Pull Request Guidelines
- Keep commit messages imperative and concise, e.g., `Add sorting validation step`.
- Document PR goals, notable changes, manual test evidence, and Loom walkthroughs when available.
- Request review after checks pass and attach screenshots or logs for flaky failures.

## AI Assistance Policy
- Do not use Codex or any AI-powered tool to generate or autofill repository code.
- LLMs may assist with review, answering questions, debugging insights, and design validation.
- Capture material AI-sourced insights in PR descriptions so reviewers understand the rationale.

## Environment & Configuration Tips
- Use a `.env` file (ignored by default) for secrets if you enable the commented `dotenv` line in `playwright.config.js`.
- Document non-default browsers or flags in PRs so others can reproduce your setup.
