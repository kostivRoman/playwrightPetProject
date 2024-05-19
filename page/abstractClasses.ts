import { expect, Page } from "@playwright/test";
import { step } from "@helpers";

/**
 * Represents a base class for holding a page object.
 */
export abstract class PageHolder {
	constructor(protected page: Page) {}
}
/**
 * Represents an abstract component.
 * @abstract
 * @class Component
 * @extends PageHolder
 */
export abstract class Component extends PageHolder {
	/**
	 * Checks if the component is loaded.
	 * @param {string} [message] - An optional message to display if the component is not loaded.
	 * @returns {Promise<void>} A promise that resolves when the component is loaded.
	 * @abstract
	 */
	abstract expectLoaded(message?: string): Promise<void>;

	/**
	 * Checks if the component is loaded.
	 * @returns {Promise<boolean>} A promise that resolves to `true` if the component is loaded, or `false` otherwise.
	 */
	@step()
	async isLoaded(): Promise<boolean> {
		try {
			await this.expectLoaded();
			return true;
		} catch {
			return false;
		}
	}
}

/**
 * Represents an abstract class for an application page.
 * This class provides common functionality for opening pages and checking notifications.
 */
export abstract class AppPage extends Component {
	/**
	 * Path to the page can be relative to the baseUrl defined in playwright.config.ts
	 * or absolute (on your own risk)
	 */
	public abstract pagePath: string;

	/**
	 * Opens the page in the browser and expects it to be loaded successfully.
	 * @param path - Optional path to navigate to. If not provided, the pagePath property will be used.
	 */
	@step()
	async open(path?: string) {
		await this.page.goto(path ?? this.pagePath);
		await this.expectLoaded();
	}

	@step()
	/**
	 * Expects a notification with the specified message to be displayed.
	 *
	 * @param message - The expected message of the notification.
	 * @returns A promise that resolves when the notification is found with the expected message.
	 */
	async expectNotification(message: string) {
		await expect(this.page.getByRole("heading", { level: 4 })).toHaveText(
			message
		);
	}
}
