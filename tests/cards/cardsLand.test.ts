import { BrowserContextOptions } from "playwright";
import test, { expect } from "playwright/test";
import { RegForm } from "../../app/components/regForm.component";
import { Tap } from "../../app/components/tap.component";
import { getFormRules } from "../../app/helpers/getFormRules";
import { tryNavigate } from "../../app/helpers/tryNavigate";
import { Brand } from "../../app/types/form.interface";
import { brandsRules } from "../../testData/brandsFormRules";
import { landList } from "../../testData/landList.data";
import proxyList from "../../testData/proxyList.json";
import { serverList } from "../../testData/serverList";
import { user } from "../../testData/user";

const CARDS = landList.filter((land) => land.Action.includes("Cards"));
const CARDS_LAND = CARDS.filter((land) => land.Type == "Land");
for (const land of CARDS_LAND) {
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
		`${land.Action},${land.GEO},${land["Affilka Landing URL"]}`,
		{
			tag: ["@cards", "@land", `@${land.GEO}`],
		},
		async ({ browser }) => {
			const filteredBrandRules = brandsRules.find((brand) => brand.name == land.Brand) as Brand;
			const regFormRules = getFormRules(land.Regform, filteredBrandRules);
			const context = await browser.newContext(proxySettings);
			const page = await context.newPage();
			const tap = new Tap(page);
			const form = new RegForm(page, regFormRules);
			//await page.goto('https://google.com/');
			await tryNavigate(page, land["Affilka Landing URL"], 3);
			await form.fillForm(user);
			await form.submit();
			await expect(page).toHaveURL(
				serverList.find((server) => server.brand == land.Brand)?.url as RegExp,
				{ timeout: 60000 },
			);
			await page.close()
			await context.close();
		},
	);
}
