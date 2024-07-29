
import { test } from '@playwright/test';
import { landList } from "../../testData/landList.data";
import { brandsRules } from "../../testData/brandsFormRules";
import { getFormRules } from '../../app/helpers/getFormRules';
import { Brand } from '../../app/types/form.interface';
import { Tap } from '../../app/components/tap.component';
import { RegForm } from '../../app/components/regForm.component';
import { tryNavigate } from '../../app/helpers/tryNavigate';
import { user } from '../../testData/user';

const tapLandsArr = landList.filter((land) => land.Action.includes("Tap"));
const tapPreland = tapLandsArr.filter((land) => land.Type === "Land");
let i = 0;
test.describe('Tap Land', () => {
	for (const land of tapPreland) {
		test(`${land.Action, land['Affilka Landing Name'], i}`, async ({ page }, testInfo) => {
			if (testInfo.project.name !== land.GEO) {
				test.skip();
			}
			const filteredBrandRules = brandsRules.find((brand) => brand.name === land.Brand) as Brand;
			const formType = land.Regform;
			console.log("BrandName", land.Brand);
			let regFormRules = getFormRules(formType, filteredBrandRules);
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
			const form = new RegForm(page, regFormRules);
			await page.addLocatorHandler(page.locator('.error-inner'), async () => {
				await page.locator(".retry-btn").click({ delay: 1000 });
			});
			await tryNavigate(page, land["Affilka Landing URL"]);
			await tap.tap();
			await tap.clickBonusButton();
			await form.fillForm(user);
			await form.submit();
		});
		i++;
	}
});