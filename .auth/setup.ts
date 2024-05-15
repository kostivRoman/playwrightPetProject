import test from "@playwright/test";
import { Login } from "../app/page/login.page";

test("Setup", async ({ page }) => {
      const login = new Login(page);
      await login.open();
      console.log("Logging in",
            process.env.LOGIN!,
            process.env.PASSWORD!
      );
      await login.signIn({
            userName: process.env.LOGIN!,
            password: process.env.PASSWORD!,
      });
      const authFile = ".auth/authFile";
      await page.context()
            .storageState({ path: authFile });

});
