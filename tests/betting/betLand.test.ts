import { BrowserContextOptions } from "playwright";
import { test } from "playwright/test";
import { Betting } from "../../app/components/betting.component";
import { RegForm } from "../../app/components/regForm.component";
//import { test } from "../../app/fixtures/exper.fixture";
import { getFormRules } from "../../app/helpers/getFormRules";
import { tryNavigate } from "../../app/helpers/tryNavigate";
import { Brand } from "../../app/types/form.interface";
import { brandsRules } from "../../testData/brandsFormRules";
import { landList } from "../../testData/landList.data";
import proxyList from "../../testData/proxyList.json";
import { user } from "../../testData/user";

const BETTING = landList.filter((land) => land.Action.includes("Betting"));
//TODO: TR Excluded!!!
const BETTING_LAND = BETTING.filter((land) => land.Type === "Land" && land.GEO !== "TR");
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
	test.describe(land.Action, () => {
		// test.beforeEach(async ({ browser }) => {
		// 	console.log(`Running test for ${land.Action}`);
		// 	const context = await browser.newContext(proxySettings);
		// 	await context.newPage();
		// }
		// );
		test(
			`${land.Action},${land.GEO},${land.Regform},${land["Affilka Landing URL"]}`,
			{
				tag: ["@betting", "@land", `@${land.GEO}`],
			},
			async ({ browser }, testInfo) => {
				const filteredBrandRules = brandsRules.find((brand) => brand.name === land.Brand) as Brand;
				const regFormRules = getFormRules(land.Regform, filteredBrandRules);
				const codeRule = () => land["Affilka Landing URL"].includes("code");
				regFormRules.promoCodeText = codeRule();
				const context = await browser.newContext(proxySettings);
				const page = await context.newPage();
				const form = new RegForm(page, regFormRules);
				const betting = new Betting(page);
				try {
					await tryNavigate(page, land["Affilka Landing URL"], 5);
					await betting.clickMainButton();
					await form.fillForm(user);
					// Add more test steps here
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
	});
}
