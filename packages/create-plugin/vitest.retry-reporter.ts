import type { Reporter, TestCase } from "vitest/node";

/**
 * Reports tests that needed retries, so that flakiness hidden by the
 * `retry` option stays visible. On GitHub Actions the report becomes a
 * warning annotation on the workflow run.
 */
export default class RetryReporter implements Reporter {
  onTestCaseResult(testCase: TestCase): void {
    const retryCount = testCase.diagnostic()?.retryCount ?? 0;
    if (retryCount === 0) {
      return;
    }
    const message = `Test "${testCase.fullName}" (${testCase.module.moduleId}) was retried ${retryCount} time(s) and finally ${testCase.result().state}`;
    if (process.env.GITHUB_ACTIONS) {
      console.log(`::warning title=Flaky test detected::${message}`);
    } else {
      console.warn(`[retry-reporter] ${message}`);
    }
  }
}
