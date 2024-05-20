import { step } from "@helpers";
import { Component } from "@page.object";
import { expect } from "@playwright/test";

export class SharedPhotosDialog extends Component {
      private dialog = this.page.getByRole("dialog");
      private whatIsOnYourMindInput = this.dialog.getByRole("textbox", {
            name: "What's on your mind?",
      });

      @step()
      async expectLoaded() {
            await expect(this.dialog).toBeVisible();
            expect(this.dialog.innerText()).toContain("Share Photos");
            await expect(this.whatIsOnYourMindInput).toBeVisible();
      }
}
