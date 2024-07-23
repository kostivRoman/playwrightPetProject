import test, { expect, Page } from "playwright/test";
import { RegForm, UserData } from "../app/components/regForm.component";
import { Tap } from "../app/components/tap.component";
import { UserRegistrationForm, Brand } from "../app/types/form.interface";
import { brandsRules } from "../testData/brandsFormRules";
import { randomUUID } from "crypto";
import { serverList } from "../testData/serverList";
import { tryNavigate } from "../app/helpers/tryNavigate";
import { getFormRules } from "../app/helpers/getFormRules";
// 


const proxyItem = {
      "region": "TR",
      "server": "http://geonode_Zr3aVjywHC-country-tr:bebe29a2-c13b-4aa5-8c20-eb3dd10a8afd@premium-residential.geonode.com:9000",
      "username": "geonode_Zr3aVjywHC-country-tr",
      "password": "bebe29a2-c13b-4aa5-8c20-eb3dd10a8afd"
}
const user: UserData = {
      email: `user${randomUUID()}@gmail.com`,
      password: `${randomUUID()}`,
      country: "Portugal",
      currency: "CAT",
      promoCode: "CAT",
      name: "name",
      lastName: "lastName"
};
const land = {
      Brand: 'ALEV',
      Type: 'Land',
      Action: ['Tap', 'Hamster'],
      Regform: 'Long',
      GEO: 'TR',
      Format: 'new',
      'Affilka Landing Name': 'Land / Tap / Hamster / Long / TR',
      'Affilka Landing URL': 'https://805.landing-alev.com/tr/hamster/alev-long'
}

test.describe(() => {
      test.use({
            proxy: {
                  server: proxyItem.server,
                  username: proxyItem.username,
                  password: proxyItem.password,
            },
      });
      test(`Tap Land`, async ({ page, browser }) => {
            const filteredBrandRules = brandsRules.find((brand) => brand.name === land.Brand) as Brand;
            console.log("filteredRules", filteredBrandRules);
            const formType = land.Regform;
            let regFormRules = getFormRules(formType, filteredBrandRules);
            const regRulesString = JSON.stringify(regFormRules);
            test.info().attach("info", {
                  body: JSON.stringify({
                        Brand: land.Brand,
                        Country: land.GEO,
                        Type: land.Type,
                        Action: land.Action,
                        URL: land["Affilka Landing URL"],
                        regForm: land.Regform,
                        regFormRules: regRulesString,
                  }),
            });

            const tap = new Tap(page);
            const form = new RegForm(page, regFormRules);
            // await page.addLocatorHandler(page.locator(".form-inner"), async () => {

            //       await page.locator(".retry-btn").click();
            // });
            await tryNavigate(page, land["Affilka Landing URL"]);
            await page.waitForTimeout(5000);
            await tap.tap();
            await tap.clickBonusButton();
            await form.fillForm(user);
            await form.login();
            await expect(page).toHaveURL(new RegExp(`${serverList[0].url}`), { timeout: 60000 * 2 });
      });


})