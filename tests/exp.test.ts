import test, { expect, Page } from "playwright/test";
import { RegForm, UserData } from "../app/components/regForm.component";
import { Tap } from "../app/components/tap.component";
import { UserRegistrationForm, Brand } from "../app/types/form.interface";
import { brandsRules } from "../testData/brandsFormRules";
import { randomUUID } from "crypto";
import { serverList } from "../testData/serverList";
import { tryNavigate } from "../app/helpers/tryNavigate";
import { getFormRules } from "../app/helpers/getFormRules";
import { user } from '../testData/user';
import { tap } from "node:test/reporters";
import { Wheel } from "../app/components/wheel.component";

const land = {
      "Brand": "CAT",
      "Type": "Preland",
      "Action": [
            "Wheel",
            "Cat Casino"
      ],
      "Regform": "Long",
      "GEO": "Multi",
      "Format": "old",
      "Affilka Landing Name": "Preland / Wheel / Cat Casino / Short",
      "Affilka Landing URL": "https://x.catlanding.com/"
};
const filteredBrandRules = {
      name: "DOIT",
      short: {
            name: false,
            email: true,
            password: true,
            country: true,
            currency: true,
            phoneNumber: false,
            promoHidden: false,
            promoOpen: false,
            promoCodeText: false,
            banner: true,
      },
      long: {
            name: false,
            email: true,
            password: true,
            country: true,
            currency: true,
            phoneNumber: true,
            promoHidden: false,
            promoOpen: false,
            promoCodeText: true,
            banner: false,
      },

}

test(`Tap Land`, async ({ page, browser }) => {
      // const filteredBrandRules = brandsRules.find((brand) => brand.name === land.Brand) as Brand;
      // console.log("filteredRules", filteredBrandRules);
      const formType = land.Regform;
      let regFormRules = getFormRules(formType, filteredBrandRules);
      // const regRulesString = JSON.stringify(regFormRules);
      // test.info().attach("info", {
      //       body: JSON.stringify({
      //             Brand: land.Brand,
      //             Country: land.GEO,
      //             Type: land.Type,
      //             Action: land.Action,
      //             URL: land["Affilka Landing URL"],
      //             regForm: land.Regform,
      //             regFormRules: regRulesString,
      //       }),
      // });

      const wheel = new Wheel(page);
      const form = new RegForm(page, regFormRules);
      // await page.addLocatorHandler(page.locator(".form-inner"), async () => {

      //       await page.locator(".retry-btn").click();
      // });
      await tryNavigate(page, land["Affilka Landing URL"]);
      await page.waitForTimeout(5000);
      await wheel.spinWheel();
      await wheel.claimBonus();
      //await tap.tap();
      //await tap.clickBonusButton();

      await form.fillForm(user);

      //await expect(page).toHaveURL(new RegExp(`${serverList[0].url}`), { timeout: 60000 * 2 });
});


