import { BrowserContextOptions } from "playwright";
import test, { expect } from "playwright/test";
import { Aviator } from "../../app/components/aviator.component";
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

const AVIATOR = landList.filter((land) => land.Action.includes("Aviator"));
//TODO: TR excluded!!!
const AVIATOR_LAND = AVIATOR.filter((land) => land.Type == "Land" && land.GEO !== "TR");
//console.log("DE_TAP_LAND", DE_TAP_LAND.length);

for (const land of AVIATOR_LAND) {
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
		`${land.Action},${land.GEO},${land["Affilka Landing URL"]}`,
		{
			tag: ["@aviator", "@land", `@${land.GEO}`],
		},
		async ({ browser }) => {
			const filteredBrandRules = brandsRules.find((brand) => brand.name == land.Brand) as Brand;
			const regFormRules = getFormRules(land.Regform, filteredBrandRules);
			const context = await browser.newContext(proxySettings);
			const page = await context.newPage();
			const wheel = new Wheel(page);
			const scratch = new Scratch(page);
			const form = new RegForm(page, regFormRules);
			const aviator = new Aviator(page);
			await page.addLocatorHandler(page.locator(".form-inner.error-inner"), async () => {
				await page.locator('retry-btn').click();
			  });
			await tryNavigate(page, land["Affilka Landing URL"], 5);
			await aviator.clickMainButton();
			// await wheel.spinWheel();
			// try {
			// 	await wheel.claimBonus();
			// 	// eslint-disable-next-line no-empty
			// } catch (error) { }
			// await scratch.clickCards();
			// await scratch.claimBonus();
			await page.waitForTimeout(2000);
			await form.fillForm(user);
			await form.submit();
			const maxRetries = 3;
			let attempt = 0;
			let success = false;

			while (attempt < maxRetries && !success) {
				try {
					await page.waitForTimeout(2000);
					await expect(page).toHaveURL(
						serverList.find((server) => server.brand == land.Brand)?.url as RegExp,
						{ timeout: 60000 },
					);

					success = true; // If the expect succeeds, set success to true to exit the loop
				} catch (error) {
					attempt++;
					await page.reload();
				//	console.log(`Attempt ${attempt} failed:`, error);
					if (attempt >= maxRetries) {
						throw new Error("Max retries reached. Test failed.");
					}
				}
			}
			await context.close();
		},
	);
}
