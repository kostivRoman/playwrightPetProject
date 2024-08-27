import test, { expect } from "playwright/test";
import { RegForm } from "../../app/components/regForm.component";
import { Tap } from "../../app/components/tap.component";
import { getFormRules } from "../../app/helpers/getFormRules";
import { tryNavigate } from "../../app/helpers/tryNavigate";
import { Brand } from "../../app/types/form.interface";
import { brandsRules } from "../../testData/brandsFormRules";
import landList from "../../testData/landList.data.json";
import proxyList from "../../testData/proxyList.json";
import { serverList } from "../../testData/serverList";
import { user } from "../../testData/user";

const TAP = landList.filter((land) => land.Action.includes("Tap"));
const TAP_LAND = TAP.filter((land) => land.Type === "Land" && land.GEO);
for (const land of TAP_LAND) {
	const proxyObject = proxyList.find((proxy) => proxy.region == land.GEO) || {
		server:
			"http://geonode_Zr3aVjywHC:bebe29a2-c13b-4aa5-8c20-eb3dd10a8afd@premium-residential.geonode.com:9000",
		username: "geonode_Zr3aVjywHC",
		password: "bebe29a2-c13b-4aa5-8c20-eb3dd10a8afd",
	};

	test(
		`${land.Action},${land.GEO},${land["Affilka Landing URL"]}`,
		{
			tag: [`@${land.Action}`, `@${land.Type}`, `@${land.GEO}`, `@${land.Brand}`, `@${land.Regform}`],
		},
		async ({ browser }, testInfo) => {
			const filteredBrandRules = brandsRules.find((brand) => brand.name == land.Brand) as Brand;
			const codeRule = () => {
				return land["Affilka Landing URL"].includes("code");
			};
			const regFormRules = getFormRules(land.Regform, filteredBrandRules);
			regFormRules.promoCodeText = codeRule();
			const context = await browser.newContext({
				proxy: {
					server: proxyObject.server,
					username: proxyObject.username,
					password: proxyObject.password,
				},
				viewport: { width: 1280, height: 720 },
				//userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
				ignoreHTTPSErrors: true, // Skip SSL protocol errors
			});
			const page = await context.newPage();
			const response = await page.request.get('https://api.ipify.org?format=json');
			const currentIp = await (await response.json()).ip;
			const tap = new Tap(page);
			const form = new RegForm(page, regFormRules);
			testInfo.annotations.push({
				type: "regFormRules",
				description: JSON.stringify(regFormRules),
			},
				{
					type: "currentIp",
					description: currentIp,

				});
			try {
				await tryNavigate(page, land["Affilka Landing URL"], 3);
				await tap.tap();
				await tap.clickBonusButton();
				await form.fillForm(user);
				await form.submit();
				const expectedUrls = serverList.find((server) => server.brand == land.Brand)?.url as RegExp[];
				let urlMatched = false;

				for (const url of expectedUrls) {
					try {
						await expect(page).toHaveURL(url, { timeout: 60000 });
						//await expect(page).toHaveURL(url, { timeout: 60000 });
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
