import { Page } from "playwright";

export async function tryNavigate(page: Page, url: string, maxRetries = 5) {
	for (let attempt = 1; attempt <= maxRetries; attempt++) {
		try {

			await page.goto(url);
			return  // If successful, return without throwing an error
		} catch (error) {
			///console.error(`Attempt ${attempt} failed: ${(error as Error)?.message}`);
			// Properly wait for a second before retrying

			console.log(error);
			attempt++;

		}
		if (attempt === maxRetries) {
			throw Error; // Rethrow the last error if all retries fail
		}
	}
}
