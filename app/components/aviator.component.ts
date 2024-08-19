import { Locator, Page } from "playwright";
import { step } from "../helpers/step";

export class Aviator {
	private mainButton: Locator;
	constructor(protected page: Page) {
		//this.page = page;
		this.mainButton = this.page.locator("#winModalBtn").or(this.page.locator('#lastBtn'));
	}
	@step()
	async clickMainButton() {
		//await this.mainButton.waitFor();
		await this.page.waitForTimeout(2000);
		await this.mainButton.click({ timeout: 15000 });
	}
}
