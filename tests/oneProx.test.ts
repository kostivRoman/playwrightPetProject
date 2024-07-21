import test, { expect } from "@playwright/test";
import landList from "../testData/landList.json";

import proxyList from "../testData/proxyList.json";
import { Tap } from "../app/components/tap.component";
import { RegForm } from "../app/components/regForm.component";
import { UserRegistrationForm, Brand } from "../app/types/form.interface";
import { brandsRules } from "../testData/brandsFormRules";

for (const proxyItem of proxyList) {
	const filteredLandListByRegion = landList.filter((land) => land.GEO === proxyItem.region);
	test.describe(`${proxyItem.region}`, () => {
		test.use({
			proxy: {
				server: proxyItem.server,
				username: proxyItem.username,
				password: proxyItem.password,
			},
		});
		//let i = 0;
		const tapLandsArr = filteredLandListByRegion.filter((land) => land.Action.includes("Tap"));
		const tapPreland = tapLandsArr.filter((land) => land.Type === "Preland");

		//тап переленди
		for (let i = 0; i < tapPreland.length; i++) {
			const land = tapPreland[i];
			//const regFormRules:UserRegistrationForm=(brandsRules.filter((brand)=>brand.name===land.Brand)).s;
			// Всі преленди Типу тап
			test.describe(`Tap Preland`, () => {
				const currentBrand = brandsRules.filter((brand) => brand.name === land.Brand)[0];
				const shortFormRules = currentBrand.short;
				test(`${land["Affilka Landing Name"]}`, async ({ page }) => {
					//await page.goto("https://www.google.com");
					//const regFormRules:UserRegistrationForm=
					const tap = new Tap(page);
					const form = new RegForm(page, shortFormRules);
					await page.goto(land["Affilka Landing URL"]);
					await tap.tap();
					await tap.clickBonusButton();
					await expect(page).toHaveURL(new RegExp("^https://r7casino497.com"));
				});
			});
		}
	});
}
