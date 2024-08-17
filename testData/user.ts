import { randomUUID } from "crypto";
import { UserData } from "../app/components/regForm.component";

export const user: UserData = {
	email: `user${randomUUID()}@gmail.com`,
	password: `${randomUUID()}`,
	country: "Portugal",
	currency: "CAD",
	promoCode: "PROMO",
	name: "name",
	lastName: "lastName",
};
