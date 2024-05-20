import { expect } from "@playwright/test";
import { AppPage } from "@page.object";
import { step } from "@helpers";
import { buzz, SideBar } from "@components";

/**
 * Represents the Buzz page of the application.
 */
export class Buzz extends AppPage {
	public pagePath = "/web/index.php/buzz/viewBuzz";
	public sideBar = new SideBar(this.page);
	public newsFeed = new buzz.NewsFeed(this.page);
	public confirmationPopup = new buzz.ConfirmationPopup(this.page);
	private postInput = this.page.getByPlaceholder("What's on your mind?");
	private postButton = this.page.getByRole("button", {
		name: "Post",
		exact: true,
	});
	/**
	 * Checks if the Buzz page is loaded successfully.
	 */
	@step()
	async expectLoaded() {
		await expect(this.postButton).toBeVisible();
		await expect(this.postInput).toBeVisible();
		await expect(this.postButton).toBeVisible();
		await this.newsFeed.expectLoaded();
	}

	/**
	 * Adds a new post with the specified message.
	 * @param message - The message to be added as a new post.
	 */
	@step()
	async addNewPost(message: string) {
		await this.postInput.fill(message);
		await this.postButton.click();
	}

	/**
	 * Expects a notification with the specified message to be visible.
	 * @param message - The message of the expected notification.
	 */
	@step()
	async expectNotification(message: string): Promise<void> {
		await expect(this.page.getByText(message)).toBeVisible();
	}
}
