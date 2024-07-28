// import test from "@playwright/test";
// import { RegForm } from "../../app/components/regForm.component";
// import { Tap } from "../../app/components/tap.component";
// import { tryNavigate } from "../../app/helpers/tryNavigate";
// import { brandsRules } from "../../testData/brandsFormRules";
// import landList from "../../testData/landList.data";

// const filteredLandListByRegion = landList.filter((land) => land.GEO === process.env.PLAYWRIGHT_PROJECT_NAME);
// const tapLandsArr = filteredLandListByRegion.filter((land) => land.Action.includes("Tap"));
// const tapPreland = tapLandsArr.filter((land) => land.Type === "Preland");
// const tapLand = tapLandsArr.filter((land) => land.Type === "Land");

// test.beforeEach(async ({ }, testInfo) => {
// 	const projectName = testInfo.project.name;
// 	process.env.PLAYWRIGHT_PROJECT_NAME = projectName;
// 	console.log(`Setting PLAYWRIGHT_PROJECT_NAME to ${projectName}`);

// });
// for (let i = 0; i < tapPreland.length; i++) {
// 	const land = tapPreland[i];
// 	const currentBrand = brandsRules.filter((brand) => brand.name === land.Brand)[0];
// 	const shortFormRules = currentBrand.short;
// 	test(`${land["Affilka Landing Name"]}`, { tag: ['@ru'] }, async ({ page }) => {
// 		console.log("Current env", process.env.PLAYWRIGHT_PROJECT_NAME)
// 		const tap = new Tap(page);
// 		const form = new RegForm(page, shortFormRules);
// 		await tryNavigate(page, land["Affilka Landing URL"]);
// 		// await tap.tap();
// 		// await tap.clickBonusButton();
// 		// await expect(page).toHaveURL(new RegExp("^https://r7casino497.com"));
// 	});
// 	// });
// }
// // for (let i = 0; i < tapLand.length; i++) {
// // 	const land = tapLand[i];
// // 	//const regFormRules:UserRegistrationForm=(brandsRules.filter((brand)=>brand.name===land.Brand)).s;
// // 	// Всі преленди Типу тап
// // 	test.describe(`Tap Land`, () => {
// // 		test(`${land["Affilka Landing Name"]} Tap Land${i},${land.GEO}`, async ({ page }) => {
// // 			const filteredBrandRules = brandsRules.find((brand) => brand.name === land.Brand) as Brand;
// // 			const formType = land.Regform;
// // 			const currentRedirect = serverList.find((server) => server.brand === land.Brand);
// // 			console.log("BrandName", land.Brand);
// // 			console.log("currentRedirect", currentRedirect);
// // 			let regFormRules = getFormRules(formType, filteredBrandRules);
// // 			const regRulesString = JSON.stringify(regFormRules);
// // 			test.info().attach("info", {
// // 				body: JSON.stringify({
// // 					Brand: land.Brand,
// // 					Country: land.GEO,
// // 					Type: land.Type,
// // 					Action: land.Action,
// // 					URL: land["Affilka Landing URL"],
// // 					regForm: land.Regform,
// // 					regFormRules: regRulesString,
// // 				}),
// // 			});

// // 			const tap = new Tap(page);
// // 			const form = new RegForm(page, regFormRules);

// // 			//await page.goto("https://www.google.com");
// // 			await tryNavigate(page, land["Affilka Landing URL"]);
			
// // 			await tap.tap();
// // 			await tap.clickBonusButton();
// // 			//	await page.waitForTimeout(5000);
// // 			await page.addLocatorHandler(page.locator('.error-inner'), async () => {
// // 				await page.locator(".retry-btn").click({ delay: 1000 });
// // 			});
// // 			await form.fillForm(user);
// // 			//await page.pause();
// // 			await form.submit();
// // 			await expect(page).toHaveURL((currentRedirect!.url), { timeout: 60000 * 2 });
// // 		});
// // 	});
// // }
// 	//});
// //}
