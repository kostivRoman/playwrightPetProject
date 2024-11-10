import test, { expect } from "playwright/test";
import { RegForm } from "../../app/components/regForm.component";
import { Wheel } from "../../app/components/wheel.component";
import { getFormRules } from "../../app/helpers/getFormRules";
import { getCurrentIpAddress } from "../../app/helpers/getIp";
import { tryNavigate } from "../../app/helpers/tryNavigate";
import { Brand } from "../../app/types/form.interface";
import { brandsRules } from "../../testData/brandsFormRules";
import landList from "../../testData/landList.data.json";
import proxyList from "../../testData/proxyList.json";
import { serverList } from "../../testData/serverList";
import { user } from "../../testData/user";

const WHEEL = landList.filter((land) => land.Action === "Wheel");
const WHEEL_LAND = WHEEL.filter((land) => land.Type === "Land");
//console.log("DE_TAP_LAND", DE_TAP_LAND.length);

for (const land of WHEEL_LAND) {
	const proxyObject = proxyList.find((proxy) => proxy.region === land.GEO) || {
		server:
			"http://geonode_Zr3aVjywHC:bebe29a2-c13b-4aa5-8c20-eb3dd10a8afd@premium-residential.geonode.com:9001",
		username: "geonode_Zr3aVjywHC",
		password: "bebe29a2-c13b-4aa5-8c20-eb3dd10a8afd",
	};

	test(
		`${land.Action},${land.GEO},${land.RegForm},${land.affilkaLandingUrl}`,
		{
			tag: [`@${land.Action}`, `@${land.Brand}`, `@${land.GEO}`, `@${land.RegForm}`, `@${land.Type}`],
		},
		async ({ browser }) => {
			test.skip(!!land.disabled);
			const codeRule = () => {
				return land.affilkaLandingUrl.includes("code");
			};
			const filteredBrandRules = brandsRules.find((brand) => brand.name === land.Brand) as Brand;
			const regFormRules = getFormRules(land.RegForm, filteredBrandRules);
			//regFormRules.promoCodeText = codeRule();
			console.log("reg", regFormRules);
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
			try {
				const currentIp = await getCurrentIpAddress(page);
				console.log("Current IP address:", currentIp);
			} catch (error) {
				console.error(`Failed to get current IP address: ${(error as Error).message}`);
			}
			const wheel = new Wheel(page);
			const form = new RegForm(page, regFormRules);
			try {
				await tryNavigate(page, land.affilkaLandingUrl, 5);
				
			await page.waitForTimeout(300000);
				await wheel.spinWheel();
				const bonusLength = await wheel.getBonusLength();
				if (bonusLength > 1) {
					await page.getByRole("button", { name:"Получить бонус" }).click();
				}else{
					await wheel.claimBonus();
				}
				
				await page.waitForTimeout(3000);
				await form.fillForm(user);
				await form.submit();
				await page.waitForTimeout(10000);

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
