import { Locator, Page } from "playwright";
import { step } from "../helpers/step";

export class Slots {
      private cardList: Locator;
      private popup1: Locator;
      constructor(protected page: Page) {
            this.cardList = this.page.locator(".main__text");
            this.popup1 = this.page.locator(".popup-1").or(this.page.locator(".popup-2"));
      }

      @step()
      async expectLoaded() {
            await this.cardList.waitFor({ state: "visible" });
      }
      @step()
      async clickCards() {
            const cards = await this.page.locator(".cat").all();
            for (const card of cards) {
                  try {
                        await this.page.waitForTimeout(2000);
                        await card.hover({ force: true, timeout: 2000 })
                        await card.click({ force: true, delay: 1000, timeout: 2000 });
                  } catch (error) {
                        console.log("error", error);
                  }
            }
            await this.claimBonus();
      }
      @step()
      async claimBonus() {
            const button = this.popup1.getByRole("img").or(this.popup1.locator("#lastBtn"));
            await button.first().waitFor({ state: "visible" });
            await this.page.waitForTimeout(2000);
            await button.first().click({ delay: 1000 });
      }
}
