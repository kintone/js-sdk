import rootConfig from "../../eslint.config.mjs";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...rootConfig,
  {
    ignores: ["lib", "umd", "src/schemas"],
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
