import { Locator, Page } from "playwright";
import { step } from "../helpers/step";

export class Betting {
	private mainButton: Locator;
	constructor(protected page: Page) {
		//	this.page = page;
		this.mainButton = this.page.locator(".main-button");
	}

	@step()
	async expectLoaded() {
		await this.mainButton.waitFor({ state: "visible" });
	}
	@step()
	async clickMainButton() {
		await this.expectLoaded();
		await this.mainButton.click();
	}
}
