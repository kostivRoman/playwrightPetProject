import { test } from "@fixtures";

/**
 * Test suite for resetting password.
 */
test.describe("Reset Password", () => {
	/**
	 * Test case for resetting password with a valid username.
	 * @param app - The application object containing login and resetPassword methods.
	 * @param context - The test context object.
	 */
	test("User can reset password with valid user name", async ({ app: { login, resetPassword }, context }) => {
		/**
		 * The username for the user.
		 */
		const userName = process.env.LOGIN!;

		await context.clearCookies();
		await login.open();
		await login.clickForgotPassword();
		await resetPassword.resetPassword(userName);
		await resetPassword.expectResetPasswordSuccess();
	});
});
