import { BrowserContextOptions } from "playwright";
import { expect, test } from "playwright/test";
import { Betting } from "../../app/components/betting.component";
import { RegForm } from "../../app/components/regForm.component";
import { getFormRules } from "../../app/helpers/getFormRules";
import { tryNavigate } from "../../app/helpers/tryNavigate";
import { Brand } from "../../app/types/form.interface";
import { brandsRules } from "../../testData/brandsFormRules";
import landList from "../../testData/landList.data.json";
import proxyList from "../../testData/proxyList.json";
import { serverList } from "../../testData/serverList";
import { user } from "../../testData/user";
import { getCurrentIpAddress } from "../../app/helpers/getIp";

const BETTING = landList
	.filter((land) => !land.disabled)
	.filter((land) => land.Action === "Betting");
const BETTING_LAND = BETTING.filter((land) => land.Type === "Land" && land.GEO);
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
		`${land.Action},${land.GEO},${land.RegForm},${land.affilkaLandingUrl}`,
		{
			tag: [`@${land.Action}`, `@${land.Brand}`, `@${land.GEO}`, `@${land.RegForm}`, `@${land.Type}`],
		},
		async ({ browser }, testInfo) => {
			test.skip(!!land.disabled);
			const filteredBrandRules = brandsRules.find((brand) => brand.name === land.Brand) as Brand;
			const regFormRules = getFormRules(land.RegForm, filteredBrandRules);
			const codeRule = () => land.affilkaLandingUrl.includes("code");
			regFormRules.promoCodeText = codeRule();
			const context = await browser.newContext({
				proxy: proxySettings.proxy,
				viewport: { width: 1280, height: 720 },
				ignoreHTTPSErrors: true, // Skip SSL protocol errors
			});
			const page = await context.newPage();
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

			const form = new RegForm(page, regFormRules);
			const betting = new Betting(page);

			try {
				await tryNavigate(page, land.affilkaLandingUrl, 5);
				await betting.clickMainButton();
				await form.fillForm(user);
				await form.submit();
				await page.waitForTimeout(5000);
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
					throw new Error("None of the expected URLs matched the current URL.");
				}
				//eslint-disable-next-line
			} catch (error) {
				//eslint-disable-next-line
				throw error; // Re-throw the error to mark the test as failed
			} finally {
				// Ensure the page and context are closed
				await page.close();
				await context.close();
			}
		},
	);
}
