import { BrowserContextOptions } from "playwright";
import { expect, test } from "playwright/test";
import { Betting } from "../../app/components/betting.component";
import { RegForm } from "../../app/components/regForm.component";
import { getFormRules } from "../../app/helpers/getFormRules";
import { tryNavigate } from "../../app/helpers/tryNavigate";
import { Brand } from "../../app/types/form.interface";
import { brandsRules } from "../../testData/brandsFormRules";
import { landList } from "../../testData/landList.data";
import proxyList from "../../testData/proxyList.json";
import { serverList } from "../../testData/serverList";
import { user } from "../../testData/user";

const BETTING = landList.filter((land) => land.Action.includes("Betting"));
//TODO: TR Excluded!!!
const BETTING_LAND = BETTING.filter((land) => land.Type === "Land");
for (const land of BETTING_LAND) {
      const proxyObject = proxyList.find((proxy) => proxy.region === land.GEO) || {
            region: "DE",
            server:
                  "http://geonode_Zr3aVjywHC-country-de:bebe29a2-c13b-4aa5-8c20-eb3dd10a8afd@premium-residential.geonode.com:9000",
            username: "geonode_Zr3aVjywHC-country-de",
            password: "bebe29a2-c13b-4aa5-8c20-eb3dd10a8afd",
      };
      const proxySettings: BrowserContextOptions = {
            proxy: {
                  server: proxyObject.server,
                  username: proxyObject.username,
                  password: proxyObject.password,
            },
      };

      test(
            `${land.Action},${land.GEO},${land.Regform}${land["Affilka Landing URL"]}`,
            {
                  tag: ["@betting", "@land", `@${land.GEO}`],
            },
            async ({ browser }) => {
                  const filteredBrandRules = brandsRules.find((brand) => brand.name === land.Brand) as Brand;
                  const regFormRules = getFormRules(land.Regform, filteredBrandRules);
                  const context = await browser.newContext(proxySettings);
                  const page = await context.newPage();
                  const form = new RegForm(page, regFormRules);
                  const betting = new Betting(page);
                  await tryNavigate(page, land["Affilka Landing URL"], 5);
                  await betting.clickMainButton();
                  await form.fillForm(user);
                  await form.submit();
                  //await page.waitForTimeout(5000);
                  console.log(land.Brand);
                  console.log(serverList.find((server) => server.brand == land.Brand)?.url);
                  await page.waitForURL(serverList.find((server) => server.brand === land.Brand)?.url as RegExp);
                  await expect(page).toHaveURL(
                        serverList.find((server) => server.brand === land.Brand)?.url as RegExp,
                        { timeout: 60000 }
                  );
                  await page.close()
                  await context.close();
            },
      );
}
