import test from "@playwright/test";

test("111", async ({page}) => {
	
        await page.goto("https://www.google.com");
        await page.pause();
});
