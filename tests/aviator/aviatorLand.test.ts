import { BrowserContextOptions } from "playwright";
import test, { expect } from "playwright/test";
import { Aviator } from "../../app/components/aviator.component";
import { RegForm } from "../../app/components/regForm.component";
import { getFormRules } from "../../app/helpers/getFormRules";
import { tryNavigate } from "../../app/helpers/tryNavigate";
import { Brand } from "../../app/types/form.interface";
import { brandsRules } from "../../testData/brandsFormRules";
import landList from "../../testData/landList.data.json";
import proxyList from "../../testData/proxyList.json";
import { serverList } from "../../testData/serverList";
import { user } from "../../testData/user";

const AVIATOR = landList.filter((land) => land.Action === "Aviator");
const AVIATOR_LAND = AVIATOR.filter((land) => land.Type == "Land");
//console.log("DE_TAP_LAND", AVIATOR_LAND.length);

for (const land of AVIATOR_LAND) {
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
		async ({ browser }, testInfo) => {
			const codeRule = () => {
				return land["Affilka Landing URL"].includes("code");
			};
			const filteredBrandRules = brandsRules.find((brand) => brand.name == land.Brand) as Brand;
			const regFormRules = getFormRules(land.Regform, filteredBrandRules);
			const context = await browser.newContext({
				proxy: proxySettings.proxy,
				viewport: { width: 1280, height: 720 },
				userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
				ignoreHTTPSErrors: true, // Skip SSL protocol errors
			});
			regFormRules.promoCodeText = codeRule()
			const page = await context.newPage();
			const form = new RegForm(page, regFormRules);
			const aviator = new Aviator(page);
			const response = await page.request.get('https://api.ipify.org?format=json');
			const currentIp = await (await response.json()).ip;
			testInfo.annotations.push({
				type: "regFormRules",
				description: JSON.stringify(regFormRules)
			},
				{
					type: "currentIp",
					description: currentIp,

				},
			);

			// await page.addLocatorHandler(page.locator(".form-inner.error-inner"), async () => {
			// 	await page.locator("retry-btn").click();
			// });
			try {
				await tryNavigate(page, land["Affilka Landing URL"], 5);
				await aviator.clickWinButton();
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
