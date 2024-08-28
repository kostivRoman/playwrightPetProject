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
		await this.wheelButton.first().waitFor({ state: "visible" });
		const buttons = await this.page.locator("#playBtn").all();
		if (buttons.length === 0) {
			throw new Error("No wheel button found");
		} else {
			for (const button of buttons) {
				for (let i = 0; i < 3; i++) {
					await this.page.waitForTimeout(2000);
					try {
						await button.hover({ force: true, timeout: 5000 });
						await button.click({ force: true, delay: 3000, timeout: 5000 });
					} catch (e) {
						console.log(e);
					}
				}
			}
		}
	}

	@step()
	async claimBonus() {
		await this.claimButton.click({ timeout: 5000 });
	}
}
