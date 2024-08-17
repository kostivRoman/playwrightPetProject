import { BrowserContextOptions } from "playwright";
import test, { expect } from "playwright/test";
import { Wheel } from "../../app/components/wheel.component";
import { getFormRules } from "../../app/helpers/getFormRules";
import { tryNavigate } from "../../app/helpers/tryNavigate";
import { Brand } from "../../app/types/form.interface";
import { brandsRules } from "../../testData/brandsFormRules";
import { landList } from "../../testData/landList.data";
import proxyList from "../../testData/proxyList.json";
import { serverList } from "../../testData/serverList";

const WHEEL = landList.filter((land) => land.Action.includes("Wheel"));
const WHEEL_PRELAND = WHEEL.filter((land) => land.Type === "Preland");
// console.log("DE_TAP_LAND", DE_TAP_LAND.length);
// let i = 0;
for (const land of WHEEL_PRELAND) {
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
		`${land.Action} ${land.GEO} ${land["Affilka Landing URL"]}`,
		{
			tag: ["@wheel", "@preland", `@${land.GEO}`],
		},
		async ({ browser }) => {
			const filteredBrandRules = brandsRules.find((brand) => brand.name == land.Brand) as Brand;
			const regFormRules = getFormRules(land.Regform, filteredBrandRules);
			const context = await browser.newContext(proxySettings);
			const page = await context.newPage();
			const wheel = new Wheel(page);
			//await page.goto('https://google.com/');
			await tryNavigate(page, land["Affilka Landing URL"], 5);
			//await tryNavigate(page, land["Affilka Landing URL"]);
			await wheel.spinWheel();
			await wheel.claimBonus();
			const expectedUrls = serverList.find((server) => server.brand == land.Brand)?.url as RegExp[];
			let urlMatched = false;

			for (const url of expectedUrls) {
				try {
					await expect(page).toHaveURL(url, { timeout: 60000 });
					console.log(`URL matched: ${url}`);
					urlMatched = true;
					break;
				} catch (error) {
					//console.log(`URL did not match: ${url}`);
				}
			}

			if (!urlMatched) {
				throw new Error("None of the expected URLs matched the current URL.");
			}
			await context.close();
			await page.close();
		},
	);
}
