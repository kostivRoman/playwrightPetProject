import { expect } from "@playwright/test";
import { AppPage } from "@page.object";
import { step } from "@helpers";
import {buzz,SideBar} from "@components";

export class Buzz extends AppPage {
      public pagePath = "/web/index.php/buzz/viewBuzz";
      public sideBar = new SideBar(this.page);
      public newsFeed = new buzz.NewsFeed(this.page);
      public confirmationPopup = new buzz.ConfirmationPopup(this.page);
      private postInput = this.page.getByPlaceholder('What\'s on your mind?')
      private postButton = this.page.getByRole('button', { name: 'Post', exact: true });
      private shareFotosButton = this.page.getByRole('button', { name: 'Share photos' });
      private shareVideoButton = this.page.getByRole('button', { name: 'Share Video' });

      @step()
      async expectLoaded() {
            await expect(this.postButton).toBeVisible();
            await expect(this.postInput).toBeVisible();
            await expect(this.postButton).toBeVisible();
            await this.newsFeed.expectLoaded();
      }
      @step()
      async addNewPost(message: string) {
            await this.postInput.fill(message);
            await this.postButton.click();
      }
      @step()
      async expectNotification(message: string): Promise<void> {
            await expect(this.page.getByText(message)).toBeVisible();
      }

}