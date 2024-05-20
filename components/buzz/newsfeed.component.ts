import { step } from "@helpers";
import { Component } from "@page.object";
import { expect } from "@playwright/test";

/**
 * Represents a news feed component.
 */
export class NewsFeed extends Component {
      private newsFeedContainer = this.page.locator('.orangehrm-buzz-newsfeed-posts');
      private newsItem = this.newsFeedContainer.locator('.oxd-grid-item');

      /**
       * Retrieves a news item by its text.
       * @param text - The text of the news item.
       * @returns A Promise that resolves to the news item.
       */
      private async getNewsItemByText(text: string) {
            return this.newsItem.getByText(text);
      }

      /**
       * Expects the news feed to be loaded and visible.
       * @param message - An optional message to include in the assertion error.
       * @returns A Promise that resolves when the expectation is met.
       */
      @step()
      async expectLoaded(message?: string): Promise<void> {
            await expect(this.newsFeedContainer).toBeVisible();
      }

      /**
       * Verifies that a news item with the specified text exists.
       * @param text - The text of the news item.
       * @returns A Promise that resolves when the verification is complete.
       */
      @step()
      async verifyNewsItemExists(text: string) {
            const newsItem = (await this.getNewsItemByText(text)).first();
            await expect(newsItem).toBeVisible();
      }

      /**
       * Verifies that a news item with the specified text does not exist.
       * @param text - The text of the news item.
       * @returns A Promise that resolves when the verification is complete.
       */
      @step()
      async verifyNewsItemDoesNotExist(text: string) {
            const newsItem = (await this.getNewsItemByText(text)).first();
            await this.expectLoaded();
            await expect(newsItem).not.toBeVisible();
      }

      /**
       * Deletes a news item with the specified text.
       * @param text - The text of the news item.
       * @returns A Promise that resolves when the deletion is complete.
       */
      @step()
      async deleteNewsItem(text: string) {
            const regex = new RegExp(`${text}`, 'g');
            const currentItem = this.newsItem.filter({ hasText: regex });
            const threeDotsButton = currentItem.locator('li > .oxd-icon-button').first();
            const deleteButton = currentItem.getByText('Delete Post');
            await threeDotsButton.click();
            await deleteButton.click();
      }
}