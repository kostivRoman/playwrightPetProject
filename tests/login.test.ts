import { expect, test } from "@playwright/test";
import { Login } from "../app/page/login.page";

test.describe("Login", () => {
      test("User can login with valid credentials", async ({ page }) => {
            const user = { userName: "Admin", password: "admin123" };

            const login = new Login(page);
            await login.open();
            await login.signIn(user);
            await login.expectSignedIn();
      });
      test("Login with invalid user name", async ({ page }) => {
            const user = { userName: "Admn", password: "admin123" };

            const login = new Login(page);
            await login.open();
            await login.signIn(user);
            await login.expectErrorNotification("Invalid credentials");
      });
      test("Login with invalid password", async ({ page }) => {
            const user = { userName: "Admin", password: "admin" };

            const login = new Login(page);
            await login.open();
            await login.signIn(user);
            await login.expectErrorNotification("Invalid credentials");
      });
      test("Login with empty user name", async ({ page }) => {
            const user = { userName: "", password: "admin123" };

            const login = new Login(page);
            await login.open();
            await login.signIn(user);
            await login.expectErrorNotification("Required");
      });
      test("Login with empty password", async ({ page }) => {
            const user = { userName: "Admin", password: "" };
            const login = new Login(page);
            await login.open();
            await login.signIn(user);
            await login.expectErrorNotification("Required");
      });
});
