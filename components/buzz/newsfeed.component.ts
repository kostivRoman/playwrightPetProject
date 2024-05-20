import { step } from "@helpers";
import { Component } from "@page.object";
import { expect } from "@playwright/test";

export class NewsFeed extends Component {
      private newsFeedContainer = this.page.locator('.orangehrm-buzz-newsfeed-posts');
      private newsItem = this.newsFeedContainer
            .locator('.oxd-grid-item');


      private async getNewsItemByText(text: string) {
            return this.newsItem.getByText(text);
      }
      @step()
      async expectLoaded(message?: string): Promise<void> {
            await expect(this.newsFeedContainer).toBeVisible();
      }
      @step()
      async verifyNewsItemExists(text: string) {
            const newsItem = (await this.getNewsItemByText(text)).first();
            await expect(newsItem).toBeVisible();
      }
      @step()
      async verifyNewsItemDoesNotExist(text: string) {
            const newsItem = (await this.getNewsItemByText(text)).first();
            await this.expectLoaded();
            await expect(newsItem).not.toBeVisible();
      }
      @step()
      async deleteNewsItem(text: string) {
            const regex = new RegExp(`${text}`, 'g');
            console.log(regex)
            const currentItem = this.newsItem.filter({ hasText: regex })
            const threeDotsButton = currentItem.locator('li > .oxd-icon-button').first()
            const deleteButton = currentItem.getByText('Delete Post')
            await threeDotsButton.click();
            await deleteButton.click();
      }
}