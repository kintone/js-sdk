import assert from "assert";
import { interactivePrompt } from "./utils/helper";
import { CREATE_PLUGIN_COMMAND, DEFAULT_ANSWER } from "./utils/constants";

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
    const response = await interactivePrompt(
      CREATE_PLUGIN_COMMAND,
      outputDir,
      ANSWER,
    );

    console.log("stdout", response.stdout?.toString());
    console.log("stderr:", response.stderr?.toString());
    assert(response.status === 0, "Failed to create plugin");
  });
});
