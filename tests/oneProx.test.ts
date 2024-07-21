import test from "@playwright/test";
import landList from "../testData/landList.json";

import proxyList from "../testData/proxyList.json";

for (const proxyItem of proxyList) {
	test.describe(() => {
		test.use({
			proxy: {
				server: proxyItem.server,
				username: proxyItem.username,
				password: proxyItem.password,
			},
		});
        let i = 0;
		//for (let i = 0; i < landList.length; i++) {
			const land = landList[i];
			test(`${proxyItem.region}${i}`, async ({ page }) => {
				await page.goto("https://www.google.com");
				await page.pause();
			});
		//}
	});
}
// test.describe(() => {
// 	test.use({
// 		proxy: {
// 			server:
// 				"http://geonode_Zr3aVjywHC-country-ru:bebe29a2-c13b-4aa5-8c20-eb3dd10a8afd@premium-residential.geonode.com:9000",
// 			username: "geonode_Zr3aVjywHC-country-ru",
// 			password: "bebe29a2-c13b-4aa5-8c20-eb3dd10a8afd",
// 		},
// 	});
// 	test("111", async ({ page }) => {
// 		await page.goto("https://www.google.com");
// 		await page.pause();
// 	});
// });
