import { step } from "@helpers";
import { Component } from "@page.object";
import { expect } from "@playwright/test";

/**
 * Represents the SideBar component.
 */
export class SideBar extends Component {
      private sideBar = this.page.getByLabel('Sidepanel');
      private sideBarHeader = this.sideBar.getByRole('link', { name: 'client brand banner' });
      private sideBarMenu = this.sideBar.getByRole('list');
      private sideBarSearch = this.sideBar.getByRole('textbox', { name: 'Search' });
      private hideButton = this.sideBar.getByRole('button');

      /**
       * Checks if the SideBar component is loaded and visible.
       */
      @step()
      async expectLoaded() {
            await expect(this.sideBar).toBeVisible();
            await expect(this.sideBarHeader).toBeVisible();
            await expect(this.sideBarMenu).toBeVisible();
            await expect(this.sideBarSearch).toBeVisible();
      }

      /**
       * Searches for a specific text in the SideBar search box.
       * @param searchText - The text to search for.
       */
      @step()
      async searchFor(searchText: string) {
            await this.sideBarSearch.fill(searchText);
      }

      /**
       * Selects a menu item in the SideBar.
       * @param menuItem - The name of the menu item to select.
       */
      @step()
      async selectMenuItem(menuItem: string) {
            await this.sideBarMenu.getByRole('link', { name: menuItem }).click();
      }

      /**
       * Hides or shows the SideBar.
       */
      @step()
      async hide_show() {
            await this.hideButton.click();
      }
}