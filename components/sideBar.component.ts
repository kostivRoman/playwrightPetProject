import { step } from "@helpers";
import { Component } from "@page.object";
import { expect } from "@playwright/test";


export class SideBar extends Component{

      private sideBar = this.page.getByLabel('Sidepanel');
      private sideBarHeader = this.sideBar.getByRole('link', { name: 'client brand banner' });
      private sideBarMenu = this.sideBar.getByRole('list');
      private sideBarSearch = this.sideBar.getByRole('textbox', { name: 'Search' });
      private hideButton = this.sideBar.getByRole('button');

      @step()
      async expectLoaded() {
            await expect(this.sideBar).toBeVisible();
            await expect(this.sideBarHeader).toBeVisible();
            await expect(this.sideBarMenu).toBeVisible();
            await expect(this.sideBarSearch).toBeVisible();
      }
      @step()
      async searchFor(searchText: string) {
            await this.sideBarSearch.fill(searchText);
      }
      @step()
      async selectMenuItem(menuItem: string) {
            await this.sideBarMenu.getByRole('link', { name: menuItem }).click();
      }
      @step()
      async hide_show() {
            await this.hideButton.click();
      }

}