import { Locator, Page } from "@playwright/test";
import { step } from "../helpers/step";

export class Wheel {
	private wheelButton: Locator;
	private claimButton: Locator;

	constructor(protected page: Page) {
		this.page = page;
		this.wheelButton = this.page
			.locator("#playBtn")
		this.claimButton = this.page.locator("#winModalLink");
	}

	@step()
	async spinWheel(): Promise<void> {
		await this.wheelButton.waitFor({ state: "visible" });
		for (let i = 0; i < 3; i++) {
			try {
				await this.page.waitForTimeout(2000);
				await this.wheelButton.click({ force: true, timeout: 20000 });
			} catch (e) {
				console.log("Error: ", e);
			}
		}

		await this.page.waitForTimeout(2000);
	}

	@step()
	async claimBonus() {
		await this.claimButton.waitFor({ state: "visible" });
		await this.claimButton.click();

	}
}
