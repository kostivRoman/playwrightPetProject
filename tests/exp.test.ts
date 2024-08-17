// import test, { BrowserContextOptions, expect } from "playwright/test";
// import { Wheel } from "../app/components/wheel.component";
// import { tryNavigate } from "../app/helpers/tryNavigate";
// import { Brand } from "../app/types/form.interface";
// import { brandsRules } from "../testData/brandsFormRules";
// import { landList } from "../testData/landList.data";
// import { serverList } from "../testData/serverList";

// const WHEEL = landList.filter((land) => land.Action.includes("Wheel"));
// const WHEEL_PRELAND = WHEEL.filter((land) => land.Type === "Preland");
// // console.log("DE_TAP_LAND", DE_TAP_LAND.length);
// // let i = 0;
// for (const land of WHEEL_PRELAND) {
//       const proxyObject =
//       {
//             region: "DE",
//             server:
//                   "http://geonode_Zr3aVjywHC:bebe29a2-c13b-4aa5-8c20-eb3dd10a8afd@premium-residential.geonode.com:9001",
//             username: "geonode_Zr3aVjywHC",
//             password: "bebe29a2-c13b-4aa5-8c20-eb3dd10a8afd",
//       };
//       const proxySettings: BrowserContextOptions = {
//             proxy: {
//                   server: proxyObject.server,
//                   username: proxyObject.username,
//                   password: proxyObject.password,
//             }
//       };
//       test(
//             `${land.Action} ${land.GEO} ${land["Affilka Landing URL"]}`,
//             {
//                   tag: ["@wheel", "@preland", `@${land.GEO}`],
//             },
//             async ({ browser }) => {
//                   const filteredBrandRules = brandsRules.find((brand) => brand.name == land.Brand) as Brand;

//                   const context = await browser.newContext(proxySettings);
//                   const page = await context.newPage();
//                   console.log("PROXY", proxyObject.server);

//                   const wheel = new Wheel(page);
//                   await tryNavigate(page, land["Affilka Landing URL"]);
//                   await wheel.spinWheel();
//                   //await page.waitForTimeout(100000);
//                   await wheel.claimBonus();
//                   await expect
//                         .soft(page)
//                         .toHaveURL(serverList.find((server) => server.brand === land.Brand)?.url as RegExp, {
//                               timeout: 40000,
//                         });
//                   await context.close();
//                   await page.close();
//             },
//       );
// }
