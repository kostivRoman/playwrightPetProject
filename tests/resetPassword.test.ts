import { test } from "@playwright/test";
import { ResetPassword } from "../app/page/resetPassword.page";
import { Login } from "../app/page/login.page";

test.describe("Reset Password", () => {
      test("User can reset password with valid user name", async ({ page }) => {
            const userName = process.env.USERNAME!
            const resetPassword = new ResetPassword(page);
            const login = new Login(page);
            await login.open();
            await login.clickForgotPassword();
            await resetPassword.resetPassword(userName);
            await resetPassword.expectResetPasswordSuccess();

      });
});