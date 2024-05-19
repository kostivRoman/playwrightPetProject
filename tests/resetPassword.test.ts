import { test } from "@fixtures";
test.describe("Reset Password", () => {
	test("User can reset password with valid user name", async ({
		app: { login, resetPassword },
	}) => {
		/**
		 * The username for the user.
		 */
		const userName = process.env.LOGIN!;
		await login.open();
		await login.clickForgotPassword();
		await resetPassword.resetPassword(userName);
		await resetPassword.expectResetPasswordSuccess();
	});
});
