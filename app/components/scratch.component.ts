import { Locator, Page } from "playwright";
import { step } from "../helpers/step";

export class Scratch {
  private cardList: Locator;
  private bonusButton: Locator;
  constructor(protected page: Page) {
    //	this.page = page;
    this.cardList = this.page.locator(".cards");
    this.bonusButton = this.page.locator(".second-button");
  }

  @step()
  async expectLoaded() {
    await this.cardList.waitFor({ state: "visible" });
  }
  @step()
  async clickCards() {
    const cards = await this.cardList.getByRole("button").all();
    for (const card of cards) {
      try {
        await this.page.waitForTimeout(2000);
        await card.click({ force: true, delay: 1000, timeout: 2000 });
      }
      catch (error) {
        console.log("error", error);
      }
    }
  }
  @step()
  async claimBonus() {
    const button = this.bonusButton.first();
    await button.waitFor({ state: "visible" });
    await this.page.waitForTimeout(3000);
    await button.click({ delay: 1000, timeout: 5000, force: true });
  }
}
