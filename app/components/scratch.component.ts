import { Locator, Page } from "playwright";
import { step } from "../helpers/step";

export class Scratch {
	private cardList: Locator;
	private bonusButton: Locator;
	constructor(protected page: Page) {
		//	this.page = page;
		this.cardList = this.page.locator(".cards");
		this.bonusButton = this.page.locator("#modalBtnOne");
	}

	@step()
	async expectLoaded() {
		await this.cardList.waitFor({ state: "visible" });
	}
	@step()
	async clickCards() {

		for (let i = 1, length = 3; i < length; i++) {
			try {
				await this.page.waitForTimeout(5000);
				await this.page.locator(`#scratchBtn-${i}`).last().click({ timeout: 5000, force: true });
			} catch (error) {
				console.log("error", error);
			}
		}
	}
	@step()
	async claimBonus() {
		const button = this.bonusButton.first();
		await button.click({ delay: 1000, timeout: 5000 });
	}
	@step()
	async claimBonus2() {
		await this.page.locator("#winModalBtn").first().click({ timeout: 5000 });
	}
}
