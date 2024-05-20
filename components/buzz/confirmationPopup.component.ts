import { step } from "@helpers";
import { Component } from "@page.object";
import { expect } from "@playwright/test";

export class ConfirmationPopup extends Component {
      private confirmationPopup = this.page.getByRole('dialog');
      
      private deleteButton = this.confirmationPopup.getByRole('button', { name: 'Yes, Delete' });
      private cancelButton = this.confirmationPopup.getByRole('button', { name: 'No, Cancel' });

      @step()
      async expectLoaded(message?: 'Expected Confirmation popup loaded'): Promise<void> {
            await expect(this.confirmationPopup).toBeVisible();
            await expect(this.deleteButton).toBeVisible();
            await expect(this.cancelButton,message).toBeVisible();
      }
      @step()
      async confirm() {
            await this.expectLoaded();
            await this.deleteButton.click();
      }
      @step()
      async cancel() {
            await this.expectLoaded();
            await this.cancelButton.click();
      }
}