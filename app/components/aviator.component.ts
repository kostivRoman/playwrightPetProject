import { Locator, Page } from "playwright";
import { step } from "../helpers/step";

export class Aviator {
	private mainButton: Locator;
	private winButton: Locator;
	private playButton: Locator;
	constructor(protected page: Page) {
		//this.page = page;
		this.mainButton = this.page.locator('#lastBtn').or(this.page.locator('#playBtn'));
		this.winButton = this.page.locator('#winModalLink').or(this.page.locator('#winModalBtn'));
		this.playButton = this.page.locator('#playBtn');
	}
	@step()
	async clickMainButton() {
		await this.page.waitForTimeout(2000);
		await this.mainButton.first().click({ timeout: 15000 });
	}
	@step()
	async clickWinButton() {
		await this.page.waitForTimeout(2000);
		await this.winButton.click({ delay: 1000 });
	}
	@step()
	async clickPlayButton() {
		await this.page.waitForTimeout(5000);
		await this.playButton.last().click({ timeout: 5000 });
	}
}
