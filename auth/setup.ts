import test from "@playwright/test";
import { Login } from "@page.object";


test("Setup", async ({ page }) => {
      const login = new Login(page);
      await login.open();
      await login.signIn({
            userName: process.env.LOGIN!,
            password: process.env.PASSWORD!,
      });
      console.log("Logged in",
            process.env.LOGIN!,
            process.env.PASSWORD!);
      /**
       * Path to the authentication file.
       */
      const authFile = "auth/authFile.json";
      await page.context()
            .storageState({ path: authFile });

});
