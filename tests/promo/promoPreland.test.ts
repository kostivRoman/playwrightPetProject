import { BrowserContextOptions } from "playwright";
import test, { expect } from "playwright/test";
import { RegForm } from "../../app/components/regForm.component";
import { Scratch } from "../../app/components/scratch.component";
import { getFormRules } from "../../app/helpers/getFormRules";
import { tryNavigate } from "../../app/helpers/tryNavigate";
import { Brand } from "../../app/types/form.interface";
import { brandsRules } from "../../testData/brandsFormRules";
import landList from "../../testData/landList.data.json";
import proxyList from "../../testData/proxyList.json";
import { serverList } from "../../testData/serverList";
import { user } from "../../testData/user";
import { getCurrentIpAddress } from "../../app/helpers/getIp";

const FAKE = landList.filter((land) => land.Action === "Promo");
const FAKE_LAND = FAKE.filter((land) => land.Type === "Preland");
for (const land of FAKE_LAND) {
	const proxyObject = proxyList.find((proxy) => proxy.region === land.GEO) || {
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
		`${land.Action},${land.GEO},${land.RegForm},${land.affilkaLandingUrl}`,
		{
			tag: [`@${land.Action}`, `@${land.Brand}`, `@${land.GEO}`, `@${land.RegForm}`, `@${land.Type}`],
		},
		async ({ browser }, testInfo) => {
			test.skip(!!land.disabled);
			const filteredBrandRules = brandsRules.find((brand) => brand.name === land.Brand) as Brand;
			const regFormRules = getFormRules(land.RegForm, filteredBrandRules);
			const context = await browser.newContext(proxySettings);
			const page = await context.newPage();
			// Get current IP address
			try {
				const currentIp = await getCurrentIpAddress(page);
				console.log("Current IP address:", currentIp);
				testInfo.annotations.push(
					{
						type: "regFormRules",
						description: JSON.stringify(regFormRules),
					},
					{
						type: "currentIp",
						description: currentIp,
					},
				);
			} catch (error) {
				console.error(`Failed to get current IP address: ${(error as Error).message}`);
			}

			const promo = new Scratch(page);
			//const form = new RegForm(page, regFormRules);
			try {
				await tryNavigate(page, land.affilkaLandingUrl, 3);
				await page.waitForTimeout(3000);
				if(land.affilkaLandingUrl.includes('322')||
				land.affilkaLandingUrl.includes('823')||
				land.affilkaLandingUrl.includes('988')){
					await promo.claimBonus();
				}
				else{

				await promo.claimBonus();
				await page.waitForTimeout(8000);
				await promo.claimBonus2();
				//await form.fillForm(user);
			}

				//await form.submit();
				const expectedUrls = serverList.find((server) => server.brand === land.Brand)?.url as RegExp[];
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
				//eslint-disable-next-line
				console.error(`Test failed: ${(error as Error).message}`);
				throw error; // Re-throw the error to mark the test as failed
			} finally {
				// Ensure the page and context are closed
				await page.close();
				await context.close();
			}
		},
	);
}
