import { Locator } from "playwright";

export const filterLocators = async (defaultValue: string, locators: Locator[]) => {
      const ItemsFiltered = async () => {
            const filteredItems = [];
            for (const locator of locators) {
                  const locatorText = await locator.innerText();
                  if (locatorText !== defaultValue) {
                        filteredItems.push(locator);
                  }
            }
            return filteredItems;
      };
      return await ItemsFiltered();
};