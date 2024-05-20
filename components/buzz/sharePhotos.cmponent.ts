/**
 * Represents a dialog for sharing photos.
 */
import { step } from "@helpers";
import { Component } from "@page.object";
import { expect } from "@playwright/test";

export class SharedPhotosDialog extends Component {
      private dialog = this.page.getByRole("dialog");
      private whatIsOnYourMindInput = this.dialog.getByRole("textbox", {
            name: "What's on your mind?",
      });

      /**
       * Asserts that the shared photos dialog is loaded and visible.
       */
      @step()
      async expectLoaded() {
            await expect(this.dialog).toBeVisible();
            expect(this.dialog.innerText()).toContain("Share Photos");
            await expect(this.whatIsOnYourMindInput).toBeVisible();
      }
}
