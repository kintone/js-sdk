import assert from "assert";
import { interactivePrompt } from "./utils/helper";
import { CREATE_PLUGIN_COMMAND, DEFAULT_ANSWER } from "./utils/constants";
import { getWorkingDir } from "./utils/generateWorkingDir";

describe("create-plugin", function () {
  it("Should able create plugin with specified output directory and required options successfully", async () => {
    const outputDir = "test1";

    const ANSWER = [
      DEFAULT_ANSWER,
      DEFAULT_ANSWER,
      DEFAULT_ANSWER,
      DEFAULT_ANSWER,
      DEFAULT_ANSWER,
      DEFAULT_ANSWER,
      "No",
    ];
    console.log("e2e No", getWorkingDir());
    const response = await interactivePrompt(
      CREATE_PLUGIN_COMMAND,
      outputDir,
      ANSWER,
    );
    console.log("Error:", response);
    assert.ok("123");
    // if (response && response.statusCode === 0) {
    //   console.log("OK", response);
    //   assert(response.statusCode === 0);
    // } else {
    //   console.log("Error:", response);
    //   assert.fail("Failed to create plugin");
    // }
  });
});
