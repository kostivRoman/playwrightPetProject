// import { BrowserContextOptions, expect, test } from "@playwright/test";
// import { RegForm } from "../app/components/regForm.component";
// import { Tap } from "../app/components/tap.component";
// import { getFormRules } from "../app/helpers/getFormRules";
// import { tryNavigate } from "../app/helpers/tryNavigate";
// import { Brand } from "../app/types/form.interface";
// import { brandsRules } from "../testData/brandsFormRules";
// import { landList } from "../testData/landList.data";
// import proxyList from "../testData/proxyList.json";
// import { serverList } from "../testData/serverList";
// import { user } from "../testData/user";
// let i = 0;

// const DE = landList.filter((land) => land.GEO === "DE");
// const DETAP = DE.filter((land) => land.Action.includes("Tap"));
// const DE_TAP_LAND = DETAP.filter((land) => land.Type === "Land");
// for (const land of DE_TAP_LAND) {
// 	const proxyObject = proxyList.find((proxy) => proxy.region === land.GEO) || {
// 		region: "DE",
// 		server:
// 			"http://geonode_Zr3aVjywHC-country-de:bebe29a2-c13b-4aa5-8c20-eb3dd10a8afd@premium-residential.geonode.com:9000",
// 		username: "geonode_Zr3aVjywHC-country-de",
// 		password: "bebe29a2-c13b-4aa5-8c20-eb3dd10a8afd",
// 	};
// 	const proxySettings: BrowserContextOptions = {
// 		proxy: {
// 			server: proxyObject.server,
// 			username: proxyObject.username,
// 			password: proxyObject.password,
// 		},
// 	};

// 	test(`${land["Affilka Landing URL"]}`, async ({ browser }) => {
// 		console.log("land", land);
// 		console.log("proxyObject", proxyObject);
// 		console.log("proxySettings", proxySettings);
// 		const filteredBrandRules = brandsRules.find((brand) => brand.name === land.Brand) as Brand;
// 		const regFormRules = getFormRules(land.Regform, filteredBrandRules);
// 		const context = await browser.newContext(proxySettings);
// 		const page = await context.newPage();
// 		const tap = new Tap(page);
// 		const form = new RegForm(page, regFormRules);
// 		//await page.goto('https://google.com/');
// 		await tryNavigate(page, land["Affilka Landing URL"], 5);
// 		await tap.tap();
// 		await tap.clickBonusButton();
// 		await form.fillForm(user);
// 		await form.submit();
// 		await page.pause();
// 		await expect(page).toHaveURL(
// 			serverList.find((server) => server.brand === land.Brand)?.url as RegExp,
// 			{ timeout: 60000 },
// 		);
// 		// Expect a title "to contain" a substring.
// 		//await expect(page).toHaveTitle(/Playwright/);
// 		// await page.close();
// 		await context.close();
// 		// await browser.close();
// 	});
// 	i++;
// }
