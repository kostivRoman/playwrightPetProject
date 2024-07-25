import { url } from "inspector";
import { brandsRules } from "./brandsFormRules";

export const serverList = [
      {
            brand: "ALEV",
            url:"^https:\/\/alevcasino\\d+\\.com"
      },
      {
            brand: "GAMA",
            url: "/^https:\/\/game\d+\.com\//"
            //https://game777win.com/
      },
      {
            brand: "DADDY",
            url: "^https:\/\/daddy.casino\\d+\\.com"
            //https://daddy.casino/
      },
      {
            brand: 'KENT',
            url: /kentcasino/
            //https://kentcasino667.com/
      }, {
            brand: 'R7',
            url: /^https:\/\/\w*casino\d+\.com/
      }
]