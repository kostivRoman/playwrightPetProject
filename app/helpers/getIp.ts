import { Page } from "playwright";

export async function getCurrentIpAddress(page: Page, retries: number = 3): Promise<string> {
      for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                  const response = await page.request.get('https://api.ipify.org?format=json');
                  if (response.ok()) {
                        const responseBody = await response.json();
                        attempt = retries + 1; // Break the loop
                        return responseBody.ip;
                  } else {
                        console.error(`Attempt ${attempt} failed: ${response.status()} ${response.statusText()}`);
                  }
            } catch (error) {
                  console.error(`Attempt ${attempt} failed: ${(error as Error).message}`);
            }
            await page.waitForTimeout(1000); // Wait for 1 second before retrying
      }
      throw new Error('Failed to get current IP address after multiple attempts');
}