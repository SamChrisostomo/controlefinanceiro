import globals from "globals";
import pluginJs from "@eslint/js";


export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "module"
    }
  },
  {
    languageOptions: {
      globals: globals.browser
    }
  },
  {
    "parserOptions": {
      "sourceType": "module",
    }
  },
  pluginJs.configs.recommended,
];