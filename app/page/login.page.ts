import { expect } from "@playwright/test";
import { AppPage } from "../abstractClasses";
import { step } from "../../helpers/reporter/step"

export class Login extends AppPage {
      public pagePath = ''

      private LoginButton = this.page.getByRole('button', { name: 'Login' })
      private userNameInput = this.page.getByPlaceholder('Username')
      private passwordInput = this.page.getByPlaceholder('Password')
      private forgotPasswordLink = this.page.getByRole('link', { name: 'Forgot your password?' })

      @step()
      async expectLoaded() {
            await expect(this.LoginButton).toBeVisible();
            await expect(this.userNameInput).toBeVisible();
            await expect(this.passwordInput).toBeVisible();
      }

      @step()
      async signIn(user: { userName: string, password: string }) {
            await this.expectLoaded();
            await this.userNameInput.fill(user.userName)
            await this.passwordInput.fill(user.password)
            await this.LoginButton.click()
      }
      @step()
      async expectSignedIn() {
            await expect(this.page).toHaveURL('web/index.php/dashboard/index')
            await expect(
                  this.page.getByRole('banner').getByRole('img', { name: 'profile picture' }))
                  .toBeVisible()
      }
      @step()
      async expectErrorNotification(message: any): Promise<void> {
            await expect(this.page.getByText(message)).toBeVisible()
      }
      @step()
      async clickForgotPassword() {
            await this.forgotPasswordLink.click()
      }


}