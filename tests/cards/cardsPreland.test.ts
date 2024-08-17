import { BrowserContextOptions } from "playwright";
import test, { expect } from "playwright/test";
//import { Tap } from "../../app/components/tap.component";
import { getFormRules } from "../../app/helpers/getFormRules";
import { tryNavigate } from "../../app/helpers/tryNavigate";
import { Brand } from "../../app/types/form.interface";
import { brandsRules } from "../../testData/brandsFormRules";
import { landList } from "../../testData/landList.data";
import proxyList from "../../testData/proxyList.json";
import { serverList } from "../../testData/serverList";
//import { user } from "../../testData/user";
import { Cards } from "../../app/components/card.component";

const CARDS = landList.filter((land) => land.Action.includes("Cards"));
const CARDS_LAND = CARDS.filter((land) => land.Type == "Preland");
for (const land of CARDS_LAND) {
	const proxyObject = proxyList.find((proxy) => proxy.region == land.GEO) || {
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
		`${land.Action}, ${land.GEO},${land["Affilka Landing URL"]}`,
		{
			tag: ["@cards", "@preland", `@${land.GEO}`],
		},
		async ({ browser }) => {
			const filteredBrandRules = brandsRules.find((brand) => brand.name == land.Brand) as Brand;
			const regFormRules = getFormRules(land.Regform, filteredBrandRules);
			const context = await browser.newContext(proxySettings);
			const page = await context.newPage();
			const cards = new Cards(page);
			await tryNavigate(page, land["Affilka Landing URL"], 3);
			await page.waitForTimeout(5000);
			await cards.expectLoaded();
			await cards.clickCards();
			const maxRetries = 3;
			let attempt = 0;
			let success = false;
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
			await page.close();
			await context.close();
		},
	);
}
