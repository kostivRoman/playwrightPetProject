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

const BETTING = landList.filter((land) => land.Action.includes("Betting"));
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
		`${land.Action},${land.GEO},${land.Regform},${land["Affilka Landing URL"]}`,
		{
			tag: [`@${land.Action}`, `@${land.Brand}`, `@${land.GEO}`, `@${land.Regform}`, `@${land.Type}`],
		},
		async ({ browser }, testInfo) => {
			const filteredBrandRules = brandsRules.find((brand) => brand.name === land.Brand) as Brand;
			const regFormRules = getFormRules(land.Regform, filteredBrandRules);
			const codeRule = () => land["Affilka Landing URL"].includes("code");
			regFormRules.promoCodeText = codeRule();
			const context = await browser.newContext(proxySettings);
			const page = await context.newPage();
			const response = await page.request.get('https://api.ipify.org?format=json');
			const currentIp = await (await response.json()).ip;
			const form = new RegForm(page, regFormRules);
			const betting = new Betting(page);
			testInfo.annotations.push({
				type: "regFormRules",
				description: JSON.stringify(regFormRules),
			},
				{
					type: "currentIp",
					description: currentIp,

				});
			try {
				await tryNavigate(page, land["Affilka Landing URL"], 5);
				await betting.clickMainButton();
				await form.fillForm(user);
				await form.submit();
				await page.waitForTimeout(5000);
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
					throw new Error("None of the expected URLs matched the current URL.");
				}
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
}
