import { Locator, Page } from "@playwright/test";
import { step } from "../helpers/step";

export class Box {
      private spinButton: Locator;
      private winButton: Locator;
      constructor(protected page: Page) {
            this.page = page;
            this.spinButton = this.page.locator("#playBtn");
            this.winButton = this.page.locator("#winModalBtn").or(this.page.locator("#winModalLink"));
      }

      @step()
      async spinBox(): Promise<void> {
            await this.page.waitForTimeout(5000);
            await this.spinButton.first().waitFor({ state: "visible" });

            await this.spinButton.hover({ force: true, timeout: 5000 });
            await this.spinButton.click({ force: true, delay: 3000, timeout: 5000 });

      }



      @step()
      async claimBonus() {
            await this.winButton.click({ timeout: 20000 });
      }
}
