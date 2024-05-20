import { test } from "@fixtures"; 
import { randomUUID } from "crypto";


test.describe("Buzz", () => {
      test("should be able to add a new post", async ({ app: {
            buzz
      } }) => {
            const newPost = "Hello, World!" + randomUUID();
            await buzz.open();
            await buzz.addNewPost(newPost);
            await buzz.expectNotification("Successfully Saved");
            await buzz.newsFeed.verifyNewsItemExists(newPost);
      });
      test("should be able to delete a post", async ({ app: {
            buzz
      } }) => {
            const newPost = "Hello, World!" + randomUUID();
            await buzz.open();
            await buzz.addNewPost(newPost);
            await buzz.expectNotification("Successfully Saved");
            await buzz.newsFeed.verifyNewsItemExists(newPost);
            await buzz.newsFeed.deleteNewsItem(newPost);
            await buzz.confirmationPopup.confirm();
            await buzz.expectNotification("Successfully Deleted");
            await buzz.newsFeed.verifyNewsItemDoesNotExist(newPost);
      });
});