import { Brand, UserRegistrationForm } from "../types/form.interface";

export function getFormRules(formType: string, filteredBrandRules: Brand) {
	let regFormRules = undefined; // Initialize with a default value
	if (formType === "Long") {
		regFormRules = filteredBrandRules.long;
	} else if (formType === "Short") {
		regFormRules = filteredBrandRules.short;
	}
	return regFormRules as UserRegistrationForm;
}
