import test from "@playwright/test";
import { Login } from "@page.object";


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
      /**
       * Path to the authentication file.
       */
      const authFile = "auth/authFile.json";
      await page.context()
            .storageState({ path: authFile });

});
