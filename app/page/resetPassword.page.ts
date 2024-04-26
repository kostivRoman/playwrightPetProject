import { expect } from "@playwright/test";
import { AppPage } from "../abstractClasses";
import { step } from "../../helpers/reporter/step"


export class ResetPassword extends AppPage {
      public pagePath = '/web/index.php/auth/requestPasswordResetCode'

      private resetPasswordButton = this.page.getByRole('button', { name: 'Reset Password' })
      private userNameInput = this.page.getByPlaceholder('Username')
      private cancelButton = this.page.getByRole('button', { name: 'Cancel' })
      @step()
      async expectLoaded() {
            await expect(this.resetPasswordButton).toBeVisible();
            await expect(this.userNameInput).toBeVisible();
            await expect(this.cancelButton).toBeVisible();
      }

      @step()
      async resetPassword(user: { userName: string, email: string }) {
            await this.expectLoaded();
            await this.userNameInput.fill(user.userName)
            await this.resetPasswordButton.click()
      }
      @step()
      async expectResetPasswordSuccess() {
            await expect(this.page).toHaveURL('/web/index.php/auth/sendPasswordReset')
            await expect(this.page.getByText('Reset Password link sent successfully'))
                  .toBeVisible()
      }

      @step()
      async cancelResetPassword() {
            await this.cancelButton.click()
      }
}