import { Locator, Page, expect } from "@playwright/test";
import { step } from "../helpers/step";
import { waitForDebugger } from "inspector";

export class Wheel {
	private wheel: Locator;
	private wheelButton: Locator;
	private winOne: Locator;
	private win2: Locator;
	private winPopup: Locator;
	//private claimButton: Locator;

	constructor(protected page: Page) {
		this.page = page;
		this.wheel = this.page.locator(".wheel").or(this.page.locator(".main__wheel_block"));
		this.wheelButton = this.wheel
			.locator("#launcher")
			.or(this.wheel.locator(".wheel__btn"))
			.or(this.wheel.locator(".main__wheel_btn"))
			.or(this.wheel.locator(".round-button"))
			.or(this.wheel.locator("button"));

		this.winOne = this.page
			.locator(".bonus-1")
			.or(this.page.locator("#prize1"))
			.or(this.page.locator(".main__plashka_left"))
			.or(this.page.locator(".main__popup_left"))
			.or(this.page.locator(".popup-left"));
		this.win2 = this.page
			.locator(".bonus-2")
			.or(this.page.locator("#prize2"))
			.or(this.page.locator(".main__plashka_right"))
			.or(this.page.locator(".main__popup_right"));
		this.winPopup = this.page
			.locator(".popup__item")
			.or(this.page.locator(".popups__final"))
			.or(this.page.locator(".modal-inner"))
			.or(this.page.locator(".modal"));
		// this.claimButton = this.winPopup
		//   .getByRole("link")
		//   .or(this.winPopup.locator("#lastBtn"));
	}
	async getPopup() {
		return this.winPopup;
	}
	@step()
	async spinWheel(): Promise<void> {
		const button = this.wheelButton.first();

		await button.waitFor({ state: "visible" });
		await this.page.waitForTimeout(2000);
		await button.hover({ force: true });
		await button.click({ force: true, timeout: 10000 });
		await this.page.waitForTimeout(4000);

		try {
			await button.click({ force: true, timeout: 1000 });
			// await this.page.waitForTimeout(2000);
		} catch (error) {
			console.log("Error: ", error);
		}
	}

	@step()
	async expectedWinOneVisible() {
		await expect(this.winOne).toBeVisible();
	}
	@step()
	async expectedWinTwoVisible() {
		await expect(this.win2).toBeVisible();
	}

	@step()
	async claimBonus() {
		const popup = await this.getPopup();
		await popup
			.getByRole("link")
			.or(popup.locator("#lastBtn"))
			.or(popup.locator("button"))
			.first()
			.waitFor({ state: "visible" });
		await this.page.waitForTimeout(2000);
		await popup
			.getByRole("link")
			.or(popup.locator("#lastBtn"))
			.or(popup.locator("button"))
			.first()
			.click({ timeout: 10000 });
	}
}
