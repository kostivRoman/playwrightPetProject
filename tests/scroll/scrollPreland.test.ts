import { BrowserContextOptions } from "playwright";
import test, { expect } from "playwright/test";
import { RegForm } from "../../app/components/regForm.component";
import { getFormRules } from "../../app/helpers/getFormRules";
import { tryNavigate } from "../../app/helpers/tryNavigate";
import { Brand } from "../../app/types/form.interface";
import { brandsRules } from "../../testData/brandsFormRules";
import landList from "../../testData/landList.data.json";
import proxyList from "../../testData/proxyList.json";
import { serverList } from "../../testData/serverList";
import { user } from "../../testData/user";

const FAKE = landList.filter((land) => land.Action === "Scroll");
const FAKE_LAND = FAKE.filter((land) => land.Type === "Preland");
for (const land of FAKE_LAND) {
      const proxyObject = proxyList.find((proxy) => proxy.region == land.GEO) || {
            server:
                  "http://geonode_Zr3aVjywHC:bebe29a2-c13b-4aa5-8c20-eb3dd10a8afd@premium-residential.geonode.com:9001",
            username: "geonode_Zr3aVjywHC",
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
            `${land.Action},${land.GEO},${land.Regform},${land["Affilka Landing URL"]}`,
            {
                  tag: [`@${land.Action}`, `@${land.Brand}`, `@${land.GEO}`, `@${land.Regform}`, `@${land.Type}`],
            },
            async ({ browser }, testInfo) => {
                  const filteredBrandRules = brandsRules.find((brand) => brand.name == land.Brand) as Brand;
                  const regFormRules = getFormRules(land.Regform, filteredBrandRules);
                  const context = await browser.newContext(proxySettings);
                  const page = await context.newPage();
                  // Get current IP address
                  const response = await page.request.get('https://api.ipify.org?format=json');
                  const currentIp = await (await response.json()).ip;
                  console.log('Current IP address:', currentIp);
                  //console.log('reg', await regFormRules);
                  testInfo.annotations.push({
                        type: "regFormRules",
                        description: JSON.stringify(regFormRules),
                  },
                        {
                              type: "currentIp",
                              description: currentIp,

                        });
                  const form = new RegForm(page, regFormRules);
                  try {
                        await tryNavigate(page, land["Affilka Landing URL"], 3);
                        await form.fillForm(user);
                        await form.submit();
                        const expectedUrls = serverList.find((server) => server.brand == land.Brand)?.url as RegExp[];
                        let urlMatched = false;

                        for (const url of expectedUrls) {
                              try {
                                    await expect(page).toHaveURL(url, { timeout: 60000 });
                                    console.log(`URL matched: ${url}`);
                                    urlMatched = true;
                                    break;
                              } catch (error) {
                                    console.log(`URL did not match: ${url}`);
                              }
                        }

                        if (!urlMatched) {
                              console.log(`Expected URLs: ${page.url()}`);
                              throw new Error("None of the expected URLs matched the current URL.");
                        }
                  } catch (error) {
                        //@ts-ignore
                        console.error(`Test failed: ${error.message}`);
                        throw error; // Re-throw the error to mark the test as failed
                  } finally {
                        // Ensure the page and context are closed
                        await page.close();
                        await context.close();
                  }
            });
}
