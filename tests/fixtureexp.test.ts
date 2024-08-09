import { BrowserContextOptions } from "playwright";
import test, { expect } from "playwright/test";
import { RegForm } from "../app/components/regForm.component";
import { Tap } from "../app/components/tap.component";
import { getFormRules } from "../app/helpers/getFormRules";
import { tryNavigate } from "../app/helpers/tryNavigate";
import { Brand } from "../app/types/form.interface";
import { brandsRules } from "../testData/brandsFormRules";
import { serverList } from "../testData/serverList";
import { user } from "../testData/user";
import { landList } from "../testData/landList.data";

const TAP = landList.filter((land) => land.Action.includes("Tap"));
const TAP_LAND = TAP.filter((land) => land.Type === "Land" && land.GEO !== "TR");
for (const land of TAP_LAND) {
	const proxyObject = {
		region: "DE",
		server:
			"http://premium-residential.geonode.com:9000",
		username: "geonode_Zr3aVjywHC-country-tr",
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
			tag: ["@tap", "@land", `@${land.GEO}`],
		},
		async ({ browser }) => {
			const filteredBrandRules = brandsRules.find((brand) => brand.name == land.Brand) as Brand;
			const regFormRules = getFormRules(land.Regform, filteredBrandRules);
			const context = await browser.newContext(proxySettings);
			const page = await context.newPage();
			const tap = new Tap(page);
			const form = new RegForm(page, regFormRules);
			await tryNavigate(page, "http://ip-api.com", 3);
            //await page.goto(land["Affilka Landing URL"]);
			await page.waitForTimeout(3000);
			await tap.tap();
			await tap.clickBonusButton();
			await form.fillForm(user);
			await form.submit();
			await expect(page).toHaveURL(
				serverList.find((server) => server.brand === land.Brand)?.url as RegExp,
				{ timeout: 60000 },
			);
			await page.close();
			await context.close();
		},
	);
}
// import { test } from '@playwright/test';
// import { Landing, landList } from '../testData/landList.data';

// import { mergeTests } from '@playwright/test';
// import { tapLandFixtureExp } from '../app/fixtures/exper.fixture';

// export const tests = mergeTests(tapLandFixtureExp, test);
// import tapLandListArray from '../app/fixtures/tapLandList.json';
// //let tapLandListArray :any[]=[]

// //export const tests = mergeTests(tapLandFixture, test);

// tests.describe(() => {
//       // tests.beforeAll(async ({tapLandList}) => {
//       //       // Запуск першої фікстури
//       //       //tapLandListArray = tapLandList;
//       //       console.log('beforeAll');
//       //       //tapLandFixtureExp
//       // });
//       // let i=0;
//       for (const land of tapLandListArray) {
//             //@ts-ignore
//             tests(`${land['Affilka Landing Name']}`, async ({ page }) => {
//                   console.log('test');
//                   //console.log('tapLandList', tapLandList);
//                   //await page.goto(land["Affilka Landing URL"]);
//             });
//             //i++;
//       }

// });
