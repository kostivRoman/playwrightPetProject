module.exports = {
	root: true,
	parser: "@typescript-eslint/parser",
	extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
	plugins: ["@typescript-eslint"],
	ignorePatterns: ["*.cjs"],
	parserOptions: {
		sourceType: "module",
		ecmaVersion: 2020,
		project: "tsconfig.json",
		extraFileExtensions: [".svelte"],
		tsconfigRootDir: __dirname,
	},
	env: {
		browser: true,
		es2017: true,
		node: false,
	},
	rules: {
		"@typescript-eslint/no-floating-promises": "warn",
		"@typescript-eslint/no-unused-vars": "off",
	},
};
