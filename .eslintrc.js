/** @type {import("eslint").Linter.Config} */

module.exports = {
  ignorePatterns: ["apps/**", "packages/**"],
  extends: [
    "@repo/eslint-config/library.js",
    "plugin:turbo/recommended" // Add turbo plugin here
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  plugins: [
    "turbo" // Declare the turbo plugin here
  ],
  rules: {
    "no-unused-vars": "off",
    "no-redeclare": "off",
  }
};
