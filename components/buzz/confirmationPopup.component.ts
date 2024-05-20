import { step } from "@helpers";
import { Component } from "@page.object";
import { expect } from "@playwright/test";

/**
 * Represents a confirmation popup component.
 */
export class ConfirmationPopup extends Component {
      private confirmationPopup = this.page.getByRole('dialog');
      
      private deleteButton = this.confirmationPopup.getByRole('button', { name: 'Yes, Delete' });
      private cancelButton = this.confirmationPopup.getByRole('button', { name: 'No, Cancel' });

      /**
       * Expects the confirmation popup to be loaded.
       * @param message - Optional message to be displayed if the expectation fails.
       */
      @step()
      async expectLoaded(message?: 'Expected Confirmation popup loaded'): Promise<void> {
            await expect(this.confirmationPopup).toBeVisible();
            await expect(this.deleteButton).toBeVisible();
            await expect(this.cancelButton,message).toBeVisible();
      }

      /**
       * Confirms the action by clicking the delete button.
       */
      @step()
      async confirm() {
            await this.expectLoaded();
            await this.deleteButton.click();
      }

      /**
       * Cancels the action by clicking the cancel button.
       */
      @step()
      async cancel() {
            await this.expectLoaded();
            await this.cancelButton.click();
      }
}