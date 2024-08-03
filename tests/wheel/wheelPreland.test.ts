import { test } from "@playwright/test";
import { landList } from "../../testData/landList.data";
import { brandsRules } from "../../testData/brandsFormRules";
import { getFormRules } from "../../app/helpers/getFormRules";
import { Brand } from "../../app/types/form.interface";
import { RegForm } from "../../app/components/regForm.component";
import { tryNavigate } from "../../app/helpers/tryNavigate";
import { user } from "../../testData/user";
import { Wheel } from "../../app/components/wheel.component";

const wheelLandsArr = landList.filter((land) => land.Action.includes("Wheel"));
const wheelPreland = wheelLandsArr.filter((land) => land.Type === "Preland");
let i = 0;
test.describe("Wheel Preland", () => {
	for (const land of wheelPreland) {
		test(`${(land.Action, land["Affilka Landing Name"], i)}`, async ({ page }, testInfo) => {
			if (testInfo.project.name !== land.GEO) {
				test.skip();
			}
			const filteredBrandRules = brandsRules.find((brand) => brand.name === land.Brand) as Brand;
			const formType = land.Regform;
			console.log("BrandName", land.Brand);
			const regFormRules = getFormRules(formType, filteredBrandRules);
			const regRulesString = JSON.stringify(regFormRules);
		await	test.info().attach("info", {
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
		await	test.info().attach("info", {
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
			const wheel = new Wheel(page);
			const form = new RegForm(page, regFormRules);
			await page.addLocatorHandler(page.locator(".error-inner"), async () => {
				await page.locator(".retry-btn").click({ delay: 1000 });
			});
			await tryNavigate(page, land["Affilka Landing URL"]);
			await wheel.spinWheel();
			await wheel.claimBonus();
			await form.fillForm(user);
			await form.submit();
		});
		i++;
	}
});
