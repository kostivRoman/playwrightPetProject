import { test as baseTest } from "@playwright/test";

// Extend the base test with a custom fixture
export const test = baseTest.extend<{ projectName: string }>({

      projectName: async ({ }, use, testInfo) => {
            // eslint-disable-next-line no-empty-pattern
		const projectName = testInfo.project.name;
		if (projectName === "TR") {
			test.skip();
		}
		await use(projectName);
	},
});


