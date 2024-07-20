import test from "@playwright/test";

var axios = require("axios");
var username = "geonode_Zr3aVjywHC-country-ru";
var password = "bebe29a2-c13b-4aa5-8c20-eb3dd10a8afd";
var GEONODE_DNS = "premium-residential.geonode.com";
var GEONODE_PORT = 10000;

// axios
// 	.get("http://ip-api.com", {
// 		proxy: {
// 			protocol: "http",
// 			host: GEONODE_DNS,
// 			port: GEONODE_PORT,
// 			auth: {
// 				username,
// 				password,
// 			},
// 		},
// 	})
// 	.then((res: { data: any; }) => {
// 		console.log(res.data);
// 	})
// 	.catch((err: any) => console.error(err));
test("111", async ({page}) => {
	
        await page.goto("https://www.google.com");
});
