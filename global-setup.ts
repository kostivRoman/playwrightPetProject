// global-setup.ts
import { FullConfig, FullProject } from '@playwright/test';

async function globalSetup(config: FullConfig) {
      // get current project index
      
      for (const project of config.projects) {
            const projectName = project.name;
            process.env.PLAYWRIGHT_PROJECT_NAME = projectName;
            console.log(`Setting PLAYWRIGHT_PROJECT_NAME to ${projectName}`);
      }
}

export default globalSetup;