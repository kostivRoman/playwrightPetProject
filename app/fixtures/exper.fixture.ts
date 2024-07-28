import { test as base } from '@playwright/test'; // Replace with actual import
import { Landing, landList } from '../../testData/landList.data';
import * as fs from 'fs';
import * as path from 'path';

export const tapLandFixtureExp = base.extend<{ tapLandList: Landing[] }, { landList: Landing[] }>({
      landList: [landList, { scope: "worker", option: true }], // Define landList as a test option

      tapLandList: async ({ }, use, testInfo) => {
            const filteredLandListByRegion = landList.filter(
                  (land) => land.GEO === testInfo.project.name
            );
            const tapLandsArr = filteredLandListByRegion.filter((land) =>
                  land.Action.includes('Tap')
            );
            const tapLand = tapLandsArr.filter((land) => land.Type === 'Land');
            console.log('in tapLand');

            // Convert the tapLand array to a JSON string
            const tapLandJson = JSON.stringify(tapLand, null, 2);

            // Define the file path
            const filePath = path.join(__dirname, `tapLandList.json`);

            // Write the JSON string to a file
            fs.writeFileSync(filePath, tapLandJson, 'utf8');

            await use(tapLand);
      },
      page: async ({ page}, use) => {
            //console.log('in page', tapLand);
                  await use(page);
      }
});