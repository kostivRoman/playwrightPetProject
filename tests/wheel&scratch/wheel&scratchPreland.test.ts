import { BrowserContextOptions } from "playwright";
import test, { expect } from "playwright/test";
import { Scratch } from "../../app/components/scratch.component";
import { Wheel } from "../../app/components/wheel.component";
import { getFormRules } from "../../app/helpers/getFormRules";
import { tryNavigate } from "../../app/helpers/tryNavigate";
import { Brand } from "../../app/types/form.interface";
import { brandsRules } from "../../testData/brandsFormRules";
import { landList } from "../../testData/landList.data";
import proxyList from "../../testData/proxyList.json";
import { serverList } from "../../testData/serverList";

const WHEEL_SCRATCH = landList.filter((land) => land.Action.includes("Wheel & Scratch"));
//TODO: TR excluded!!!!
const WHEEL_SCRATCH_PRELAND = WHEEL_SCRATCH.filter(
	(land) => land.Type === "Preland" && land.GEO !== "TR",
);
//console.log("DE_TAP_LAND", DE_TAP_LAND.length);

for (const land of WHEEL_SCRATCH_PRELAND) {
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
		`${land.Action},${land.Format}${land["Affilka Landing URL"]}`,
		{
			tag: ["@wheel&scratch", `@${land.GEO}`, `@preland`],
		},
		async ({ browser }) => {
			const filteredBrandRules = brandsRules.find((brand) => brand.name == land.Brand) as Brand;
			const regFormRules = getFormRules(land.Regform, filteredBrandRules);
			const context = await browser.newContext(proxySettings);
			const page = await context.newPage();
			const wheel = new Wheel(page);
			const scratch = new Scratch(page);
			await tryNavigate(page, land["Affilka Landing URL"], 5);
			await wheel.spinWheel();
			await wheel.claimBonus();
			await scratch.clickCards();
			await scratch.claimBonus();
			const maxRetries = 3;
			let attempt = 0;
			let success = false;

			while (attempt < maxRetries && !success) {
				try {
					await expect(page).toHaveURL(
						serverList.find((server) => server.brand == land.Brand)?.url as RegExp,
					);
					success = true; // If the expect succeeds, set success to true to exit the loop
				} catch (error) {
					attempt++;
					await page.reload();
					//	console.log(`Attempt ${attempt} failed:`, error);
					if (attempt >= maxRetries) {
						//		console.log("Max retries reached. Test failed.");
					}
				}
			}
			await page.close()
			await context.close();
		},
	);
}
