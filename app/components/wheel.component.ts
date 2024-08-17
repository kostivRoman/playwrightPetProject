import { Locator, Page } from "@playwright/test";
import { step } from "../helpers/step";

export class Wheel {
	private wheelButton: Locator;
	private claimButton: Locator;

	constructor(protected page: Page) {
		this.page = page;
		this.wheelButton = this.page
			.locator("#playBtn")
		this.claimButton = this.page.locator("#winModalLink").or(this.page.locator("#winModalBtn"));
	}

	@step()
	async spinWheel(): Promise<void> {
		await this.wheelButton.waitFor({ state: "visible" });
		await this.page.waitForTimeout(5000);
		for (let i = 0; i < 2; i++) {
			await this.page.waitForTimeout(2000);
			try {
				await this.wheelButton.click({ force: true, delay: 2000 });
			} catch (e) {
				console.log(e);
			}
		}

	}

	@step()
	async claimBonus() {
		await this.claimButton.click();

	}
}
