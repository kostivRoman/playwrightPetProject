import { BrowserContextOptions } from "playwright";
import test, { expect } from "playwright/test";
import { RegForm } from "../../app/components/regForm.component";
import { Scratch } from "../../app/components/scratch.component";
import { Wheel } from "../../app/components/wheel.component";
import { getFormRules } from "../../app/helpers/getFormRules";
import { tryNavigate } from "../../app/helpers/tryNavigate";
import { Brand } from "../../app/types/form.interface";
import { brandsRules } from "../../testData/brandsFormRules";
import { landList } from "../../testData/landList.data";
import proxyList from "../../testData/proxyList.json";
import { serverList } from "../../testData/serverList";
import { user } from "../../testData/user";

const WHEEL_SCRATCH = landList.filter((land) => land.Action.includes("Wheel & Scratch"));
//TODO: TR excluded!!!!
const WHEEL_SCRATCH_LAND = WHEEL_SCRATCH.filter(
	(land) => land.Type === "Land" && land.GEO !== "TR",
);

for (const land of WHEEL_SCRATCH_LAND) {
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
		`${land.Action},${land.GEO},${land["Affilka Landing URL"]}`,
		{
			tag: ["@wheel&scratch", "@land", `@${land.GEO}`],
		},
		async ({ browser }) => {
			const filteredBrandRules = brandsRules.find((brand) => brand.name == land.Brand) as Brand;
			const regFormRules = getFormRules(land.Regform, filteredBrandRules);
			const context = await browser.newContext(proxySettings);
			const page = await context.newPage();
			const wheel = new Wheel(page);
			const scratch = new Scratch(page);
			const form = new RegForm(page, regFormRules);
			try {
				await tryNavigate(page, land["Affilka Landing URL"], 5);
				await wheel.spinWheel();
				try {
					await wheel.claimBonus();
					// eslint-disable-next-line no-empty
				} catch (error) { }
				await scratch.clickCards();
				await scratch.claimBonus();
				await page.waitForTimeout(2000);
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
						//console.log(`URL did not match: ${url}`);
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
