import { BrowserContextOptions } from "playwright";
import test, { expect } from "playwright/test";
import { RegForm } from "../../app/components/regForm.component";
import { Wheel } from "../../app/components/wheel.component";
import { getFormRules } from "../../app/helpers/getFormRules";
import { tryNavigate } from "../../app/helpers/tryNavigate";
import { Brand } from "../../app/types/form.interface";
import { brandsRules } from "../../testData/brandsFormRules";
import { landList } from "../../testData/landList.data";
import proxyList from "../../testData/proxyList.json";
import { serverList } from "../../testData/serverList";
const filteredLAndList = landList.filter((land) => land.GEO !== "TR");


const DE = filteredLAndList//.filter((land) => land.GEO === "DE");
const DETAP = DE.filter((land) => land.Action.includes("Wheel"));
const DE_TAP_LAND = DETAP.filter((land) => land.Type === "Preland");
console.log("DE_TAP_LAND", DE_TAP_LAND.length);
let i = 0;
for (const land of DE_TAP_LAND) {
	const proxyObject = proxyList.find((proxy) => proxy.region === land.GEO) || {
		"region": "DE",
		"server": "http://geonode_Zr3aVjywHC-country-de:bebe29a2-c13b-4aa5-8c20-eb3dd10a8afd@premium-residential.geonode.com:9000",
		"username": "geonode_Zr3aVjywHC-country-de",
		"password": "bebe29a2-c13b-4aa5-8c20-eb3dd10a8afd"
	};
	const proxySettings: BrowserContextOptions = {
		proxy: {
			server: proxyObject?.server as string,
			username: proxyObject?.username as string,
			password: proxyObject?.password as string,
		}
	};

	test(`${land["Affilka Landing URL"]}, `, async ({ browser }) => {
		console.log("land", land);
		console.log("proxyObject", proxyObject);
		console.log("proxySettings", proxySettings);
		const filteredBrandRules = brandsRules.find((brand) => brand.name == land.Brand) as Brand;
		const regFormRules = getFormRules(land.Regform, filteredBrandRules);
		const context = await browser.newContext(proxySettings);
		const page = await context.newPage();
		const wheel = new Wheel(page);
		const form = new RegForm(page, regFormRules);
		//await page.goto('https://google.com/');
		await tryNavigate(page, land["Affilka Landing URL"], 5);
		//await tryNavigate(page, land["Affilka Landing URL"]);
		await wheel.spinWheel();
		await wheel.claimBonus();
		await expect(page).toHaveURL(serverList.find((server) => server.brand === land.Brand)?.url as RegExp,
			{ timeout: 60000 });
		await context.close();
	});
	i++;
}


