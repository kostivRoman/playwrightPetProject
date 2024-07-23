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
	private currencySelect?: Locator;
	private promoCodeInput?: Locator;
	private sighUpButton: Locator;
	private loginButton: Locator;
	private showPasswordButton: Locator;
	private nameInput?: Locator;
	private lastNameInput?: Locator;
	private formElements: UserRegistrationForm;
	private phoneNumberInput?: Locator;

	constructor(protected page: Page, formElements: UserRegistrationForm) {
		/// console.log("formElements", formElements);

		this.page = page;
		this.formElements = formElements;
		// this.title = this.page.locator(".form-title");
		this.sighUpButton = this.page.getByRole("button", { name: "Sign Up" });
		this.loginButton = this.page.locator("button[type='submit']");
		this.showPasswordButton = this.page.locator(".show-password");
		if (formElements.name === true) {
			this.page.locator("#name");
		}
		if (formElements.phoneNumber) {
			this.phoneNumberInput = this.page.locator("#phoneNumber");
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
		if (this.formElements.name) {

			this.nameInput = this.page.locator("#firstName");
			this.lastNameInput = this.page.locator("#lastName");
		}
	}

	@step()
	async selectCountry(country?: string): Promise<void> {
		if (this.formElements.country) {
			if (country) {
				await this.countrySelect?.click({ timeout: 10000 });
				await this.countrySelect?.getByText(country).first().click();
				return;
			}
		}
	}
	@step()
	async selectCurrency(currency: string): Promise<void> {
		if (this.currencySelect) {
			await this.currencySelect.click();
			if (await this.page.getByText("CAT").isVisible()) {
				await this.page.getByText("CAT").click();
			} else if (await this.page.getByText("USD").isVisible()) {
				await this.page.getByText("USD").click();

			}
			else if (await this.page.getByText("РУБ").isVisible()) {
				await this.page.getByText("РУБ").click();
			}
		}
	}
		@step()
		async expectedInvalidEmail(): Promise < void> {
			if(this.emailInput) {
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
			return
		}
		return;
	}
	@step()
	async fillLastName(lastName: string): Promise<void> {
		if (this.formElements.name) {
			await this.lastNameInput?.fill(lastName);
			return;
		}
	}



	@step()
	async fillForm(user: UserData): Promise<void> {

		await this.fillName(user.name);
		await this.fillLastName(user.lastName);
		await this.fillEmail(user.email);
		await this.fillPassword(user.password);
		await this.selectCountry();
		await this.selectCurrency(user.currency);
		//await this.fillPromoCode(user.promoCode);
		await this.fillPhoneNumber("1234567890");

	}
	@step()
	async login(): Promise<void> {
		await this.loginButton.click();
	}
	@step()
	async fillPhoneNumber(phoneNumber: string): Promise<void> {
		if (this.formElements.phoneNumber) {
			await this.phoneNumberInput?.fill(phoneNumber);
		}
	}
}
