import { Locator, Page } from "@playwright/test";
import { step } from "../helpers/step";

export class Wheel {
	private wheelButton: Locator;
	private claimButton: Locator;

	constructor(protected page: Page) {
		this.page = page;
		this.wheelButton = this.page.locator("#playBtn");
		this.claimButton = this.page.locator("#winModalLink").or(this.page.locator("#winModalBtn"));
	}

	@step()
	async spinWheel(): Promise<void> {
		await this.page.waitForTimeout(5000);
		const buttons = await this.page.locator("#playBtn").all();
		for (const button of buttons) {
			for (let i = 0; i < 2; i++) {
				await this.page.waitForTimeout(2000);
				try {
					await button.hover({ force: true });
					await button.click({ force: true, delay: 3000 });
				} catch (e) {
					console.log(e);
				}
			}
		}
	}

	@step()
	async claimBonus() {
		await this.claimButton.click();
	}
}
