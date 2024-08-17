import { Locator, Page, expect } from "@playwright/test";
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
	private emailInput: Locator;
	private passwordInput: Locator;
	private countrySelect: Locator;
	private countryItem?: Locator;
	private currencySelect: Locator;
	private currencyItem?: Locator;
	private promoCodeInput: Locator;
	//private sighUpButton: Locator;
	private submitButton: Locator;
	private showPasswordButton: Locator;
	private nameInput: Locator;
	private lastNameInput: Locator;
	private formElements: UserRegistrationForm;
	private phoneNumberInput: Locator;
	private phoneCodeSelector: Locator;
	private phoneCodeItem: Locator;

	constructor(
		protected page: Page,
		formElements: UserRegistrationForm,
	) {
		/// console.log("formElements", formElements);

		this.page = page;
		this.formElements = formElements;
		// this.title = this.page.locator(".form-title");
		//this.sighUpButton = this.page.getByRole("button", { name: "Sign Up" });
		this.submitButton = this.page.locator("button[type='submit']");
		this.showPasswordButton = this.page.locator(".show-password");

		this.phoneNumberInput = this.page.locator("#phoneNumber");
		this.phoneCodeSelector = this.page.locator("#sv-phoneCode-select");
		this.phoneCodeItem = this.page.locator("#phoneCodeOption");

		//   console.log("formElements.email", formElements.email);
		this.emailInput = this.page.locator("#email");
		// console.log("this.emailInput", this.emailInput);

		this.passwordInput = this.page.locator("#password");

		//console.log("formElements.country", formElements.country);
		//console.log("this.page.locator('.select-button')", this.page.locator(".select-button"));
		this.countrySelect = this.page.locator("#sv-countryCode-select");
		this.countryItem = this.page.locator(".sv-item--wrap");
		//this.page.locator("#countryOption");

		this.promoCodeInput = this.page.locator("#registrationPromoCode");

		this.currencySelect = this.page.locator("#sv-currency-select");

		this.nameInput = this.page.locator("#firstName");
		this.lastNameInput = this.page.locator("#lastName");
	}
	async expectLoaded(): Promise<void> {
		await this.submitButton.waitFor({ state: "visible" });
	}
	@step()
	async selectCountry(): Promise<void> {
		if (this.formElements.country) {
			await this.countrySelect?.waitFor({ timeout: 5000 });
			await this.page.waitForTimeout(500);
			await this.countrySelect?.click({ force: true, delay: 1000 });

			// Wait for the country items to be visible
			await this.page.waitForSelector(".sv-item--wrap", { state: "visible" });

			// Assuming 'your-country-item-selector' is the selector for country items
			const countryItems = await this.page
				.locator("button", { has: this.countrySelect })
				.locator(".sv-item--wrap")
				.all();
			await this.page.waitForTimeout(1000);
			if (countryItems.length > 0) {
				// Generate a random index
				const randomIndex = Math.floor(Math.random() * countryItems.length);

				// Click on a random country item
				//	await countryItems[randomIndex].waitFor()
				//await countryItems[randomIndex].click({ delay: 1000 });
				await this.page
					.locator("button", { has: this.countrySelect })
					.locator(".sv-item--wrap")
					.nth(randomIndex)
					.click();
				return;
			} else {
				throw new Error("No country items found");
			}
		} else {
			console.log("Country is not needed");
		}
	}
	@step()
	async selectCurrency(): Promise<void> {
		if (this.formElements.currency) {
			try {
				await this.currencySelect.waitFor({ timeout: 5000 });
				await this.page.waitForTimeout(1000);
				await this.currencySelect.click({ force: true, delay: 1000 });
				const currencyItems = await this.page
					.locator("button", { has: this.currencySelect })
					.locator(".sv-item--wrap")
					.all();
				await this.page.waitForTimeout(4000);

				const randomIndex = Math.floor(Math.random() * currencyItems.length - 1);
				await this.page
					.locator("button", { has: this.currencySelect })
					.locator(".sv-item--wrap")
					.nth(randomIndex)
					.click({ delay: 1000, timeout: 5000 });
			} catch (error) {
				throw new Error("Currency selector is not visible");
			}
		} else {
			await expect(this.currencySelect).not.toBeVisible();
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
			return;
		} else {
			console.log("Password is not needed");
		}
	}
	@step()
	async fillEmail(email: string): Promise<void> {
		if (this.emailInput) {
			await this.emailInput?.fill(email, { timeout: 30000 });
			return;
		} else {
			console.log("Email is not needed");
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
	async fillPromoCode(promoCode: string): Promise<void> {
		if (this.formElements.promoCodeText) {
			await this.promoCodeInput.fill(promoCode);
		} else {
			await expect(this.promoCodeInput).not.toBeVisible();
		}
	}
	@step()
	async fillName(name: string): Promise<void> {
		if (this.formElements.name) {
			await this.nameInput.waitFor({ state: "visible" });
			await this.page.waitForTimeout(500);
			await this.nameInput?.fill(name);
		} else {
			await expect(this.nameInput).not.toBeVisible();
		}
	}
	@step()
	async fillLastName(lastName: string): Promise<void> {
		if (this.formElements.name) {
			await this.lastNameInput.waitFor({ state: "visible" });
			await this.page.waitForTimeout(500);
			await this.lastNameInput.fill(lastName);
		} else {
			await expect(this.lastNameInput).not.toBeVisible();
		}
	}
	@step()
	async selectPhoneCode(): Promise<void> {
		if (this.formElements.phoneNumber) {
			try {
				await this.phoneCodeSelector.click({ force: true, delay: 1000, timeout: 20000 });
				//await this.page.waitForSelector(".sv-item--wrap", { state: "visible" });
				const phoneCodeItems = await this.page
					.locator("button", { has: this.phoneCodeSelector })
					.locator(".sv-item--wrap")
					.all();
				await this.page.waitForTimeout(1000);

				// Generate a random index
				const randomIndex = Math.floor(Math.random() * phoneCodeItems.length);
				await this.page
					.locator("button", { has: this.phoneCodeSelector })
					.locator(".sv-item--wrap")
					.nth(randomIndex)
					.click({ delay: 1000, force: true });
			} catch (error) {
				throw new Error("Phone code selector is not visible");
			}
		} else {
			await expect(this.phoneCodeSelector).not.toBeVisible();
		}
	}

	@step()
	async fillForm(user: UserData): Promise<void> {
		await this.fillName(user.name);
		await this.fillLastName(user.lastName);
		await this.fillEmail(user.email);
		await this.page.waitForTimeout(2000);
		await this.fillPassword(user.password);
		await this.selectPhoneCode();
		await this.fillPhoneNumber("1234567890");
		await this.selectCountry();
		await this.page.waitForTimeout(2000);
		await this.selectCurrency();
		await this.fillPromoCode(user.promoCode);
	}
	@step()
	async submit(): Promise<void> {
		await this.submitButton.waitFor({ state: "visible" });
		// await this.page.waitForTimeout(3000);
		// await this.submitButton.hover();
		await this.submitButton.click({ delay: 500 });
	}
	@step()
	async fillPhoneNumber(phoneNumber: string): Promise<void> {
		if (this.formElements.phoneNumber) {
			//await this.phoneCodeSelector?.waitFor({ state: "visible" });
			await this.phoneNumberInput.waitFor({ state: "visible" });
			await this.page.waitForTimeout(1000);
			await this.phoneNumberInput.fill(phoneNumber);
		}
	}
}
