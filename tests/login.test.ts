import { test } from "@fixtures";


const user = {
	userName: process.env.LOGIN!,
	password: process.env.PASSWORD!,
};
console.log("user", user);
/**
 * Represents a test suite for login functionality.
 */
test.describe("Login", () => {
	/**
	 * Test case: User can login with valid credentials.
	 * @param app - The application object containing login functionality.
	 * @param context - The test context object.
	 */
	test("User can login with valid credentials", async ({
		app: { login },
		context,
	}) => {
		const user = {
			userName: process.env.LOGIN!,
			password: process.env.PASSWORD!,
		};
		await context.clearCookies();
		await login.open();
		await login.signIn(user);
		await login.expectSignedIn();
	});

	/**
	 * Test case: Login with invalid user name.
	 * @param app - The application object containing login functionality.
	 * @param context - The test context object.
	 */
	test("Login with invalid user name", async ({ app: { login }, context }) => {
		const user = {
			userName: "Admn",
			password: process.env.PASSWORD!,
		};
		await context.clearCookies();
		await login.open();
		await login.signIn(user);
		await login.expectErrorNotification("Invalid credentials");
	});

	/**
	 * Test case: Login with invalid password.
	 * @param app - The application object containing login functionality.
	 * @param context - The test context object.
	 */
	// test("Login with invalid password", async ({ app: { login }, context }) => {
	// 	const user = {
	// 		userName: process.env.USERNAME!,
	// 		password: "admin",
	// 	};
	// 	await context.clearCookies();
	// 	await login.open();
	// 	await login.signIn(user);
	// 	await login.expectErrorNotification("Invalid credentials");
	// });

	/**
	 * Test case: Login with empty user name.
	 * @param app - The application object containing login functionality.
	 * @param context - The test context object.
	 */
	test("Login with empty user name", async ({ app: { login }, context }) => {
		const user = {
			userName: "",
			password: process.env.PASSWORD!,
		};
		await context.clearCookies();
		await login.open();
		await login.signIn(user);
		await login.expectErrorNotification("Required");
	});

	/**
	 * Test case: Login with empty password.
	 * @param app - The application object containing login functionality.
	 * @param context - The test context object.
	 */
	// test("Login with empty password", async ({ app: { login }, context }) => {
	// 	const user = {
	// 		userName: process.env.USERNAME!,
	// 		password: "",
	// 	};
	// 	await context.clearCookies();
	// 	await login.open();
	// 	await login.signIn(user);
	// 	await login.expectErrorNotification("Required");
	// });
});
