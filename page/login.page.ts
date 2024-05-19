import { expect } from "@playwright/test";
import { AppPage } from "@page.object";
import { step } from "@helpers";



/**
 * Represents the login page of the application.
 */
export class Login extends AppPage {
      public pagePath = "";
      private LoginButton = this.page.getByRole("button", { name: "Login" });
      private userNameInput = this.page.getByPlaceholder("Username");
      private passwordInput = this.page.getByPlaceholder("Password");
      private forgotPasswordLink = this.page.getByText("Forgot your password?");

      @step()
      /**
       * Checks if the login page is loaded by verifying the visibility of the login button,
       * username input, and password input.
       */
      async expectLoaded() {
            await expect(this.LoginButton).toBeVisible();
            await expect(this.userNameInput).toBeVisible();
            await expect(this.passwordInput).toBeVisible();
      }

      /**
       * Signs in the user with the provided credentials.
       * 
       * @param user - The user's credentials.
       */
      @step()
      async signIn(user: { userName: string; password: string }) {
            await this.expectLoaded();
            await this.userNameInput.fill(user.userName);
            await this.passwordInput.fill(user.password);
            await this.LoginButton.click();
      }

      
      @step()
      /**
       * Checks if the user is signed in by verifying the URL and the visibility of the profile picture.
       * @returns {Promise<void>} A promise that resolves when the check is complete.
       */
      async expectSignedIn() {
            await expect(this.page).toHaveURL("web/index.php/dashboard/index");
            await expect(
                  this.page
                        .getByRole("banner")
                        .getByRole("img", { name: "profile picture" })
            ).toBeVisible();
      }

      /**
       * Expects an error notification with the specified message to be visible.
       * 
       * @param message - The error message to expect.
       */
      @step()
      async expectErrorNotification(message: string): Promise<void> {
            await expect(this.page.getByText(message)).toBeVisible();
      }

      @step()
      /**
       * Clicks on the "Forgot Password" link.
       * @returns {Promise<void>} A promise that resolves when the link is clicked.
       */
      async clickForgotPassword() {
            await this.forgotPasswordLink.click();
      }
}
