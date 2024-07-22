import test, { expect, Page } from "playwright/test";
import { RegForm, UserData } from "../app/components/regForm.component";
import { Tap } from "../app/components/tap.component";
import { UserRegistrationForm, Brand } from "../app/types/form.interface";
import { brandsRules } from "../testData/brandsFormRules";
import { randomUUID } from "crypto";
import { get } from "http";
// 

async function tryNavigate(page: Page, url: string, maxRetries = 5) {
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                  //await page.goto('');
                  await page.waitForTimeout(3000);
                  await page.goto(url);
                  return; // If successful, return without throwing an error
            } catch (error) {
                  console.error(`Attempt ${attempt} failed: ${(error as Error)?.message}`);
                  // Properly wait for a second before retrying
                  await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
                  if (attempt === maxRetries) {
                        throw error; // Rethrow the last error if all retries fail
                  }
            }
      }
}
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
 function getFormRules(formType: string, filteredBrandRules: Brand) {
      let regFormRules = undefined; // Initialize with a default value
      if (formType === 'Long') {
            regFormRules = filteredBrandRules?.long;
      } else if (formType === 'Short') {
            regFormRules = filteredBrandRules?.short;
      }
      // console.log("formType", formType);
      // //const regFormRules = regFormRules1?.long:
      // console.log("regFormRules", regFormRules);


      return regFormRules as UserRegistrationForm;
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
            await tryNavigate(page, land["Affilka Landing URL"]);
            await tap.tap();
            await tap.clickBonusButton();
            await form.fillForm(user);
            await form.login();
            await page.waitForURL(new RegExp("^https://alevcasino592.com/"));
      });


})