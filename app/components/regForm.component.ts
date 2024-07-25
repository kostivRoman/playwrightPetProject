import { Page, Locator, expect } from "@playwright/test";
import { step } from "../helpers/step";
import { UserRegistrationForm } from "../types/form.interface";

export interface UserData {
	email: string;
	password: string;
	country: string;
	currency: string;
	promoCode: string;
	name: string;
	lastName: string;
}

export class RegForm {
	private emailInput?: Locator;
	private passwordInput?: Locator;
	private countrySelect?: Locator;
	private countryItem?: Locator;
	private currencySelect?: Locator;
	private currencyItem?: Locator;
	private promoCodeInput?: Locator;
	//private sighUpButton: Locator;
	private submitButton: Locator;
	private showPasswordButton: Locator;
	private nameInput?: Locator;
	private lastNameInput?: Locator;
	private formElements: UserRegistrationForm;
	private phoneNumberInput?: Locator;
	private phoneCodeSelector?: Locator;
	private phoneCodeItem?: Locator;

	constructor(protected page: Page, formElements: UserRegistrationForm) {
		/// console.log("formElements", formElements);

		this.page = page;
		this.formElements = formElements;
		// this.title = this.page.locator(".form-title");
		//this.sighUpButton = this.page.getByRole("button", { name: "Sign Up" });
		this.submitButton = this.page.locator("button[type='submit']");
		this.showPasswordButton = this.page.locator(".show-password");
		if (formElements.name === true) {
			this.page.locator("#name");
		}
		if (formElements.phoneNumber) {
			this.phoneNumberInput = this.page.locator("#phoneNumber");
			this.phoneCodeSelector = this.page.locator("#sv-phoneCode-select");
			this.phoneCodeItem = this.page.locator("#phoneCodeOption");
		}

		if (formElements.email) {
			//   console.log("formElements.email", formElements.email);
			this.emailInput = this.page.locator("#email");
			// console.log("this.emailInput", this.emailInput);
		}
		if (formElements.password) {
			this.passwordInput = this.page.locator("#password");
		}

		if (formElements.country) {
			//console.log("formElements.country", formElements.country);
			//console.log("this.page.locator('.select-button')", this.page.locator(".select-button"));
			this.countrySelect = this.page.locator('#sv-countryCode-select');
			this.countryItem = this.page.locator(".sv-item--wrap");
			//this.page.locator("#countryOption");
		}
		if (formElements.promoCodeText) {
			this.promoCodeInput = this.page.locator("#registrationPromoCode");
		}

		if (formElements.currency) {
			this.currencySelect = this.page
				.locator("#sv-currency-select");
		}
		if (this.formElements.name) {

			this.nameInput = this.page.locator("#firstName");
			this.lastNameInput = this.page.locator("#lastName");
		}
	}

	@step()
	async selectCountry(country?: string): Promise<void> {
		if (this.formElements.country) {
			await this.countrySelect?.waitFor({ state: "visible" });
			await this.page.waitForTimeout(500);
			await this.countrySelect?.click({ force: true, delay: 1000 });

			// Wait for the country items to be visible
			await this.page.waitForSelector(".sv-item--wrap", { state: "visible" });

			// Assuming 'your-country-item-selector' is the selector for country items
			const countryItems = await this.page.locator('button', { has: this.countrySelect })
				.locator('.sv-item--wrap').all();
			await this.page.waitForTimeout(1000);
			if (countryItems.length > 0) {
				// Generate a random index
				const randomIndex = Math.floor(Math.random() * countryItems.length);

				// Click on a random country item
				//	await countryItems[randomIndex].waitFor()
				//await countryItems[randomIndex].click({ delay: 1000 });
				await this.page.locator('button', { has: this.countrySelect })
					.locator('.sv-item--wrap').nth(randomIndex).click();
			} else {
				throw new Error('No country items found');
			}
		} else {
			return;
		}
	}
	@step()
	async selectCurrency(): Promise<void> {
		if (this.formElements.currency) {
			await this.currencySelect?.waitFor({ state: "visible" });
			//await this.page.waitForTimeout(1000);
			await this.currencySelect?.click({ force: true, delay: 1000 });

			// Wait for the country items to be visible
			await this.page.waitForSelector(".sv-item--wrap", { state: "visible" });

			// Assuming 'your-country-item-selector' is the selector for country items
			//const currencyItems = await this.page.$$('.sv-item--wrap');
			const currencyItems = await this.page.locator('button', { has: this.currencySelect })
				.locator('.sv-item--wrap').all();
			await this.page.waitForTimeout(1000);
			if (currencyItems.length > 0) {
				// Generate a random index
				const randomIndex = Math.floor(Math.random() * currencyItems.length);

				// Click on a random country item
				//	await countryItems[randomIndex].waitFor()
				await this.page.locator('button', { has: this.currencySelect })
					.locator('.sv-item--wrap').nth(randomIndex).click({ delay: 1000, force: true, timeout: 5000 });
			} else {
				throw new Error('No country items found');
			}
		} else {
			return;
		}
	}
	@step()
	async expectedInvalidEmail(): Promise<void> {
		if (this.emailInput) {
			await expect.soft(this.emailInput).toHaveAttribute("aria-invalid", "true");
		}
	}
	@step()
	async fillPassword(password: string): Promise<void> {
		if (this.passwordInput) {
			await this.passwordInput.fill(password);
		}
	}
	@step()
	async expectedInvalidPassword(): Promise<void> {
		if (this.passwordInput) {
			await expect.soft(this.passwordInput).toHaveAttribute("aria-invalid", "true");
		}
	}
	@step()
	async expectedInvalidPromoCode(): Promise<void> {

		await expect
			.soft(this.promoCodeInput!)
			.toHaveAttribute("aria-invalid", "true", { timeout: 30000 });

	}
	@step()
	async fillEmail(email: string): Promise<void> {
		if (this.formElements.email) {
			await this.emailInput?.fill(email);
		}
	}
	@step()
	async fillPromoCode(promoCode: string): Promise<void> {
		if (this.formElements.promoCodeText) {
			await this.promoCodeInput?.fill(promoCode);
		}
	}
	@step()
	async fillName(name: string): Promise<void> {
		if (this.formElements.name) {
			await this.nameInput?.fill(name);
		}

	}
	@step()
	async fillLastName(lastName: string): Promise<void> {
		if (this.formElements.name) {
			await this.lastNameInput?.fill(lastName);
		}
	}
	@step()
	async selectPhoneCode(): Promise<void> {
		if (this.formElements.phoneNumber) {
			await this.phoneCodeSelector?.waitFor({ state: "visible" });
			//await this.page.waitForTimeout(1000);
			await this.phoneCodeSelector?.click({ force: true, delay: 1000 });
			await this.page.waitForSelector(".sv-item--wrap", { state: "visible" });
			const phoneCodeItems = await this.page.locator('button', { has: this.phoneCodeSelector})
				.locator('.sv-item--wrap').all();
			await this.page.waitForTimeout(1000);
			if (phoneCodeItems.length > 0) {
				// Generate a random index
				const randomIndex = Math.floor(Math.random() * phoneCodeItems.length);
				await this.page.locator('button', { has: this.phoneCodeSelector })
					.locator('.sv-item--wrap').nth(randomIndex).click({ delay: 1000, force: true });
			} else {
				throw new Error('No currency items found');
			}
		}
	}


	@step()
	async fillForm(user: UserData): Promise<void> {

		await this.fillName(user.name);
		await this.fillLastName(user.lastName);
		await this.fillEmail(user.email);
		await this.fillPassword(user.password);
		await this.selectCountry();
		await this.selectCurrency();
		//await this.fillPromoCode(user.promoCode)
		await this.selectPhoneCode();
		await this.fillPhoneNumber("1234567890");

	}
	@step()
	async submit(): Promise<void> {

		await this.submitButton.click();
	}
	@step()
	async fillPhoneNumber(phoneNumber: string): Promise<void> {
		if (this.formElements.phoneNumber) {
			//await this.phoneCodeSelector?.waitFor({ state: "visible" });
			await this.phoneNumberInput?.waitFor({ state: "visible" });
			await this.page.waitForTimeout(500);
			await this.phoneNumberInput?.fill(phoneNumber);
		}
	}

}
