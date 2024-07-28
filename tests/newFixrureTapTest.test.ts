
import { test } from '@playwright/test';
import { landList } from "../testData/landList.data";


const tapLandsArr = landList.filter((land) => land.Action.includes("Tap"));
const tapPreland = tapLandsArr.filter((land) => land.Type === "Land");
//console.log("tapPreland", tapPreland);
console.log("landList", tapPreland.filter((land) => land.GEO === "TR"));
const filtr = tapPreland.filter((land) => land.GEO === "RU");
let i = 0;
test.describe('Tap Preland', () => {
	for (const land of tapPreland) {
		// const filteredLandListByRegion = landList.filter((land) => land.GEO === process.env.PLAYWRIGHT_PROJECT_NAME);

		// test.skip('never run', async ({  },testInfo) => {
		//       landList[i].GEO!==testInfo.project.name
		// });
		//test.describe(() => {
		// test.skip(() => {
		// 	console.log("GEO3333", land.GEO);
		// 	return land.GEO == test.info().project.name;
		// });
		test(` ${land.GEO},${i}`, async ({ page }, testInfo) => {
console.log("taplength", filtr.length);
			console.log("testInfo", testInfo.project.name == land.GEO);
			//console.log("GEO", tapPreland);
			if (testInfo.project.name !== land.GEO) {
				//console.log("GEOinSkip", land.GEO);
				//console.log("testinSkip", test.info().title);
				test.skip();
				//return
			}
			//console.log("project name in fixture", testInfo.project.name);
		//	console.log("land", land['Affilka Landing Name']);
			//await page.goto(land["Affilka Landing URL"]);
			//await page.waitForLoadState('domcontentloaded');
			//await page.waitForTimeout(5000);
		});
		i++;
		//});
	}
});