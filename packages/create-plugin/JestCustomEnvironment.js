const { TestEnvironment } = require("jest-environment-node");

class JestCustomEnvironment extends TestEnvironment {
  handleTestEvent(event) {
    if (event.name === "test_start") {
      const testName = event.test.name;
      console.log(`Running test: ${testName}`);
    }

    if (!this.global.testStatuses) {
      this.global.testStatuses = {};
    }

    if (event.name === "test_fn_success") {
      const testName = event.test.name;
      this.global.testStatuses[testName] = "passed";
    }
  }
}

module.exports = JestCustomEnvironment;
