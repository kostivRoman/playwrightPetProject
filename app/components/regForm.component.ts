import { Page, Locator, expect } from "@playwright/test";
import { step } from "../helpers/step";
import { UserRegistrationForm } from "../types/form.interface";

export interface UserData {
	email: string;
	password: string;
	country: string;
	currency: string;
	promoCode: string;
}

export class RegForm {
	private emailInput?: Locator;
	private passwordInput?: Locator;
	private countrySelect?: Locator;
	private currencySelect?: Locator;
	private promoCodeInput?: Locator;
	private sighUpButton: Locator;
	private loginButton: Locator;
	private showPasswordButton: Locator;
	private nameInput?: Locator;

	constructor(protected page: Page, formElements: UserRegistrationForm) {
		/// console.log("formElements", formElements);

		this.page = page;
		// this.title = this.page.locator(".form-title");
		this.sighUpButton = this.page.getByRole("button", { name: "Sign Up" });
		this.loginButton = this.page.getByRole("button", { name: "Login" });
		this.showPasswordButton = this.page.locator(".show-password");
		if (formElements.name === true) {
			this.page.locator("#name");
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
			console.log("formElements.country", formElements.country);
			console.log("this.page.locator('.select-button')", this.page.locator(".select-button"));
			this.countrySelect = this.page
				.locator(".select-button")
				.first()
				.or(this.page.locator(".select-button").first());
		}
		if (formElements.promoCodeText) {
			this.promoCodeInput = this.page.locator("#registrationPromoCode");
		}

		if (formElements.currency) {
			this.currencySelect = this.page
				.locator(".select-button", {
					has: this.page.locator(".currency-label"),
				})
				.or(this.page.locator(".select-button").last());
		}
		if (formElements.name) {
			console.log("formElements.name", formElements.name);
			this.nameInput = this.page.locator("#name");
			console.log("this.nameInput", this.nameInput);
		}
	}
	// @step()
	// async expectLoaded(): Promise<void> {
	//   await expect(this.title).toBeVisible();
	//   await expect(this.title).toHaveText("Registration");
	// }

	@step()
	async selectCountry(country: string): Promise<void> {
		if (this.countrySelect) {
			await this.countrySelect.click();
			await this.countrySelect.getByText(country).first().click();
		}
	}
	@step()
	async selectCurrency(currency: string): Promise<void> {
		if (this.currencySelect) {
			await this.currencySelect.click();
			await this.currencySelect.getByText(currency).click();
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
		if (this.promoCodeInput) {
			await expect
				.soft(this.promoCodeInput)
				.toHaveAttribute("aria-invalid", "true", { timeout: 30000 });
		}
	}
	@step()
	async fillEmail(email: string): Promise<void> {
		if (this.emailInput) {
			await this.emailInput.fill(email);
		}
	}
	@step()
	async fillPromoCode(promoCode: string): Promise<void> {
		if (this.promoCodeInput) {
			await this.promoCodeInput.fill(promoCode);
		}
	}
	@step()
	async fillName(name: string): Promise<void> {
		//
		try {
			await this.nameInput?.fill(name);
		} catch (error) {
			console.log("error", error);
		}
	}
	@step()
	async fillForm(user: UserData): Promise<void> {
		await this.fillEmail(user.email);
		await this.fillPassword(user.password);
		await this.selectCountry(user.country);
		await this.selectCurrency(user.currency);
		await this.fillPromoCode(user.promoCode);
	}
	@step()
	async login(): Promise<void> {
		await this.loginButton.click();
	}
}
