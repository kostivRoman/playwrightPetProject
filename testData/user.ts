import { randomUUID } from "crypto";
import { UserData } from "../app/components/regForm.component";

export const user: UserData = {
      email: `user${randomUUID()}@gmail.com`,
      password: `${randomUUID()}`,
      country: "Portugal",
      currency: "CAD",
      promoCode: "CAT",
      name: "name",
      lastName: "lastName"
};