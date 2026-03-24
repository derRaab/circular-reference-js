import pluginJs from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "comma-dangle": ["error", "always-multiline"],
      "no-implicit-any": "off",
      "no-multiple-empty-lines": ["error", { max: 3 }],
      "no-unused-vars": ["error", { args: "all" }],
    },
  },
];
