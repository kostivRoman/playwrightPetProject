import { BrowserContextOptions } from "playwright";
import test, { expect } from "playwright/test";
import { Box } from "../../app/components/box.component";
import { tryNavigate } from "../../app/helpers/tryNavigate";
import landList from "../../testData/landList.data.json";
import proxyList from "../../testData/proxyList.json";
import { serverList } from "../../testData/serverList";

const CARDS = landList.filter((land) => land.Action === 'Boxes');
const CARDS_LAND = CARDS.filter((land) => land.Type == "Preland");
for (const land of CARDS_LAND) {
      const proxyObject = proxyList.find((proxy) => proxy.region == land.GEO) || {
            server:
                  "http://geonode_Zr3aVjywHC:bebe29a2-c13b-4aa5-8c20-eb3dd10a8afd@premium-residential.geonode.com:9000",
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
            async ({ browser }) => {
                  const expectedUrls = serverList.find((server) => server.brand == land.Brand)?.url as RegExp[];
                  const context = await browser.newContext(proxySettings);
                  const page = await context.newPage();
                  const box = new Box(page);
                  try {
                        await tryNavigate(page, land["Affilka Landing URL"], 3);
                        await box.spinBox();

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
            },
      );
}
