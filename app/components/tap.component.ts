import { Locator, Page } from "playwright";
import { step } from "../helpers/step";

export class Tap {
	private tapButton: Locator;
	constructor(protected page: Page) {
		//	this.page = page;
		this.tapButton = this.page.locator(".hamster-btn");
	}

	@step()
	async expectLoaded() {
		await this.tapButton.waitFor({ state: "visible" });
	}
	@step()
	async tap() {
		await this.tapButton.click({ clickCount: 10, delay: 500 });
	}
	async clickBonusButton() {
		await this.page.locator(".modal-btn").first().waitFor({ state: "visible" });
		await this.page.locator(".modal-btn").nth(0).click();
	}
}
