import { expect } from "@playwright/test";
import { AppPage } from "@page.object";
import { step } from "@helpers";

/**
 * Represents the Reset Password page of the application.
 */
export class ResetPassword extends AppPage {
	public pagePath = "/web/index.php/auth/requestPasswordResetCode";
	private resetPasswordButton = this.page.getByRole("button", {
		name: "Reset Password",
	});
	private userNameInput = this.page.getByPlaceholder("Username");
	private cancelButton = this.page.getByRole("button", { name: "Cancel" });

	@step()
	/**
	 * Checks if the reset password page is loaded by verifying the visibility of specific elements.
	 */
	async expectLoaded() {
		await expect(this.resetPasswordButton).toBeVisible();
		await expect(this.userNameInput).toBeVisible();
		await expect(this.cancelButton).toBeVisible();
	}

	@step()
	/**
	 * Resets the password for a user.
	 *
	 * @param userName - The username of the user whose password needs to be reset.
	 * @returns A promise that resolves when the password is successfully reset.
	 */
	async resetPassword(userName: string) {
		await this.expectLoaded();
		await this.userNameInput.fill(userName);
		await this.resetPasswordButton.click();
	}

	@step()
	/**
	 * Expects the reset password process to be successful.
	 * It checks if the current page URL is '/web/index.php/auth/sendPasswordReset'
	 * and if the text 'Reset Password link sent successfully' is visible on the page.
	 */
	async expectResetPasswordSuccess() {
		await expect(this.page).toHaveURL("/web/index.php/auth/sendPasswordReset");
		await expect(
			this.page.getByText("Reset Password link sent successfully")
		).toBeVisible();
	}

	@step()
	/**
	 * Cancels the reset password process.
	 */
	async cancelResetPassword() {
		await this.cancelButton.click();
	}
}
