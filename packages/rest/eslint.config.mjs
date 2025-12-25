import rootConfig from "../../eslint.config.mjs";
import vitest from "eslint-plugin-vitest";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...rootConfig,
  {
    ignores: ["lib", "umd", "src/schemas"],
  },
  {
    files: ["**/*.test.ts", "**/__tests__/**/*.ts", "__e2e__/**/*.ts"],
    plugins: { vitest },
    languageOptions: {
      globals: vitest.environments.env.globals,
    },
  },
  {
    rules: {
      "new-cap": [
        "warn",
        {
          capIsNewExceptions: [
            "Deferred", // Because it is defined in the inheritance source.
            "GET",
            "POST",
            "PUT",
            "DELETE",
          ],
        },
      ],
    },
  },
];
