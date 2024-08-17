import { Page } from "playwright";

export async function tryNavigate(page: Page, url: string, maxRetries = 5) {
	for (let attempt = 1; attempt <= maxRetries; attempt++) {
		try {
			await page.goto(url, { timeout: 2 * 60000 }); // Try to navigate to the URL
			return; // If successful, return without throwing an error
		} catch (error) {
			console.error(`Attempt ${attempt} failed: ${(error as Error)?.message}`);
			// Properly wait for a second before retrying

			//console.log(error)
			if (attempt === maxRetries) {
				throw new Error("Max retries"); // Rethrow the last error if all retries fail
			}
		}
	}
}
