import { Locator, Page, expect } from "@playwright/test";
import { filterLocators } from "../helpers/formHelpers";
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
    this.submitButton = this.page.locator("button[type='submit']");
    this.showPasswordButton = this.page.locator(".show-password");
    this.phoneNumberInput = this.page.locator("#phoneNumber");
    this.phoneCodeSelector = this.page.locator("#sv-phoneCode-select").or(this.page.locator("button", { has: this.page.locator("#sv-phoneCode-select") }));
    this.phoneCodeItem = this.page.locator("#phoneCodeOption");
    this.emailInput = this.page.locator("#email");
    this.passwordInput = this.page.locator("#password");
    this.countrySelect = this.page.locator("#sv-countryCode-select");
    this.countryItem = this.page.locator(".sv-item--wrap");
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
      try {
        const defaultCountry = await this.countrySelect.innerText();;
        await this.page.waitForTimeout(1000);
        await this.countrySelect.click({ force: true, delay: 1000 });
        const countryItems = await this.page
          .locator("#countryOption")
          .all();
        await this.page.waitForTimeout(1000);
        const filteredLocators = await filterLocators(defaultCountry, countryItems);

        const randomIndex = Math.floor(Math.random() * (filteredLocators.length));
        await filteredLocators[randomIndex].click({ delay: 1000 });
      } catch (error) {
        throw error;
      }
    } else {
      await expect(this.countrySelect).not.toBeVisible();
    }
  }
  @step()
  async selectCurrency(): Promise<void> {
    if (this.formElements.currency) {
      try {
        await this.currencySelect.waitFor({ timeout: 5000 });
        await this.page.waitForTimeout(1000);
        //  console.log("currencySelect", await this.currencySelect.inputValue());
        const defaultCurrency = await this.currencySelect.inputValue();
        await this.currencySelect.click({ force: true, delay: 1000 });
        const currencyItems = await this.page
          .locator("#currencyOption").all()
        const filteredLocators = await filterLocators(defaultCurrency, currencyItems);
        const randomIndex = Math.floor(Math.random() * filteredLocators.length);
        console.log("randomIndex", randomIndex);
        console.log("currentItem", filteredLocators[randomIndex]);
        await filteredLocators[randomIndex].click({ delay: 1000 });
      } catch (error) {
        throw error;

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
    if (this.formElements.password) {
      await this.passwordInput.fill(password);
    } else {
      await expect(this.passwordInput).not.toBeVisible();
    }
  }
  @step()
  async fillEmail(email: string): Promise<void> {
    if (this.formElements.email) {
      await this.emailInput.fill(email, { timeout: 10000 });
    } else {
      await expect(this.emailInput).not.toBeVisible();
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
      await this.nameInput.waitFor({ state: "visible", timeout: 20000 });
      await this.page.waitForTimeout(500);
      await this.nameInput?.fill(name);
    } else {
      return await expect(this.nameInput).not.toBeVisible();
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
        const defaultPhoneCode = await this.phoneCodeSelector.inputValue();
        console.log("defaultPhoneCode", defaultPhoneCode);
        await this.phoneCodeSelector.first().click({ force: true, delay: 1000, timeout: 20000 });
        const phoneCodeItems = await this.page.locator('#phoneCodeOption').all()
        await this.page.waitForTimeout(1000);
        const filteredLocators = await filterLocators(defaultPhoneCode, phoneCodeItems);
        const randomIndex = Math.floor(Math.random() * filteredLocators.length);
        // Generate a random index

        await filteredLocators[randomIndex].click({ delay: 1000 });
      } catch (error) {
        throw error;
      }
    } else {
      await expect(this.phoneCodeSelector.first()).not.toBeVisible();
    }
  }

  @step()
  async fillForm(user: UserData): Promise<void> {
    await this.fillName(user.name);
    await this.fillLastName(user.lastName);
    await this.fillEmail(user.email);
    await this.page.waitForTimeout(2000);
    await this.fillPassword(user.password);
    //await this.selectPhoneCode();
    await this.page.waitForTimeout(2000);
    await this.fillPhoneNumber("1234567890");
    await this.selectCountry();
    await this.page.waitForTimeout(2000);
    // try {
    // 	await this.selectCurrency();
    // } catch (error) {
    // 	throw new Error("Currency selector is not visible");
    // }
    await this.selectCurrency();
    //await this.fillPromoCode(user.promoCode);
  }
  @step()
  async submit(): Promise<void> {
    await this.submitButton.click({ delay: 500, clickCount: 1 });
  }
  @step()
  async fillPhoneNumber(phoneNumber: string): Promise<void> {
    if (this.formElements.phoneNumber) {
      //await this.phoneCodeSelector?.waitFor({ state: "visible" });
      await this.phoneNumberInput.waitFor({ state: "visible" });
      await this.page.waitForTimeout(1000);
      await this.phoneNumberInput.fill(phoneNumber);
    }
    else {
      await expect(this.phoneNumberInput).not.toBeVisible();
    }
  }
}
