import test, { expect } from "@playwright/test";
import landList from "../testData/landList.json";

import proxyList from "../testData/proxyList.json";
import { Tap } from "../app/components/tap.component";
import { RegForm, UserData } from "../app/components/regForm.component";
import { UserRegistrationForm, Brand } from "../app/types/form.interface";
import { brandsRules } from "../testData/brandsFormRules";
import { randomUUID } from "crypto";


//@ts-ignore-next-line
async function tryNavigate(page, url, maxRetries = 3) {
	for (let attempt = 1; attempt <= maxRetries; attempt++) {
		try {
			//await page.goto('');
			await page.waitForTimeout(3000);
			await page.goto(url);
			return; // If successful, return without throwing an error
		} catch (error) {
			console.error(`Attempt ${attempt} failed: ${(error as Error)?.message}`);
			// Properly wait for a second before retrying
			await new Promise((resolve) => setTimeout(resolve, 1000*attempt));
			if (attempt === maxRetries) {
				throw error; // Rethrow the last error if all retries fail
			}
		}
	}
}
const user: UserData = {
	email: `user${randomUUID()}@gmail.com`,
	password: `${randomUUID()}`,
	country: "Portugal",
	currency: "CAT",
	promoCode: "CAT",
	name: "name",
};
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
		const tapLand = tapLandsArr.filter((land) => land.Type === "Land");

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
					await tryNavigate(page, land["Affilka Landing URL"]);
					await tap.tap();
					await tap.clickBonusButton();
					await expect(page).toHaveURL(new RegExp("^https://r7casino497.com"));
				});
			});
		}
		for (let i = 0; i < tapLand.length; i++) {
			const land = tapLand[i];
			//const regFormRules:UserRegistrationForm=(brandsRules.filter((brand)=>brand.name===land.Brand)).s;
			// Всі преленди Типу тап
			test.describe(`Tap Land`, () => {
				test(`${land["Affilka Landing Name"]} Tap Land${i}`, async ({ page, browser }) => {
					const currentBrand = brandsRules.filter((brand) => brand.name === land.Brand)[0];
					console.log("curBrand", currentBrand);
					console.log("type", land.Regform);
					console.log("for", land);
					const shortFormRules = currentBrand.short;
					const longFormRules = currentBrand.long;
					const regFormRules: UserRegistrationForm =
						currentBrand[land.Regform as keyof Brand] === "short" ? shortFormRules : longFormRules;
					const regRulesString = JSON.stringify(regFormRules);
					test.info().attach("info", {
						body: JSON.stringify({
							Brand: land.Brand,
							Country: land.GEO,
							Type: land.Type,
							Action: land.Action,
							URL: land["Affilka Landing URL"],
							regForm: land.Regform,
							regFormRules: regRulesString,
						}),
					});

					const tap = new Tap(page);
					const form = new RegForm(page, shortFormRules);
					await tryNavigate(page, land["Affilka Landing URL"]);
					await tap.tap();
					await tap.clickBonusButton();
					await form.fillForm(user);
					await form.login();
				});
			});
		}
	});
}
