# Playwright Demo Project

This is a test project using Playwright for SwagLabs.

## Project Structure

- `.env`: Environment variables for the project.
- `.github/workflows/playwright.yml`: GitHub Actions workflow for Playwright tests.
- `app/`: Contains the main application files.
- `auth/`: Contains authentication setup and files.
- `components/`: Contains component files for the application.
- `fixtures/`: Contains fixture files for the tests.
- `helpers/`: Contains helper files for the tests.
- `reporter/`: Contains reporter files for the tests.
- `page/`: Contains page object files for the tests.
- `tests/`: Contains test files.
- `playwright.config.ts`: Configuration file for Playwright tests.
- `package.json`: Contains scripts and dependencies for the project.

## Setup

1. Clone the repository.
2. Install dependencies with `npm install`.
3. Set up environment variables in a `.env` file. You'll need `LOGIN`, `PASSWORD`, and `BASE_URL`.

## Installation

- `npm i` to install all

## How to run tests?

- `npm run test` - Running all tests
- `npx playwright test selectFacet.spec.ts` - Running a single test file

## Useful links

- `https://playwright.dev/` - Playwright-test documentation
- `https://trace.playwright.dev/` - Trace viewer

## Used tools

- [microsoft/playwright](https://github.com/microsoft/playwright) - Playwright-test repo