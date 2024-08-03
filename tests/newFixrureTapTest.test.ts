// import { landList } from "../testData/landList.data";

// const tapLandsArr = landList.filter((land) => land.Action.includes("Tap"));
// const tapPreland = tapLandsArr.filter((land) => land.Type === "Land");
// //console.log("tapPreland", tapPreland);
// console.log(
// 	"landList",
// 	tapPreland.filter((land) => land.GEO === "TR"),
// );
// const filtr = tapPreland.filter((land) => land.GEO === "RU");
// //let i = 0;
// // test.describe('Tap Preland', () => {
// // 	for (const land of tapPreland) {

// // 		test(` ${land.GEO},${i}`, async ({ page }, testInfo) => {
// // 			//console.log("taplength", filtr.length);
// // 			//console.log("testInfo", testInfo.project.name == land.GEO);
// // 			//console.log("GEO", tapPreland);
// // 			if (testInfo.project.name !== land.GEO) {
// // 				test.skip();
// // 			}

// // 			const filteredBrandRules = brandsRules.find((brand) => brand.name === land.Brand) as Brand;
// // 			const formType = land.Regform;
// // 			//const currentRedirect = serverList.find((server) => server.brand === land.Brand);
// // 			console.log("BrandName", land.Brand);
// // 			//	console.log("currentRedirect", currentRedirect);
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
// // 		});
// // 		i++;
// // 	}
// // });
