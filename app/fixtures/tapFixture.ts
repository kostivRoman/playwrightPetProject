import { test as base, TestInfo } from '@playwright/test';
import { Landing, landList } from '../../testData/landList.data';

// export type TestOptions = {

//       landListArray: Landing[];
//       //targetLand: Landing;
// };

// export const tapPreland = base.extend<TestOptions>({
//       landList: async ({ }, use, testInfo) => {
//             const filteredLandListByRegion = landList.filter((land) => land.GEO === process.env.PLAYWRIGHT_PROJECT_NAME);
//             const tapLandsArr = filteredLandListByRegion.filter((land) => land.Action.includes("Tap"));
//             const tapPreland = tapLandsArr.filter((land) => land.Type === "Preland");
//             //const tapLand = tapLandsArr.filter((land) => land.Type === "Land");
//             console.log("project name in fixture", testInfo.project.name);
//             console.log("filtered", tapPreland)// Log the project name
//             //await tryNavigate(page, land["Affilka Landing URL"]);
//             await use(tapPreland);
//             console.log("afterLanlist");
//       },
// targetLand: async ({landList}, use) => {
//       for (const land of landList) {
//             console.log("land", land['Affilka Landing Name']);
//             //await page.goto(land["Affilka Landing URL"]);
//             await use(land); // Use each land object as data for a separate test
//             // Write test logic here, using `land` properties like `land["Affilka Landing URL"]`
//             // ...
//       }
// },

//});

export const tapLandFixture = base.extend<{ tapLandList: Landing[] },
      { landList: Landing[] }>({
            landList: [landList,
                  { scope: "worker", option: true }], // Define landList as a test option

            tapLandList: async ({ }, use, testInfo) => {
                  const filteredLandListByRegion = landList.filter(
                        (land) => land.GEO === testInfo.project.name
                  );
                  const tapLandsArr = filteredLandListByRegion.filter((land) =>
                        land.Action.includes('Tap')
                  );
                  const tapLand = tapLandsArr.filter((land) => land.Type === 'Land');
                  console.log('in tapLand');
                  await use(tapLand);
            },
            // page: async ({ page, }, use) => {
            //       //console.log('in page', tapLand);
            //             await use(page);
            // }
      });



// 
// export const test = tapLandFixture.extend<{ tapLandInstance: Landing }>({
//       tapLandInstance: async ({ page}, use, testInfo) => {
//             for (const land of tapLand) {
//                   test.describe(`Test for ${land.Name}`, () => {
//                         test(`should handle tapLand ${land.Name}`, async ({ }) => {
//                               await use(land);
//                         });
//                   });
//             }
//       },
// });
