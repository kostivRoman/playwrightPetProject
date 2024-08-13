import { Locator, Page } from "@playwright/test";
import { step } from "../helpers/step";

export class Wheel {
	private wheel: Locator;
	private wheelButton: Locator;
	//private winOne: Locator;
	//private win2: Locator;
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

		// this.winOne = this.page
		// 	.locator(".bonus-1")
		// 	.or(this.page.locator("#prize1"))
		// 	.or(this.page.locator(".main__plashka_left"))
		// 	.or(this.page.locator(".main__popup_left"))
		// 	.or(this.page.locator(".popup-left"));
		// this.win2 = this.page
		// 	.locator(".bonus-2")
		// 	.or(this.page.locator("#prize2"))
		// 	.or(this.page.locator(".main__plashka_right"))
		// 	.or(this.page.locator(".main__popup_right"));
		this.winPopup = this.page
			.locator(".popup__item")
			.or(this.page.locator(".popups__final"))
			.or(this.page.locator(".modal-inner"))
			.or(this.page.locator(".modal"));

	}
	async getPopup() {
		return this.winPopup;
	}
	@step()
	async spinWheel(): Promise<void> {
		const button = this.wheelButton.first();
		const popup = await this.getPopup();
		await button.waitFor({ state: "visible" });
		await this.page.waitForTimeout(4000);
		await button.hover({ force: true });
		//await button.click({ force: true, delay: 1000 });
		//await this.page.waitForTimeout(2000);

		// for (let i = 0; i < 3; i++) {
		// 	try {
		// 		await this.page.waitForTimeout(2000);
		// 		await button.click({ force: true, delay: 1000, timeout: 2000 });
		// 		// Optionally, you can add a delay between clicks if needed

		// 	} catch (error) {
		// 		console.log("Error: ", error);
		// 	}
		// }

		do {
			await button.click({ force: true, delay: 1000 });
			await this.page.waitForTimeout(2000);
		} while (await popup.isHidden())
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
			.click({ timeout: 20000 });
	}
}
